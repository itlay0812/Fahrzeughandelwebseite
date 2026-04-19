import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.ts";
const app = new Hono();

type SubmissionStatus = "unbearbeitet" | "in_progress" | "abgeschlossen";

type SubmissionDocument = {
  id: string;
  displayName: string;
  fileName: string;
  path: string;
  size: number;
  createdAt: string;
  url: string;
};

type Submission = {
  id: string;
  createdAt: string;
  status?: SubmissionStatus;
  internalNotes?: string;
  documents?: SubmissionDocument[];
  [key: string]: unknown;
};

const DOCUMENT_BUCKET = "submission-docs";
const ALLOWED_STATUSES: SubmissionStatus[] = ["unbearbeitet", "in_progress", "abgeschlossen"];

function getAnonClient() {
  return createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_ANON_KEY") || "");
}

function getAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  );
}

function normalizeSubmission(item: Submission): Submission {
  return {
    ...item,
    status: ALLOWED_STATUSES.includes((item.status || "") as SubmissionStatus)
      ? (item.status as SubmissionStatus)
      : "unbearbeitet",
    internalNotes: typeof item.internalNotes === "string" ? item.internalNotes : "",
    documents: Array.isArray(item.documents) ? item.documents : [],
  };
}

async function requireAuth(c: any) {
  const userToken = c.req.header("X-User-Token");
  if (!userToken) {
    return { error: c.json({ error: "Missing X-User-Token header" }, 401) };
  }

  const supabase = getAnonClient();
  const { data: { user }, error } = await supabase.auth.getUser(userToken);
  if (error || !user) {
    return { error: c.json({ error: "Unauthorized: Invalid token" }, 401) };
  }

  return { user };
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin user creation endpoint
app.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      user_metadata: { role: 'admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error creating admin:', error);
      return c.json({ error: error.message }, 400);
    }
    return c.json({ user: data.user }, 200);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Submit a form request
app.post("/submissions", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const submission: Submission = {
      id,
      createdAt: new Date().toISOString(),
      ...body,
      status: "unbearbeitet",
      internalNotes: "",
      documents: [],
    };
    
    await kv.set(`submission:${id}`, submission);
    return c.json({ success: true, submission }, 201);
  } catch (error) {
    console.error('Submission error:', error);
    return c.json({ error: 'Failed to save submission' }, 500);
  }
});

// Get all submissions (Admin Only)
app.get("/submissions", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const items = await kv.getByPrefix('submission:') || [];
    
    // Sort items safely by createdAt descending
    const normalizedItems = items.map((item: Submission) => normalizeSubmission(item));

    normalizedItems.sort((a: any, b: any) => {
      const timeA = a && a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b && b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return c.json({ items: normalizedItems }, 200);
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return c.json({ error: 'Failed to fetch submissions', details: error.message }, 500);
  }
});

// Update submission status and internal notes (Admin Only)
app.patch("/submissions/:id/meta", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const id = c.req.param("id");
    const body = await c.req.json();
    const current = await kv.get(`submission:${id}`);

    if (!current) {
      return c.json({ error: "Submission not found" }, 404);
    }

    const normalizedCurrent = normalizeSubmission(current as Submission);
    const nextStatus = body.status as SubmissionStatus | undefined;

    if (nextStatus && !ALLOWED_STATUSES.includes(nextStatus)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    const updated: Submission = {
      ...normalizedCurrent,
      status: nextStatus || normalizedCurrent.status,
      internalNotes:
        typeof body.internalNotes === "string"
          ? body.internalNotes
          : normalizedCurrent.internalNotes,
      documents: normalizedCurrent.documents,
    };

    await kv.set(`submission:${id}`, updated);
    return c.json({ success: true, submission: updated }, 200);
  } catch (error: any) {
    console.error("Update meta error:", error);
    return c.json({ error: "Failed to update submission metadata", details: error.message }, 500);
  }
});

// Upload document for a submission (Admin Only)
app.post("/submissions/:id/documents", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const id = c.req.param("id");
    const current = await kv.get(`submission:${id}`);

    if (!current) {
      return c.json({ error: "Submission not found" }, 404);
    }

    const normalizedCurrent = normalizeSubmission(current as Submission);
    const formData = await c.req.formData();
    const file = formData.get("file");
    const displayName = String(formData.get("displayName") || "").trim();

    if (!(file instanceof File)) {
      return c.json({ error: "No valid file provided" }, 400);
    }

    if (!displayName) {
      return c.json({ error: "displayName is required" }, 400);
    }

    const safeFileName = sanitizeFileName(file.name || "document");
    const objectPath = `${id}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
    const adminClient = getAdminClient();

    const uploadResult = await adminClient.storage
      .from(DOCUMENT_BUCKET)
      .upload(objectPath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadResult.error) {
      return c.json(
        {
          error: `Upload failed. Ensure storage bucket '${DOCUMENT_BUCKET}' exists.`,
          details: uploadResult.error.message,
        },
        500,
      );
    }

    const { data: publicUrlData } = adminClient.storage.from(DOCUMENT_BUCKET).getPublicUrl(objectPath);

    const document: SubmissionDocument = {
      id: crypto.randomUUID(),
      displayName,
      fileName: file.name,
      path: objectPath,
      size: file.size,
      createdAt: new Date().toISOString(),
      url: publicUrlData.publicUrl,
    };

    const updated: Submission = {
      ...normalizedCurrent,
      documents: [...(normalizedCurrent.documents || []), document],
    };

    await kv.set(`submission:${id}`, updated);
    return c.json({ success: true, submission: updated, document }, 201);
  } catch (error: any) {
    console.error("Upload document error:", error);
    return c.json({ error: "Failed to upload document", details: error.message }, 500);
  }
});

// Delete document from a submission (Admin Only)
app.delete("/submissions/:id/documents/:docId", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const id = c.req.param("id");
    const docId = c.req.param("docId");
    const current = await kv.get(`submission:${id}`);

    if (!current) {
      return c.json({ error: "Submission not found" }, 404);
    }

    const normalizedCurrent = normalizeSubmission(current as Submission);
    const docs = normalizedCurrent.documents || [];
    const docToDelete = docs.find((doc) => doc.id === docId);

    if (!docToDelete) {
      return c.json({ error: "Document not found" }, 404);
    }

    const adminClient = getAdminClient();
    const removeResult = await adminClient.storage.from(DOCUMENT_BUCKET).remove([docToDelete.path]);
    if (removeResult.error) {
      return c.json({ error: "Failed to delete file from storage", details: removeResult.error.message }, 500);
    }

    const updated: Submission = {
      ...normalizedCurrent,
      documents: docs.filter((doc) => doc.id !== docId),
    };

    await kv.set(`submission:${id}`, updated);
    return c.json({ success: true, submission: updated }, 200);
  } catch (error: any) {
    console.error("Delete document error:", error);
    return c.json({ error: "Failed to delete document", details: error.message }, 500);
  }
});

// Delete a submission (Admin Only)
app.delete("/submissions/:id", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const id = c.req.param('id');
    const current = await kv.get(`submission:${id}`);

    if (current) {
      const normalizedCurrent = normalizeSubmission(current as Submission);
      const docs = normalizedCurrent.documents || [];
      if (docs.length > 0) {
        const adminClient = getAdminClient();
        await adminClient.storage.from(DOCUMENT_BUCKET).remove(docs.map((doc) => doc.path));
      }
    }

    await kv.del(`submission:${id}`);
    
    return c.json({ success: true }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to delete submission' }, 500);
  }
});

Deno.serve(app.fetch);
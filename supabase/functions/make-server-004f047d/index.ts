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
  folder?: string;
  dateSegment?: string;
};

type FinanceEntryType = "umsatz" | "kosten" | "einnahmen";

type FinanceEntry = {
  id: string;
  type: FinanceEntryType;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
};

type FinanceDocument = {
  id: string;
  displayName: string;
  fileName: string;
  path: string;
  size: number;
  createdAt: string;
  url: string;
  folder: string;
  dateSegment: string;
};

type FinanceData = {
  entries: FinanceEntry[];
  documents: FinanceDocument[];
};

type Submission = {
  id: string;
  createdAt: string;
  status?: SubmissionStatus;
  internalNotes?: string;
  purchasePrice?: number;
  salePrice?: number;
  costs?: number;
  profit?: number;
  documents?: SubmissionDocument[];
  [key: string]: unknown;
};

const DOCUMENT_BUCKET = "submission-docs";
const ALLOWED_STATUSES: SubmissionStatus[] = ["unbearbeitet", "in_progress", "abgeschlossen"];
const ALLOWED_FINANCE_TYPES: FinanceEntryType[] = ["umsatz", "kosten", "einnahmen"];
const DEFAULT_DOCUMENT_FOLDERS = ["Rechnungen", "Kundendokumente"];

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
  const normalizedDocuments = Array.isArray(item.documents)
    ? item.documents.map((doc) => {
      const parsedDate = getDateSegment(doc.createdAt);
      return {
        ...doc,
        folder: typeof doc.folder === "string" && doc.folder.trim() ? doc.folder : "Kundendokumente",
        dateSegment:
          typeof doc.dateSegment === "string" && doc.dateSegment.trim()
            ? doc.dateSegment
            : parsedDate.dateSegment,
      };
    })
    : [];

  const purchasePrice = Number.isFinite(Number(item.purchasePrice))
    ? Number(item.purchasePrice)
    : Number.isFinite(Number(item.costPrice))
      ? Number(item.costPrice)
      : 0;
  const salePrice = Number.isFinite(Number(item.salePrice))
    ? Number(item.salePrice)
    : Number.isFinite(Number(item.revenue))
      ? Number(item.revenue)
      : 0;
  const costs = Number.isFinite(Number(item.costs)) ? Number(item.costs) : 0;
  const profit = Number.isFinite(Number(item.profit))
    ? Number(item.profit)
    : salePrice - purchasePrice - costs;

  return {
    ...item,
    status: ALLOWED_STATUSES.includes((item.status || "") as SubmissionStatus)
      ? (item.status as SubmissionStatus)
      : "unbearbeitet",
    internalNotes: typeof item.internalNotes === "string" ? item.internalNotes : "",
    purchasePrice,
    salePrice,
    costs,
    profit,
    documents: normalizedDocuments,
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

function sanitizeFolderPath(folderPath: string) {
  const trimmed = folderPath.trim();
  if (!trimmed) return "Kundendokumente";

  const segments = trimmed
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9 _-]/g, "_"));

  if (!segments.length) return "Kundendokumente";
  return segments.join("/");
}

function getDateSegment(input?: string) {
  const base = input ? new Date(input) : new Date();
  const safeDate = Number.isNaN(base.getTime()) ? new Date() : base;
  const year = safeDate.getUTCFullYear();
  const month = String(safeDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(safeDate.getUTCDate()).padStart(2, "0");
  return {
    year,
    month,
    day,
    dateSegment: `${year}-${month}`,
  };
}

function normalizeFinanceData(value: unknown): FinanceData {
  const current = (value || {}) as FinanceData;
  return {
    entries: Array.isArray(current.entries) ? current.entries : [],
    documents: Array.isArray(current.documents) ? current.documents : [],
  };
}

async function getFinanceData(): Promise<FinanceData> {
  const current = await kv.get("finance:data");
  return normalizeFinanceData(current);
}

async function setFinanceData(next: FinanceData): Promise<void> {
  await kv.set("finance:data", next);
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-004f047d/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin user creation endpoint
app.post("/make-server-004f047d/signup", async (c) => {
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
app.post("/make-server-004f047d/submissions", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const submission: Submission = {
      id,
      createdAt: new Date().toISOString(),
      ...body,
      status: "unbearbeitet",
      internalNotes: "",
      purchasePrice: 0,
      salePrice: 0,
      costs: 0,
      profit: 0,
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
app.get("/make-server-004f047d/submissions", async (c) => {
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

// Update submission metadata (Admin Only)
app.patch("/make-server-004f047d/submissions/:id/meta", async (c) => {
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
    const nextPurchasePriceRaw = body.purchasePrice;
    const nextSalePriceRaw = body.salePrice;
    const nextCostsRaw = body.costs;

    if (nextStatus && !ALLOWED_STATUSES.includes(nextStatus)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    if (nextPurchasePriceRaw !== undefined) {
      const parsed = Number(nextPurchasePriceRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return c.json({ error: "Invalid purchasePrice" }, 400);
      }
    }

    if (nextSalePriceRaw !== undefined) {
      const parsed = Number(nextSalePriceRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return c.json({ error: "Invalid salePrice" }, 400);
      }
    }

    if (nextCostsRaw !== undefined) {
      const parsed = Number(nextCostsRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return c.json({ error: "Invalid costs" }, 400);
      }
    }

    const purchasePrice =
      nextPurchasePriceRaw !== undefined ? Number(nextPurchasePriceRaw) : Number(normalizedCurrent.purchasePrice || 0);
    const salePrice =
      nextSalePriceRaw !== undefined ? Number(nextSalePriceRaw) : Number(normalizedCurrent.salePrice || 0);
    const costs =
      nextCostsRaw !== undefined ? Number(nextCostsRaw) : Number(normalizedCurrent.costs || 0);
    const profit = salePrice - purchasePrice - costs;

    const updated: Submission = {
      ...normalizedCurrent,
      status: nextStatus || normalizedCurrent.status,
      internalNotes:
        typeof body.internalNotes === "string"
          ? body.internalNotes
          : normalizedCurrent.internalNotes,
      purchasePrice,
      salePrice,
      costs,
      profit:
        profit,
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
app.post("/make-server-004f047d/submissions/:id/documents", async (c) => {
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
    const folder = sanitizeFolderPath(String(formData.get("folder") || "Kundendokumente"));
    const documentDate = String(formData.get("documentDate") || "").trim();

    if (!(file instanceof File)) {
      return c.json({ error: "No valid file provided" }, 400);
    }

    if (!displayName) {
      return c.json({ error: "displayName is required" }, 400);
    }

    const safeFileName = sanitizeFileName(file.name || "document");
    const dateInfo = getDateSegment(documentDate);
    const objectPath = `${id}/${folder}/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
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
      folder,
      dateSegment: dateInfo.dateSegment,
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
app.delete("/make-server-004f047d/submissions/:id/documents/:docId", async (c) => {
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

// Finance overview (Admin Only)
app.get("/make-server-004f047d/finance", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const financeData = await getFinanceData();
    return c.json({ finance: financeData }, 200);
  } catch (error: any) {
    console.error("Fetch finance error:", error);
    return c.json({ error: "Failed to fetch finance data", details: error.message }, 500);
  }
});

// Add finance entry (Admin Only)
app.post("/make-server-004f047d/finance/entries", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const body = await c.req.json();
    const type = String(body.type || "").trim() as FinanceEntryType;
    const amount = Number(body.amount || 0);
    const dateInput = String(body.date || "").trim();
    const note = String(body.note || "").trim();

    if (!ALLOWED_FINANCE_TYPES.includes(type)) {
      return c.json({ error: "Invalid finance type" }, 400);
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return c.json({ error: "amount must be a positive number" }, 400);
    }

    const safeDate = dateInput && !Number.isNaN(new Date(dateInput).getTime())
      ? new Date(dateInput).toISOString()
      : new Date().toISOString();

    const financeData = await getFinanceData();
    const entry: FinanceEntry = {
      id: crypto.randomUUID(),
      type,
      amount,
      date: safeDate,
      note,
      createdAt: new Date().toISOString(),
    };

    const updated: FinanceData = {
      ...financeData,
      entries: [...financeData.entries, entry],
    };

    await setFinanceData(updated);
    return c.json({ success: true, finance: updated, entry }, 201);
  } catch (error: any) {
    console.error("Create finance entry error:", error);
    return c.json({ error: "Failed to create finance entry", details: error.message }, 500);
  }
});

// Delete finance entry (Admin Only)
app.delete("/make-server-004f047d/finance/entries/:entryId", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const entryId = c.req.param("entryId");
    const financeData = await getFinanceData();
    const exists = financeData.entries.some((entry) => entry.id === entryId);

    if (!exists) {
      return c.json({ error: "Finance entry not found" }, 404);
    }

    const updated: FinanceData = {
      ...financeData,
      entries: financeData.entries.filter((entry) => entry.id !== entryId),
    };

    await setFinanceData(updated);
    return c.json({ success: true, finance: updated }, 200);
  } catch (error: any) {
    console.error("Delete finance entry error:", error);
    return c.json({ error: "Failed to delete finance entry", details: error.message }, 500);
  }
});

// Upload finance document with folder/date structure (Admin Only)
app.post("/make-server-004f047d/finance/documents", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const formData = await c.req.formData();
    const file = formData.get("file");
    const displayName = String(formData.get("displayName") || "").trim();
    const folderInput = String(formData.get("folder") || "").trim();
    const documentDate = String(formData.get("documentDate") || "").trim();
    const folder = sanitizeFolderPath(folderInput || DEFAULT_DOCUMENT_FOLDERS[0]);

    if (!(file instanceof File)) {
      return c.json({ error: "No valid file provided" }, 400);
    }

    if (!displayName) {
      return c.json({ error: "displayName is required" }, 400);
    }

    const safeFileName = sanitizeFileName(file.name || "document");
    const dateInfo = getDateSegment(documentDate);
    const objectPath = `finance/${folder}/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
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

    const financeData = await getFinanceData();
    const document: FinanceDocument = {
      id: crypto.randomUUID(),
      displayName,
      fileName: file.name,
      path: objectPath,
      size: file.size,
      createdAt: new Date().toISOString(),
      url: publicUrlData.publicUrl,
      folder,
      dateSegment: dateInfo.dateSegment,
    };

    const updated: FinanceData = {
      ...financeData,
      documents: [...financeData.documents, document],
    };

    await setFinanceData(updated);
    return c.json({ success: true, finance: updated, document }, 201);
  } catch (error: any) {
    console.error("Upload finance document error:", error);
    return c.json({ error: "Failed to upload finance document", details: error.message }, 500);
  }
});

// Delete finance document (Admin Only)
app.delete("/make-server-004f047d/finance/documents/:docId", async (c) => {
  try {
    const auth = await requireAuth(c);
    if (auth.error) {
      return auth.error;
    }

    const docId = c.req.param("docId");
    const financeData = await getFinanceData();
    const docToDelete = financeData.documents.find((doc) => doc.id === docId);

    if (!docToDelete) {
      return c.json({ error: "Finance document not found" }, 404);
    }

    const adminClient = getAdminClient();
    const removeResult = await adminClient.storage.from(DOCUMENT_BUCKET).remove([docToDelete.path]);
    if (removeResult.error) {
      return c.json({ error: "Failed to delete file from storage", details: removeResult.error.message }, 500);
    }

    const updated: FinanceData = {
      ...financeData,
      documents: financeData.documents.filter((doc) => doc.id !== docId),
    };

    await setFinanceData(updated);
    return c.json({ success: true, finance: updated }, 200);
  } catch (error: any) {
    console.error("Delete finance document error:", error);
    return c.json({ error: "Failed to delete finance document", details: error.message }, 500);
  }
});

// Delete a submission (Admin Only)
app.delete("/make-server-004f047d/submissions/:id", async (c) => {
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
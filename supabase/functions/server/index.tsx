import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
    const submission = {
      id,
      createdAt: new Date().toISOString(),
      ...body
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
    const userToken = c.req.header('X-User-Token');
    if (!userToken) {
      return c.json({ error: 'Missing X-User-Token header' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: { user }, error } = await supabase.auth.getUser(userToken);
    
    if (error || !user) {
      console.error("Auth Error:", error);
      return c.json({ error: 'Unauthorized: Invalid token', details: error }, 401);
    }

    const items = await kv.getByPrefix('submission:') || [];
    
    // Sort items safely by createdAt descending
    items.sort((a: any, b: any) => {
      const timeA = a && a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b && b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return c.json({ items }, 200);
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return c.json({ error: 'Failed to fetch submissions', details: error.message }, 500);
  }
});

// Delete a submission (Admin Only)
app.delete("/make-server-004f047d/submissions/:id", async (c) => {
  try {
    const userToken = c.req.header('X-User-Token');
    if (!userToken) return c.json({ error: 'Unauthorized' }, 401);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error } = await supabase.auth.getUser(userToken);
    if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    await kv.del(`submission:${id}`);
    
    return c.json({ success: true }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to delete submission' }, 500);
  }
});

Deno.serve(app.fetch);
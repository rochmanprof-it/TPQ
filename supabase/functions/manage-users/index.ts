import { createClient } from "@supabase/supabase-js";

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProfilePayload {
  username: string;
  name: string;
  role: "admin" | "kepala" | "pengajar" | "wali_murid";
  title?: string;
  email: string;
  phone: string;
  student_id?: string;
  student_name?: string;
  password?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Create a client with the caller's token to verify their role
    const authHeader = req.headers.get("Authorization") || "";
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: callerData, error: callerError } =
      await callerClient.auth.getUser();
    if (callerError || !callerData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify caller is admin
    const { data: callerProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", callerData.user.id)
      .maybeSingle();

    if (profileError || !callerProfile || callerProfile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const method = req.method;
    const url = new URL(req.url);

    // GET: list all users with profiles
    if (method === "GET") {
      const { data, error } = await adminClient
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ users: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // POST: create new user
    if (method === "POST") {
      const body: ProfilePayload = await req.json();
      const { username, name, role, title, email, phone, student_id, student_name, password } = body;

      if (!email || !password || !name || !role || !username) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: username, name, role, email, password" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Create auth user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Insert profile
      const { error: profileErr } = await adminClient.from("profiles").insert({
        id: authData.user.id,
        username,
        name,
        role,
        title: title || null,
        email,
        phone: phone || "",
        student_id: student_id || null,
        student_name: student_name || null,
      });

      if (profileErr) {
        // Rollback: delete the auth user if profile insert failed
        await adminClient.auth.admin.deleteUser(authData.user.id);
        return new Response(
          JSON.stringify({ error: profileErr.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true, id: authData.user.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // PUT: update user
    if (method === "PUT") {
      const userId = url.searchParams.get("id");
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing id parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const body: Partial<ProfilePayload> = await req.json();
      const { username, name, role, title, phone, student_id, student_name, email, password } = body;

      // Update profile
      const updateData: Record<string, unknown> = {};
      if (username) updateData.username = username;
      if (name) updateData.name = name;
      if (role) updateData.role = role;
      if (title !== undefined) updateData.title = title || null;
      if (phone) updateData.phone = phone;
      if (student_id !== undefined) updateData.student_id = student_id || null;
      if (student_name !== undefined) updateData.student_name = student_name || null;
      if (email) updateData.email = email;

      const { error: profileErr } = await adminClient
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (profileErr) {
        return new Response(
          JSON.stringify({ error: profileErr.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Update email in auth if changed
      if (email) {
        await adminClient.auth.admin.updateUserById(userId, { email });
      }

      // Update password if provided
      if (password) {
        await adminClient.auth.admin.updateUserById(userId, { password });
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // DELETE: remove user
    if (method === "DELETE") {
      const userId = url.searchParams.get("id");
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing id parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Prevent self-deletion
      if (userId === callerData.user.id) {
        return new Response(
          JSON.stringify({ error: "Cannot delete your own account" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Delete profile (will cascade from auth user deletion, but delete both)
      await adminClient.from("profiles").delete().eq("id", userId);

      const { error: authErr } = await adminClient.auth.admin.deleteUser(userId);
      if (authErr) {
        return new Response(
          JSON.stringify({ error: authErr.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

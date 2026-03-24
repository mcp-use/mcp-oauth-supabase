import { MCPServer, oauthSupabaseProvider, text, object, error, widget } from "mcp-use/server";
import { z } from "zod";

function getAuth(ctx: { auth?: unknown }): { user: Record<string, any>; accessToken: string; scopes: string[] } | null {
  const auth = ctx.auth as { user?: Record<string, any>; accessToken?: string; scopes?: string[] } | undefined;
  if (!auth) return null;
  return { user: auth.user ?? {}, accessToken: auth.accessToken ?? "", scopes: auth.scopes ?? [] };
}

const SUPABASE_PROJECT_ID = process.env.MCP_USE_OAUTH_SUPABASE_PROJECT_ID ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

const server = new MCPServer({
  name: "oauth-supabase",
  title: "Supabase OAuth Demo",
  version: "1.0.0",
  description: "Authenticated MCP server with Supabase OAuth — user data, todos, and protected tools",
  baseUrl: process.env.MCP_URL || "http://localhost:3000",
  oauth: process.env.MCP_USE_OAUTH_SUPABASE_PROJECT_ID
    ? oauthSupabaseProvider()
    : undefined,
});

server.tool(
  {
    name: "get-profile",
    description: "Get the authenticated user's profile information",
    schema: z.object({}),
    widget: { name: "user-dashboard", invoking: "Loading profile...", invoked: "Profile loaded" },
  },
  async (_params, ctx) => {
    const auth = getAuth(ctx);
    if (!auth) return error("Not authenticated. Please connect via OAuth first.");

    const { userId, email } = auth.user;
    return widget({
      props: {
        user: { userId, email },
        todos: [],
        isAuthenticated: true,
      },
      output: text(`Authenticated as ${email}`),
    });
  }
);

server.tool(
  {
    name: "list-todos",
    description: "List the authenticated user's todos from Supabase",
    schema: z.object({
      status: z.enum(["all", "pending", "completed"]).default("all").describe("Filter by status"),
    }),
    outputSchema: z.object({
      todos: z.array(z.object({
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
        created_at: z.string(),
      })),
      count: z.number(),
    }),
  },
  async ({ status }, ctx) => {
    const auth = getAuth(ctx);
    if (!auth) return error("Not authenticated");

    let url = `${SUPABASE_URL}/rest/v1/todos?select=*&order=created_at.desc`;
    if (status === "pending") url += "&completed=eq.false";
    else if (status === "completed") url += "&completed=eq.true";

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          apikey: SUPABASE_ANON_KEY,
        },
      });

      if (!res.ok) return error(`Supabase API error: ${res.status} ${res.statusText}`);

      const todos = await res.json();
      return object({ todos, count: todos.length });
    } catch (e) {
      return error(`Failed to fetch todos: ${e}`);
    }
  }
);

server.tool(
  {
    name: "create-todo",
    description: "Create a new todo for the authenticated user",
    schema: z.object({
      title: z.string().describe("Todo title"),
    }),
  },
  async ({ title }, ctx) => {
    const auth = getAuth(ctx);
    if (!auth) return error("Not authenticated");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/todos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ title, completed: false, user_id: auth.user.userId }),
      });

      if (!res.ok) return error(`Failed to create todo: ${res.status}`);

      const [todo] = await res.json();
      return text(`Created todo: "${todo.title}" (id: ${todo.id})`);
    } catch (e) {
      return error(`Failed to create todo: ${e}`);
    }
  }
);

server.tool(
  {
    name: "toggle-todo",
    description: "Toggle a todo's completed status",
    schema: z.object({
      id: z.number().describe("Todo ID to toggle"),
      completed: z.boolean().describe("New completed status"),
    }),
  },
  async ({ id, completed }, ctx) => {
    const auth = getAuth(ctx);
    if (!auth) return error("Not authenticated");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/todos?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) return error(`Failed to update todo: ${res.status}`);
      return text(`Todo ${id} marked as ${completed ? "completed" : "pending"}`);
    } catch (e) {
      return error(`Failed to toggle todo: ${e}`);
    }
  }
);

server.listen().then(() => console.log("Supabase OAuth server running"));

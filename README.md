# OAuth Supabase — Authentication with Supabase

<p>
  <a href="https://github.com/mcp-use/mcp-use">Built with <b>mcp-use</b></a>
  &nbsp;
  <a href="https://github.com/mcp-use/mcp-use">
    <img src="https://img.shields.io/github/stars/mcp-use/mcp-use?style=social" alt="mcp-use stars">
  </a>
</p>

OAuth-protected MCP App using [Supabase Auth](https://supabase.com/auth). Demonstrates the `oauthSupabaseProvider()` integration, `ctx.auth` for accessing authenticated user info, and a user dashboard widget showing profile data and todos.

> **Note:** This template requires a Supabase project. Set `MCP_USE_OAUTH_SUPABASE_PROJECT_ID` and related environment variables before starting.

## Features

- **Supabase OAuth** — `oauthSupabaseProvider()` handles the full OAuth flow
- **Authenticated context** — `ctx.auth` gives access to user tokens and identity
- **User dashboard widget** — profile info, session data, and todo management
- **CRUD operations** — create, list, and toggle todos for authenticated users

## Tools

| Tool | Description |
|------|-------------|
| `get-profile` | Show the authenticated user's profile in a dashboard widget |
| `list-todos` | List todos for the current user |
| `create-todo` | Create a new todo |
| `toggle-todo` | Toggle a todo's completion status |

## Available Widgets

| Widget | Preview |
|--------|---------|
| `user-dashboard` | *(requires Supabase auth to render)* |

## Local development

```bash
git clone https://github.com/mcp-use/mcp-oauth-supabase.git
cd mcp-oauth-supabase
npm install

# Set Supabase environment variables
export MCP_USE_OAUTH_SUPABASE_PROJECT_ID=your-project-id

npm run dev
```

## Deploy

```bash
npx mcp-use deploy
npx mcp-use deployments env set MCP_USE_OAUTH_SUPABASE_PROJECT_ID your-project-id
```

## Built with

- [mcp-use](https://github.com/mcp-use/mcp-use) — MCP server framework
- [Supabase](https://supabase.com/) — open-source Firebase alternative

## License

MIT

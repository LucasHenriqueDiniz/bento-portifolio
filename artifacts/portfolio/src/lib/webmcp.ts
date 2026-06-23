import { navigate } from "wouter/use-browser-location";

/**
 * WebMCP (https://github.com/webmachinelearning/webmcp) lets an in-page agent
 * discover and call tools the site exposes via `navigator.modelContext`.
 *
 * We expose a single, side-effect-free navigation tool so an agent can move
 * between the portfolio's routes. `navigate` from wouter drives
 * `history.pushState`, which wouter's location hooks observe, so the React
 * tree re-renders correctly without any extra wiring.
 *
 * The API is experimental and only present in supporting browsers, so the
 * whole thing is guarded — it's a no-op everywhere else.
 */

const ROUTES = [
  { path: "/", label: "Home / landing page" },
  { path: "/projects", label: "List of all projects" },
  { path: "/resume", label: "Resume: experience, education, skills" },
  { path: "/contact", label: "Contact information" },
  { path: "/gallery", label: "Image gallery" },
  { path: "/donate", label: "Donation / support page" },
] as const;

type NavigatorWithModelContext = Navigator & {
  modelContext?: {
    provideContext: (context: {
      tools: Array<{
        name: string;
        description: string;
        inputSchema: Record<string, unknown>;
        execute: (args: Record<string, unknown>) => Promise<{
          content: Array<{ type: "text"; text: string }>;
        }>;
      }>;
    }) => void;
  };
};

export function registerWebMcpTools(): void {
  if (typeof navigator === "undefined") return;

  const nav = navigator as NavigatorWithModelContext;
  if (!nav.modelContext || typeof nav.modelContext.provideContext !== "function") return;

  const routeList = ROUTES.map((r) => `${r.path} — ${r.label}`).join("; ");

  try {
    nav.modelContext.provideContext({
      tools: [
        {
          name: "navigate_to_page",
          description:
            `Navigate the portfolio single-page app to one of its routes. ` +
            `Available routes: ${routeList}. ` +
            `Project detail pages use the form /projects/{id} where {id} is a project id ` +
            `from the /projects list.`,
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  'Route path to navigate to, e.g. "/projects", "/resume", or "/projects/some-id".',
              },
            },
            required: ["path"],
          },
          async execute(args) {
            const rawPath = typeof args.path === "string" ? args.path : "/";
            const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
            navigate(path);
            return {
              content: [{ type: "text", text: `Navigated to ${path}` }],
            };
          },
        },
      ],
    });
  } catch {
    // The API surface is still evolving; never let registration break the app.
  }
}

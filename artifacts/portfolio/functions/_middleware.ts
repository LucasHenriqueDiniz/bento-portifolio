import { homeMarkdown, projectsListMarkdown, projectDetailMarkdown, resumeMarkdown, contactMarkdown } from "./lib/markdown";

const markdownResponse = (body: string) =>
  new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const accept = request.headers.get("accept") ?? "";
  const wantsMarkdown = accept.includes("text/markdown") && !accept.includes("text/html");

  if (!wantsMarkdown) return context.next();

  const { pathname } = new URL(request.url);

  if (pathname === "/") return markdownResponse(homeMarkdown());
  if (pathname === "/projects") return markdownResponse(projectsListMarkdown());
  if (pathname === "/resume") return markdownResponse(resumeMarkdown());
  if (pathname === "/contact") return markdownResponse(contactMarkdown());

  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const markdown = projectDetailMarkdown(projectMatch[1]);
    if (markdown) return markdownResponse(markdown);
  }

  return context.next();
};

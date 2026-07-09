import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Locale routing applies to gallery pages only. Demos (/view), the shadcn
  // registry (/r), media, and schema files are served as-is for every locale.
  matcher: [
    "/((?!api|view|r|media|schema|_next|_vercel|.*\\..*).*)",
  ],
};

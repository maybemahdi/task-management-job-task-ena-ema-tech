// middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to this path if not authenticated
  },
});

export const config = {
  // Apply the middleware to all routes except for login and register
  matcher: [
    "/((?!login|register).*)", // Protect all routes except `/login` and `/register`
  ],
};

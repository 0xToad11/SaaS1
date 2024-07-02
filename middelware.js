const { clerkMiddleware } = require("@clerk/nextjs/server");

module.exports = clerkMiddleware();

module.exports.config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

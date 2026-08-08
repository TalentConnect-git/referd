import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/blogs",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/blogs/")) {
    return NextResponse.next();
  }
  const accessToken =
    request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    const loginUrl = new URL(
      "/login",
      request.url
    );
    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};


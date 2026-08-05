import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/student/",
        "/fresher/",
        "/professional/",
        "/api/",
      ],
    },
    sitemap: "https://referd.in/sitemap.xml",
  };
}
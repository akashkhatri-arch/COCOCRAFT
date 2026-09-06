import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cococraft.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/cart", "/checkout", "/order-success"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

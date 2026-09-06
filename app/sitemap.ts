import { MetadataRoute } from "next";
import { devProducts } from "@/lib/data/dev-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cococraft.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/customize",
    "/about",
    "/faq",
    "/contact",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/customize" ? 0.9 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = devProducts.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}

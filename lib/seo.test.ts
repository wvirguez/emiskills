import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/seo";

describe("buildMetadata", () => {
  const base = { title: "Catálogo", description: "Desc", path: "/productos/" };

  it("incluye canonical, Open Graph y Twitter", () => {
    const m = buildMetadata(base);
    expect(m.alternates?.canonical).toBe("/productos/");
    expect(m.openGraph).toMatchObject({ title: "Catálogo", url: "/productos/", locale: "es_LA" });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", title: "Catálogo" });
    expect(m.robots).toBeUndefined();
  });

  it("usa la imagen indicada en OG y Twitter", () => {
    const m = buildMetadata({ ...base, image: "https://cdn.x/img.png" });
    expect(m.openGraph).toMatchObject({ images: [{ url: "https://cdn.x/img.png" }] });
    expect(m.twitter).toMatchObject({ images: ["https://cdn.x/img.png"] });
  });

  it("sin imagen no define images (hereda opengraph-image)", () => {
    const m = buildMetadata(base);
    expect(m.openGraph).not.toHaveProperty("images");
  });

  it("noindex marca robots", () => {
    expect(buildMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: false });
  });
});

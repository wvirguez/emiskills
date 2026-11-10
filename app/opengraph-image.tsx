import { ImageResponse } from "next/og";
import { SITE_DEFAULT_TITLE, SITE_NAME } from "@/lib/site";

export const alt = SITE_DEFAULT_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 44, marginTop: 24, opacity: 0.9 }}>
          Hub de productos digitales
        </div>
      </div>
    ),
    size,
  );
}

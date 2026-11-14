"use client";

import { useId, useState } from "react";

/** Párrafos a partir de los cuales (en total de caracteres) se ofrece "Ver más". */
export const EXPAND_THRESHOLD = 450;

/**
 * Texto largo colapsable. El contenido completo siempre está en el HTML (SEO y
 * lectores de pantalla); al colapsar solo se recorta visualmente.
 */
export default function ExpandableText({ paragraphs }: { paragraphs: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const isLong = paragraphs.join("").length > EXPAND_THRESHOLD;
  const collapsed = isLong && !expanded;

  return (
    <div className="mt-6">
      <div
        id={id}
        className={`relative space-y-4 text-base leading-relaxed text-gray-700 ${
          collapsed ? "max-h-52 overflow-hidden" : ""
        }`}
      >
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
        {collapsed && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
          />
        )}
      </div>
      {isLong && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 inline-flex min-h-[44px] items-center text-base font-semibold text-violet-700 underline hover:text-violet-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded"
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}

// src/components/HeroIllustration.tsx
// Ilustración SVG decorativa de tarjetas de productos digitales (curso, ebook, plantilla)
// Paleta violet/fuchsia — sin texto con cifras ni marcas

export default function HeroIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 320"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definiciones de gradientes */}
      <defs>
        <linearGradient id="cardGradient1" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D946EF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="cardGradient2" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="cardGradient3" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F472B6" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7C3AED" floodOpacity="0.25" />
        </filter>
        <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Tarjeta principal — Curso (centro, más grande) */}
      <g filter="url(#dropShadow)">
        <rect
          x="60"
          y="80"
          width="200"
          height="140"
          rx="16"
          fill="url(#cardGradient1)"
        />
        {/* Borde superior brillante */}
        <path
          d="M76 80 C160 80 160 80 244 80"
          stroke="url(#accentGradient)"
          strokeWidth="2"
          strokeOpacity="0.6"
          fill="none"
        />
        {/* Icono de "play" para curso */}
        <g transform="translate(160, 150)">
          <circle r="28" fill="rgba(255,255,255,0.2)" />
          <polygon
            points="-8,-14 18,0 -8,14"
            fill="white"
            fillOpacity="0.95"
          />
        </g>
        {/* Líneas decorativas de "contenido" */}
        <g fill="rgba(255,255,255,0.15)" transform="translate(80, 80)">
          <rect x="20" y="40" width="100" height="4" rx="2" />
          <rect x="20" y="50" width="80" height="4" rx="2" />
          <rect x="20" y="60" width="90" height="4" rx="2" />
        </g>
      </g>

      {/* Tarjeta secundaria — Ebook (arriba a la derecha) */}
      <g filter="url(#dropShadow)" opacity="0.95">
        <rect
          x="180"
          y="20"
          width="110"
          height="150"
          rx="12"
          fill="url(#cardGradient2)"
          transform="rotate(-8 235 95)"
        />
        {/* Icono de libro/ebook */}
        <g transform="translate(235, 95) rotate(-8)">
          <rect
            x="-20"
            y="-40"
            width="40"
            height="50"
            rx="3"
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
          />
          <path
            d="M-18 -35 L-2 -35"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <path
            d="M-18 -25 L-8 -25"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M-18 -15 L-12 -15"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Tarjeta terciaria — Plantilla (abajo a la izquierda) */}
      <g filter="url(#dropShadow)" opacity="0.95">
        <rect
          x="10"
          y="150"
          width="120"
          height="80"
          rx="12"
          fill="url(#cardGradient3)"
          transform="rotate(6 70 190)"
        />
        {/* Icono de plantilla/documento */}
        <g transform="translate(70, 190) rotate(6)">
          <rect
            x="-25"
            y="-30"
            width="50"
            height="60"
            rx="4"
            fill="rgba(255,255,255,0.18)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
          {/* Esquinas de selección — sugerencia de "plantilla editable" */}
          <g stroke="white" strokeWidth="1.5" strokeOpacity="0.7" fill="none">
            <path d="M-22 -25 L-12 -25 M-22 -25 L-22 -15" strokeLinecap="round" />
            <path d="M22 -25 L12 -25 M22 -25 L22 -15" strokeLinecap="round" />
            <path d="M-22 25 L-12 25 M-22 25 L-22 15" strokeLinecap="round" />
            <path d="M22 25 L12 25 M22 25 L22 15" strokeLinecap="round" />
          </g>
        </g>
      </g>

      {/* Elementos decorativos flotantes — partículas sutiles */}
      <g fill="url(#accentGradient)" opacity="0.4">
        <circle cx="30" cy="30" r="4" />
        <circle cx="290" cy="50" r="3" />
        <circle cx="40" cy="280" r="2.5" />
        <circle cx="280" cy="290" r="3.5" />
        <circle cx="160" cy="20" r="2" />
        <circle cx="160" cy="300" r="2" />
      </g>

      {/* Elementos decorativos de "código" — líneas geométricas */}
      <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none">
        <path d="M20 200 L80 200" strokeDasharray="8,4" />
        <path d="M240 120 L300 120" strokeDasharray="8,4" />
        <path d="M200 280 L260 280" strokeDasharray="8,4" />
      </g>
    </svg>
  )
}
import Link from "next/link";

export default function AffiliateNotice() {
  return (
    <p className="text-base text-gray-600 px-4 py-2">
      <strong>Aviso de afiliado:</strong> si compras en la plataforma del productor,
      podemos recibir una comisión, sin costo extra para ti.{" "}
      <Link
        href="/#aviso-afiliados"
        className="underline hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded min-h-[44px] inline-flex items-center"
      >
        Más información
      </Link>
    </p>
  );
}
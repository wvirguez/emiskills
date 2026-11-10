const OK_VALUES = ["creado", "editado", "activado", "desactivado", "eliminado"] as const;
type OkValue = (typeof OK_VALUES)[number];

function validateOkParam(value: string | null): OkValue | null {
  if (!value) return null;
  return OK_VALUES.includes(value as OkValue) ? (value as OkValue) : null;
}

export function getOkMessage(ok: string | null): string | null {
  const validated = validateOkParam(ok);
  if (!validated) return null;

  switch (validated) {
    case "creado":
      return "Producto creado correctamente.";
    case "editado":
      return "Producto actualizado correctamente.";
    case "activado":
      return "Producto activado correctamente.";
    case "desactivado":
      return "Producto desactivado correctamente.";
    case "eliminado":
      return "Producto eliminado correctamente.";
  }
}

export function getErrorMessage(error: string | null, count?: string | null): string | null {
  if (error === "needs-review") {
    return "No se puede activar: el producto viene de Hotmart y aún tiene el enlace de la oferta. Guarda tu enlace de afiliado primero.";
  }
  if (error === "has-clicks") {
    const clickCount = count ? parseInt(count, 10) : 0;
    if (clickCount === 1) {
      return "No se puede eliminar: el producto tiene 1 clic registrado.";
    }
    return `No se puede eliminar: el producto tiene ${clickCount} clics registrados.`;
  }
  return null;
}
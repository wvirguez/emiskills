const OK_VALUES = ["creada", "editada", "eliminada"] as const;
type OkValue = (typeof OK_VALUES)[number];

function validateOkParam(value: string | null): OkValue | null {
  if (!value) return null;
  return OK_VALUES.includes(value as OkValue) ? (value as OkValue) : null;
}

export function getOkMessage(ok: string | null): string | null {
  const validated = validateOkParam(ok);
  if (!validated) return null;

  switch (validated) {
    case "creada":
      return "Categoría creada correctamente.";
    case "editada":
      return "Categoría actualizada correctamente.";
    case "eliminada":
      return "Categoría eliminada correctamente.";
  }
}

export function getErrorMessage(error: string | null, count?: string | null): string | null {
  if (error === "has-products") {
    const productCount = count ? parseInt(count, 10) : 0;
    if (productCount === 1) {
      return "No se puede eliminar: la categoría tiene 1 producto asociado.";
    }
    return `No se puede eliminar: la categoría tiene ${productCount} productos asociados.`;
  }
  return null;
}
"use server";

import { toggleProductActiveAction, deleteProductAction } from "./actions";

export function createToggleProductActiveAction(id: number) {
  return async (isActive: boolean, formData: FormData) => {
    await toggleProductActiveAction(id, undefined, formData);
  };
}

export function createDeleteProductAction(id: number) {
  return async (formData: FormData) => {
    await deleteProductAction(id, undefined, formData);
  };
}
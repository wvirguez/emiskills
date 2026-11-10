import { z } from "zod";

const pageInfoSchema = z.object({
  next_page_token: z.string().nullish(),
  prev_page_token: z.string().nullish(),
  results_per_page: z.number().nullish(),
});

export const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().positive(),
});

const productSchema = z.object({
  id: z.number(),
  ucode: z.string(),
  name: z.string(),
  status: z.string(),
  format: z.string().nullish(),
  is_subscription: z.boolean().nullish(),
  warranty_period: z.number().nullish(),
  created_at: z.number().nullish(),
});

const offerSchema = z.object({
  code: z.string(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  is_main_offer: z.boolean().nullish(),
  price: z.object({ value: z.number(), currency_code: z.string() }),
  payment_mode: z.string().nullish(),
  direct_offer_link_for_creator: z.string().nullish(),
});

export const productsPageSchema = z.object({
  items: z.array(productSchema).default([]),
  page_info: pageInfoSchema.nullish(),
});

export const offersPageSchema = z.object({
  items: z.array(offerSchema).default([]),
  page_info: pageInfoSchema.nullish(),
});

/** `status` y `format` quedan como string: Hotmart puede añadir valores nuevos. */
export type HotmartProduct = {
  id: number;
  ucode: string;
  name: string;
  status: string;
  format: string | null;
  isSubscription: boolean;
  warrantyPeriod: number | null;
  createdAt: Date | null;
};

export type HotmartOffer = {
  code: string;
  name: string;
  description: string;
  isMain: boolean;
  price: { value: number; currency: string };
  paymentMode: string | null;
  /** Enlace del PRODUCTOR (no es un enlace de afiliado). */
  directOfferLink: string | null;
};

export function toProduct(raw: z.infer<typeof productSchema>): HotmartProduct {
  return {
    id: raw.id,
    ucode: raw.ucode,
    name: raw.name,
    status: raw.status,
    format: raw.format ?? null,
    isSubscription: raw.is_subscription ?? false,
    warrantyPeriod: raw.warranty_period ?? null,
    createdAt: raw.created_at != null ? new Date(raw.created_at) : null,
  };
}

export function toOffer(raw: z.infer<typeof offerSchema>): HotmartOffer {
  return {
    code: raw.code,
    name: raw.name ?? "",
    description: raw.description ?? "",
    isMain: raw.is_main_offer ?? false,
    price: { value: raw.price.value, currency: raw.price.currency_code },
    paymentMode: raw.payment_mode ?? null,
    directOfferLink: raw.direct_offer_link_for_creator ?? null,
  };
}

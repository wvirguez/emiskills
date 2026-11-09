export type ProductFormState = {
  error?: string;
  fieldErrors?: {
    title?: string[];
    shortDescription?: string[];
    description?: string[];
    price?: string[];
    currency?: string[];
    language?: string[];
    imageUrl?: string[];
    imageGradient?: string[];
    affiliateUrl?: string[];
    categoryId?: string[];
    platformId?: string[];
    isActive?: string[];
  };
  success?: boolean;
};

export type ProductFormData = {
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  currency: string;
  language: string;
  imageUrl: string;
  imageGradient: string;
  affiliateUrl: string;
  categoryId: string;
  platformId: string;
  isActive: boolean;
};
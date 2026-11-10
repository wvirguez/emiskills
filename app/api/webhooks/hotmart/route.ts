import { handleHotmartWebhook } from "@/lib/hotmart/webhook";

export async function POST(request: Request) {
  return handleHotmartWebhook(request);
}

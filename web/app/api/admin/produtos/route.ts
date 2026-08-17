import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-client";

// Proxy autenticado: lê o cookie httpOnly do admin (setado no login) e
// repassa a chamada para a API real, anexando o Authorization: Bearer.
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const product = await adminFetch("/admin/products", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar produto";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

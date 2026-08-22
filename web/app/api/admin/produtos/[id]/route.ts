import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-client";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  try {
    const product = await adminFetch(`/admin/products/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar produto";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

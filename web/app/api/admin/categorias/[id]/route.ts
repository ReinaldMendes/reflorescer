import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-client";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  try {
    const category = await adminFetch(`/admin/categories/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar categoria";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

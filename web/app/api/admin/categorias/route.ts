import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const category = await adminFetch("/admin/categories", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar categoria";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

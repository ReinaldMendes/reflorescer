import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-client";

// Proxy autenticado de upload de imagem: recebe o arquivo do navegador como
// multipart/form-data, converte para base64 no servidor (Vercel) e repassa
// pra API real (Railway), que sobe pro Cloudinary. O navegador nunca fala
// direto com a API nem com o Cloudinary — mesmo padrão BFF das outras
// rotas administrativas.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagem muito grande (máximo 8MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const result = await adminFetch<{ url: string; publicId: string }>("/admin/upload", {
      method: "POST",
      body: JSON.stringify({ file: dataUri, folder: typeof folder === "string" ? folder : undefined }),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao enviar imagem";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

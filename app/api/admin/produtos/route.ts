import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

// Toda escrita administrativa exige sessão válida — nunca confiar em dados
// vindos do cliente sem checagem de autenticação/autorização no servidor.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { images, ...productData } = body;

  const parsed = productSchema.safeParse(productData);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: {
        create: (images ?? []).map((img: { url: string; order: number }) => ({
          url: img.url,
          order: img.order,
        })),
      },
      inventory: { create: { quantity: 0, minQuantity: 3 } },
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
  });
  return NextResponse.json(products);
}

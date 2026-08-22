import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/require-admin";
import { asyncHandler } from "../middleware/error-handler";
import { productSchema } from "../validations/product";
import { categorySchema } from "../validations/category";
import { cloudinary } from "../lib/cloudinary";

export const adminRouter = Router();

// Todas as rotas abaixo exigem token JWT válido (Authorization: Bearer).
// Quem chama esta rota é sempre o servidor Next.js (web/), nunca o
// navegador diretamente — ver README da raiz para o fluxo de auth completo.
adminRouter.use(requireAdmin);

// --- Dashboard ---
adminRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [revenueAgg, orderCount, recentOrders, lowStock, bestSellers] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
      }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true } }),
      prisma.$queryRaw`
        SELECT i.id, i."quantity", i."minQuantity", p.name as "productName"
        FROM inventory i
        LEFT JOIN products p ON p.id = i."productId"
        WHERE i."quantity" <= i."minQuantity"
        LIMIT 5
      `.catch(() => []),
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    res.json({
      revenue: Number(revenueAgg._sum.total ?? 0),
      orderCount,
      recentOrders,
      lowStock,
      bestSellers,
    });
  })
);

// --- Produtos ---
adminRouter.get(
  "/products",
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true, inventory: true },
    });
    res.json(products);
  })
);

adminRouter.post(
  "/products",
  asyncHandler(async (req, res) => {
    const { images, ...productData } = req.body;
    const parsed = productSchema.safeParse(productData);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" });
    }

    const { attributes, ...rest } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...rest,
        // `attributes` chega do Zod como Record<string, unknown> — o Prisma
        // exige o tipo InputJsonValue para campos Json, então convertemos
        // explicitamente aqui (undefined vira "campo não enviado").
        attributes: attributes as Prisma.InputJsonValue | undefined,
        images: {
          create: (images ?? []).map((img: { url: string; order: number }) => ({ url: img.url, order: img.order })),
        },
        inventory: { create: { quantity: 0, minQuantity: 3 } },
      } satisfies Prisma.ProductUncheckedCreateInput,
      include: { images: true },
    });

    res.status(201).json(product);
  })
);

adminRouter.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: { orderBy: { order: "asc" } }, variants: true, inventory: true },
    });
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  })
);

adminRouter.put(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { images, ...productData } = req.body;
    const parsed = productSchema.partial().safeParse(productData);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" });
    }
    const { attributes, ...rest } = parsed.data;

    // Sincroniza as imagens: a forma mais simples e segura de refletir
    // reordenação/remoção/adição vindas do painel é substituir todo o
    // conjunto (apaga as antigas e recria na nova ordem), em vez de tentar
    // um diff campo a campo.
    const product = await prisma.$transaction(async (tx) => {
      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: req.params.id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: { url: string; order: number }) => ({
              productId: req.params.id,
              url: img.url,
              order: img.order,
            })),
          });
        }
      }

      return tx.product.update({
        where: { id: req.params.id },
        data: {
          ...rest,
          attributes: attributes as Prisma.InputJsonValue | undefined,
        } satisfies Prisma.ProductUncheckedUpdateInput,
        include: { images: { orderBy: { order: "asc" } } },
      });
    });
    res.json(product);
  })
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    await prisma.product.update({ where: { id: req.params.id }, data: { active: false } });
    res.json({ ok: true });
  })
);

// --- Categorias ---
adminRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    res.json(categories);
  })
);

adminRouter.get(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(category);
  })
);

adminRouter.post(
  "/categories",
  asyncHandler(async (req, res) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" });
    }
    const category = await prisma.category.create({
      data: parsed.data satisfies Prisma.CategoryUncheckedCreateInput,
    });
    res.status(201).json(category);
  })
);

adminRouter.put(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Dados inválidos" });
    }
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: parsed.data satisfies Prisma.CategoryUncheckedUpdateInput,
    });
    res.json(category);
  })
);

// --- Pedidos ---
adminRouter.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const take = req.query.take ? Number(req.query.take) : 50;
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { customer: true }, take });
    res.json(orders);
  })
);

adminRouter.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    await prisma.$transaction([
      prisma.order.update({ where: { id: req.params.id }, data: { status } }),
      prisma.orderStatusHistory.create({ data: { orderId: req.params.id, status, note } }),
    ]);
    res.json({ ok: true });
  })
);

// --- Upload de imagens (Cloudinary) ---
// Recebe a imagem como data URI base64 (`data:image/...;base64,...`) em vez
// de multipart/form-data — evita depender de multer e casa com o BFF do
// web/, que já converte o arquivo enviado pelo navegador para base64 antes
// de repassar pra cá. `folder` separa produtos/categorias no Cloudinary.
adminRouter.post(
  "/upload",
  asyncHandler(async (req, res) => {
    const { file, folder } = req.body as { file?: string; folder?: string };
    if (!file || !file.startsWith("data:")) {
      return res.status(400).json({ error: "Nenhum arquivo de imagem válido enviado." });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: `reflorescer/${folder ?? "geral"}`,
      resource_type: "image",
    });

    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  })
);

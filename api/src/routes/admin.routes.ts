import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/require-admin";
import { asyncHandler } from "../middleware/error-handler";
import { productSchema } from "../validations/product";

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

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        images: {
          create: (images ?? []).map((img: { url: string; order: number }) => ({ url: img.url, order: img.order })),
        },
        inventory: { create: { quantity: 0, minQuantity: 3 } },
      },
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
    const product = await prisma.product.update({ where: { id: req.params.id }, data: parsed.data });
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

adminRouter.post(
  "/categories",
  asyncHandler(async (req, res) => {
    const category = await prisma.category.create({ data: req.body });
    res.status(201).json(category);
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

import { Router } from "express";
import { prisma } from "../lib/prisma";
import { listProducts, getProductBySlug, getRelatedProducts, getFeaturedProducts } from "../services/product-service";
import { listCategories, getCategoryBySlug } from "../services/category-service";
import { getSiteSettings } from "../services/settings-service";
import { asyncHandler } from "../middleware/error-handler";

export const publicRouter = Router();

// --- Produtos ---
publicRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const { categoria, ordenar, busca, pagina, destaque } = req.query;
    const result = await listProducts({
      categorySlug: categoria as string | undefined,
      sort: (ordenar as "price-asc" | "price-desc" | "newest") ?? "relevance",
      search: busca as string | undefined,
      featuredOnly: destaque === "1",
      page: pagina ? Number(pagina) : 1,
    });
    res.json(result);
  })
);

publicRouter.get(
  "/products/featured",
  asyncHandler(async (req, res) => {
    const take = req.query.take ? Number(req.query.take) : 8;
    const products = await getFeaturedProducts(take);
    res.json(products);
  })
);

publicRouter.get(
  "/products/:slug",
  asyncHandler(async (req, res) => {
    const product = await getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  })
);

publicRouter.get(
  "/products/:id/related",
  asyncHandler(async (req, res) => {
    const { categoryId } = req.query;
    if (!categoryId) return res.status(400).json({ error: "categoryId é obrigatório" });
    const related = await getRelatedProducts(req.params.id, categoryId as string);
    res.json(related);
  })
);

// --- Categorias ---
publicRouter.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const featuredOnly = req.query.destaque === "1";
    const categories = await listCategories({ featuredOnly });
    res.json(categories);
  })
);

publicRouter.get(
  "/categories/:slug",
  asyncHandler(async (req, res) => {
    const category = await getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(category);
  })
);

// --- Experiências ---
publicRouter.get(
  "/experiences",
  asyncHandler(async (_req, res) => {
    const experiences = await prisma.experience.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    res.json(experiences);
  })
);

publicRouter.get(
  "/experiences/:slug",
  asyncHandler(async (req, res) => {
    const experience = await prisma.experience.findUnique({
      where: { slug: req.params.slug, active: true },
      include: { products: { include: { product: { include: { images: { orderBy: { order: "asc" }, take: 1 } } } } } },
    });
    if (!experience) return res.status(404).json({ error: "Experiência não encontrada" });
    res.json(experience);
  })
);

// --- Journal / Blog ---
publicRouter.get(
  "/blog-posts",
  asyncHandler(async (req, res) => {
    const take = req.query.take ? Number(req.query.take) : undefined;
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take,
    });
    res.json(posts);
  })
);

publicRouter.get(
  "/blog-posts/:slug",
  asyncHandler(async (req, res) => {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug, published: true } });
    if (!post) return res.status(404).json({ error: "Post não encontrado" });
    res.json(post);
  })
);

// --- Kits ---
publicRouter.get(
  "/kits",
  asyncHandler(async (_req, res) => {
    const kits = await prisma.kit.findMany({ where: { active: true }, include: { items: { include: { product: true } } } });
    res.json(kits);
  })
);

// --- Frete e configurações ---
publicRouter.get(
  "/shipping-methods",
  asyncHandler(async (_req, res) => {
    const methods = await prisma.shippingMethod.findMany({ where: { active: true } });
    res.json(methods);
  })
);

publicRouter.get(
  "/site-settings",
  asyncHandler(async (_req, res) => {
    const settings = await getSiteSettings();
    res.json(settings);
  })
);

// --- Sitemap (dados brutos para o web montar o sitemap.xml) ---
publicRouter.get(
  "/sitemap-data",
  asyncHandler(async (_req, res) => {
    const [products, categories, posts] = await Promise.all([
      prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
    res.json({ products, categories, posts });
  })
);

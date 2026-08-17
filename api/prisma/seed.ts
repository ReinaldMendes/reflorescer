import { PrismaClient, ProductKind } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Gera slug simples (sem depender de lib/utils, pra manter o seed autocontido)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================================================
// CATÁLOGO REAL — enviado pela proprietária em 14/08/2026.
//
// IMPORTANTE: os preços abaixo são PLACEHOLDERS por família de produto,
// para o site não subir com R$ 0,00. A proprietária deve ajustar o preço
// real de cada item no painel administrativo (/admin/produtos) antes do
// lançamento. Nenhuma alegação terapêutica foi adicionada (item 13 do
// briefing) — as descrições citam apenas a linha e o aroma/ingrediente
// informado por ela, sem inventar propriedades.
// ============================================================================

interface SubcategoryDef {
  name: string;
  slug: string;
  kind: ProductKind;
  placeholderPrice: number;
  products: string[];
}

interface TopCategoryDef {
  name: string;
  slug: string;
  imageUrl: string;
  order: number;
  subcategories: SubcategoryDef[];
}

const CATALOG: TopCategoryDef[] = [
  {
    name: "Corpo & Cuidado",
    slug: "corpo-e-cuidado",
    imageUrl: "/images/categoria-corpo-e-cuidado.jpg",
    order: 1,
    subcategories: [
      {
        name: "Sabonete Líquido",
        slug: "sabonete-liquido",
        kind: "COSMETIC",
        placeholderPrice: 34.9,
        products: ["Rosa Mosqueta", "Mulateiro", "Romã e Cúrcuma", "Mel e Aveia", "Enxofre", "Manjericão"],
      },
      {
        name: "Sabonete em Barra",
        slug: "sabonete-em-barra",
        kind: "COSMETIC",
        placeholderPrice: 22.9,
        products: [
          "Anil e Sal Grosso",
          "Mel e Aveia",
          "Flor e Brisa",
          "Aura Rosé",
          "Enxofre",
          "Mulateiro",
          "Romã e Cúrcuma",
          "Manjericão",
        ],
      },
      {
        name: "Tônico",
        slug: "tonico",
        kind: "COSMETIC",
        placeholderPrice: 39.9,
        products: ["Flor Encantada", "Harmonia", "Romã e Cúrcuma", "Mulateiro", "Mel e Aveia"],
      },
      {
        name: "Esfoliante",
        slug: "esfoliante",
        kind: "COSMETIC",
        placeholderPrice: 42.9,
        products: ["Mulateiro", "Romã e Cúrcuma", "Harmonia"],
      },
      {
        name: "Hidratante",
        slug: "hidratante",
        kind: "COSMETIC",
        placeholderPrice: 48.9,
        products: ["Rosa Mosqueta", "Mulateiro", "Manjericão", "Enxofre", "Axilas e Pés"],
      },
      {
        name: "Sérum",
        slug: "serum",
        kind: "COSMETIC",
        placeholderPrice: 69.9,
        products: [
          "Top Clareador",
          "Anti-idade",
          "Sempre Bela",
          "Hidratante",
          "Romã e Cúrcuma Dia",
          "Romã e Cúrcuma Noite",
          "Mulateiro",
        ],
      },
      {
        name: "Blend Roll-on",
        slug: "blend-rollon",
        kind: "AROMATIC",
        placeholderPrice: 32.9,
        products: ["Relaxamento", "Respire Bem", "Abraço da Terra", "Noite Serena", "Abraço da Lua"],
      },
      {
        name: "Blend Conta-gotas",
        slug: "blend-conta-gotas",
        kind: "AROMATIC",
        placeholderPrice: 38.9,
        products: ["Cuidado da Mulher", "Rosa Mosqueta", "Aliviar Já", "Cravo e Canela", "Aura Dourada"],
      },
      {
        name: "Mix de Óleos Essenciais",
        slug: "mix-oleos-essenciais",
        kind: "AROMATIC",
        placeholderPrice: 44.9,
        products: [
          "Mix Aura Serena",
          "Mix Respire Bem",
          "Mix Brisa do Campo",
          "Mix Jardim da Alma",
          "Mix Norte Interior",
          "Mix Sopro da Calma",
        ],
      },
      {
        name: "Extrato Vegetal",
        slug: "extrato-vegetal",
        kind: "COSMETIC",
        placeholderPrice: 45.9,
        products: [
          "Breu Branco",
          "Mulungu",
          "Castanheira",
          "Muraré",
          "Cúrcuma Longa",
          "Seiva de Jatobá",
          "Imburana de Cheiro",
          "Pau D'Arco",
          "Os Nove Vegetal",
          "Ypê Amarelo",
          "João Brandim",
          "Apuí",
        ],
      },
      {
        name: "Linha Imunidade",
        slug: "linha-imunidade",
        kind: "COSMETIC",
        placeholderPrice: 59.9,
        products: ["Meu Guardião da Imunidade"], // produto com variantes 250ml / 30ml — tratado à parte abaixo
      },
    ],
  },
  {
    name: "Aromas",
    slug: "aromas",
    imageUrl: "/images/categoria-aromas.jpg",
    order: 2,
    subcategories: [
      {
        name: "Incenso",
        slug: "incenso",
        kind: "INCENSE",
        placeholderPrice: 18.9,
        products: ["Breu Branco", "Olíbano", "Imburana de Cheiro"],
      },
      {
        name: "Aromatizador de Ambiente",
        slug: "aromatizador-de-ambiente",
        kind: "AROMATIC",
        placeholderPrice: 36.9,
        products: [
          "Alecrim e Gardênia",
          "Flor e Brisa",
          "Alecrim e Coco",
          "Aura Rosé",
          "Serenity Glow",
          "Baunilha Premium",
        ],
      },
    ],
  },
  {
    name: "Luz & Acolhimento",
    slug: "luz-e-acolhimento",
    imageUrl: "/images/categoria-luz-e-acolhimento.jpg",
    order: 3,
    subcategories: [
      {
        name: "Vela",
        slug: "vela",
        kind: "CANDLE",
        placeholderPrice: 39.9,
        products: ["Flor e Brisa", "Aura Rosé", "Serenity Glow", "Baunilha Premium"],
      },
    ],
  },
  {
    name: "Arte & Energia",
    slug: "arte-e-energia",
    imageUrl: "/images/categoria-arte-e-energia.jpg",
    order: 4,
    subcategories: [
      {
        name: "Mandala",
        slug: "mandala",
        kind: "ART_PIECE",
        placeholderPrice: 28.9,
        products: ["Marca-página"],
      },
    ],
  },
  {
    name: "Presentes",
    slug: "presentes",
    imageUrl: "/images/categoria-presentes.jpg",
    order: 5,
    subcategories: [], // kits serão cadastrados via model Kit, não como produtos avulsos
  },
];

async function main() {
  console.log("Semeando banco de dados da Reflorescer com o catálogo real...");

  // --- Usuário admin ---
  const passwordHash = await bcrypt.hash("reflorescer2026", 10);
  await prisma.user.upsert({
    where: { email: "admin@reflorescerartesanal.com.br" },
    update: {},
    create: {
      name: "Administradora Reflorescer",
      email: "admin@reflorescerartesanal.com.br",
      passwordHash,
      role: "ADMIN",
    },
  });

  let productCount = 0;

  for (const topCategory of CATALOG) {
    const parent = await prisma.category.upsert({
      where: { slug: topCategory.slug },
      update: { imageUrl: topCategory.imageUrl, order: topCategory.order, featured: true },
      create: {
        name: topCategory.name,
        slug: topCategory.slug,
        imageUrl: topCategory.imageUrl,
        order: topCategory.order,
        featured: true,
      },
    });

    for (const sub of topCategory.subcategories) {
      const subcategory = await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { parentId: parent.id, name: sub.name },
        create: { name: sub.name, slug: sub.slug, parentId: parent.id, order: 0 },
      });

      for (const productName of sub.products) {
        const productSlug = slugify(`${sub.slug}-${productName}`);

        // "Meu Guardião da Imunidade" tem duas apresentações (250ml e 30ml
        // spray) — modelado como variantes do mesmo produto, não como dois
        // produtos separados.
        if (productName === "Meu Guardião da Imunidade") {
          await prisma.product.upsert({
            where: { slug: productSlug },
            update: {},
            create: {
              name: productName,
              slug: productSlug,
              shortDescription: `${sub.name} Reflorescer — ${productName}.`,
              categoryId: subcategory.id,
              kind: sub.kind,
              price: sub.placeholderPrice,
              active: true,
              featured: true,
              variants: {
                create: [
                  { name: "250 ml", priceDelta: 0 },
                  { name: "30 ml (spray)", priceDelta: -30 },
                ],
              },
              inventory: { create: { quantity: 10, minQuantity: 3 } },
            },
          });
          productCount++;
          continue;
        }

        // Marca o primeiro produto de cada subcategoria como destaque, para
        // a Home nascer com uma seleção representativa de toda a linha —
        // a proprietária pode reorganizar os destaques livremente no admin.
        const isFirstOfSubcategory = sub.products.indexOf(productName) === 0;

        await prisma.product.upsert({
          where: { slug: productSlug },
          update: {},
          create: {
            name: productName,
            slug: productSlug,
            shortDescription: `${sub.name} artesanal Reflorescer — ${productName}.`,
            categoryId: subcategory.id,
            kind: sub.kind,
            price: sub.placeholderPrice,
            active: true,
            featured: isFirstOfSubcategory,
            inventory: { create: { quantity: 15, minQuantity: 3 } },
          },
        });
        productCount++;
      }
    }
  }

  // --- Experiências (mantidas do planejamento original), agora conectadas
  // a produtos reais do catálogo por trecho do nome (case-insensitive) ---
  const experiencesData: { title: string; slug: string; order: number; matchTerms: string[] }[] = [
    { title: "Quero desacelerar", slug: "quero-desacelerar", order: 1, matchTerms: ["relaxamento", "noite serena", "abraço da lua", "sopro da calma"] },
    { title: "Quero cuidar do corpo", slug: "quero-cuidar-do-corpo", order: 2, matchTerms: ["hidratante", "sérum", "esfoliante", "sabonete"] },
    { title: "Quero perfumar minha casa", slug: "quero-perfumar-minha-casa", order: 3, matchTerms: ["aromatizador", "incenso", "vela"] },
    { title: "Quero presentear alguém", slug: "quero-presentear-alguem", order: 4, matchTerms: ["vela", "mandala", "aura rosé", "baunilha premium"] },
  ];

  for (const e of experiencesData) {
    const experience = await prisma.experience.upsert({
      where: { slug: e.slug },
      update: {},
      create: { title: e.title, slug: e.slug, order: e.order },
    });

    const matchingProducts = await prisma.product.findMany({
      where: { OR: e.matchTerms.map((term) => ({ name: { contains: term, mode: "insensitive" } })) },
      take: 8,
    });

    for (const product of matchingProducts) {
      await prisma.experienceProduct.upsert({
        where: { id: `${experience.id}-${product.id}` },
        update: {},
        create: { id: `${experience.id}-${product.id}`, experienceId: experience.id, productId: product.id },
      }).catch(() => null); // ignora se o vínculo já existir (upsert por id sintético)
    }
  }

  // --- Métodos de envio padrão ---
  await prisma.shippingMethod.upsert({
    where: { id: "default-pac" },
    update: {},
    create: { id: "default-pac", name: "PAC", price: 19.9, estimatedDaysMin: 5, estimatedDaysMax: 10 },
  });
  await prisma.shippingMethod.upsert({
    where: { id: "default-sedex" },
    update: {},
    create: { id: "default-sedex", name: "Sedex", price: 34.9, estimatedDaysMin: 2, estimatedDaysMax: 4 },
  });

  // --- Configurações do site ---
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      storeName: "Reflorescer Artesanal Natural",
      contactEmail: "contato@reflorescerartesanal.com.br",
      whatsappNumber: "5542999210868",
      defaultSeoTitle: "Reflorescer Artesanal Natural",
      defaultSeoDescription: "Natureza, arte e cuidado transformados em experiências para o seu cotidiano.",
    },
  });

  console.log(`Seed concluído: ${productCount} produtos cadastrados em ${CATALOG.length} categorias.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

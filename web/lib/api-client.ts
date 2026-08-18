// Cliente HTTP central para a API pública (leitura). Toda página do site
// (Server Component) busca dados daqui — nunca importa Prisma diretamente.
// Em build/produção aponta para a API no Railway; em dev, para localhost.

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// `fallback` é o valor retornado se a API estiver fora do ar ou responder
// erro — usado nas chamadas de LISTAGEM (Home, Kits, Journal), que não
// devem derrubar o build/página inteira por uma falha pontual da API.
// Chamadas de DETALHE (produto/categoria por slug) não recebem fallback:
// elas devem continuar lançando erro para que a página dispare notFound()
// corretamente em vez de renderizar uma página vazia como se existisse.
async function apiFetch<T>(path: string, revalidate = 3600, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) {
      if (fallback !== undefined) {
        console.warn(`[api-client] ${path} respondeu ${res.status} — usando fallback.`);
        return fallback;
      }
      throw new Error(`Falha ao buscar ${path}: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (fallback !== undefined) {
      console.warn(`[api-client] erro ao buscar ${path} — usando fallback.`, err);
      return fallback;
    }
    throw err;
  }
}

// Variante que não deve ser cacheada (dados de carrinho/checkout, por ex.)
async function apiFetchDynamic<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Falha ao buscar ${path}: ${res.status}`);
  }
  return res.json();
}

// --- Produtos ---
export interface ProductListParams {
  categoria?: string;
  ordenar?: "price-asc" | "price-desc" | "newest";
  busca?: string;
  pagina?: number;
  destaque?: boolean;
}

export function listProducts(params: ProductListParams = {}) {
  const query = new URLSearchParams();
  if (params.categoria) query.set("categoria", params.categoria);
  if (params.ordenar) query.set("ordenar", params.ordenar);
  if (params.busca) query.set("busca", params.busca);
  if (params.pagina) query.set("pagina", String(params.pagina));
  if (params.destaque) query.set("destaque", "1");
  return apiFetch<{ items: any[]; total: number; page: number; perPage: number; totalPages: number }>(
    `/products?${query.toString()}`,
    1800,
    { items: [], total: 0, page: 1, perPage: 12, totalPages: 0 }
  );
}

export function getFeaturedProducts(take = 8) {
  return apiFetch<any[]>(`/products/featured?take=${take}`, 3600, []);
}

export function getProductBySlug(slug: string) {
  return apiFetch<any>(`/products/${slug}`, 1800);
}

export function getRelatedProducts(productId: string, categoryId: string) {
  return apiFetch<any[]>(`/products/${productId}/related?categoryId=${categoryId}`, 1800, []);
}

// --- Categorias ---
export function listCategories(params: { destaque?: boolean } = {}) {
  const query = params.destaque ? "?destaque=1" : "";
  return apiFetch<any[]>(`/categories${query}`, 3600, []);
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<any>(`/categories/${slug}`, 3600);
}

// --- Experiências ---
export function listExperiences() {
  return apiFetch<any[]>(`/experiences`, 3600, []);
}

export function getExperienceBySlug(slug: string) {
  return apiFetch<any>(`/experiences/${slug}`, 3600);
}

// --- Journal / Blog ---
export function listBlogPosts(take?: number) {
  return apiFetch<any[]>(`/blog-posts${take ? `?take=${take}` : ""}`, 3600, []);
}

export function getBlogPostBySlug(slug: string) {
  return apiFetch<any>(`/blog-posts/${slug}`, 3600);
}

// --- Kits ---
export function listKits() {
  return apiFetch<any[]>(`/kits`, 3600, []);
}

// --- Frete e configurações ---
export function listShippingMethods() {
  return apiFetchDynamic<any[]>(`/shipping-methods`);
}

export function getSiteSettings() {
  return apiFetch<any>(`/site-settings`, 3600);
}

export function getSitemapData() {
  return apiFetch<{ products: any[]; categories: any[]; posts: any[] }>(`/sitemap-data`, 3600, {
    products: [],
    categories: [],
    posts: [],
  });
}

// --- Pedido (confirmação) ---
export function getOrderById(id: string) {
  return apiFetchDynamic<any>(`/checkout/orders/${id}`);
}

export { API_URL };

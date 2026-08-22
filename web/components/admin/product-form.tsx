"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SortableImageUploader, type UploadedImage } from "@/components/admin/sortable-image-uploader";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

const PRODUCT_KINDS = [
  { value: "COSMETIC", label: "Cosmético" },
  { value: "INCENSE", label: "Incenso" },
  { value: "CANDLE", label: "Vela" },
  { value: "ART_PIECE", label: "Peça artesanal" },
  { value: "AROMATIC", label: "Aromático" },
  { value: "OTHER", label: "Outro" },
];

export interface ProductFormData {
  id?: string;
  name: string;
  categoryId: string;
  kind: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  shortDescription?: string | null;
  description?: string | null;
  featured: boolean;
  attributes?: { ingredients?: string[]; howToUse?: string } | null;
  images: UploadedImage[];
}

export function ProductForm({ categories, product }: { categories: Category[]; product?: ProductFormData }) {
  const router = useRouter();
  const isEditing = !!product?.id;

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [kind, setKind] = useState(product?.kind ?? "COSMETIC");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice != null ? String(product.compareAtPrice) : ""
  );
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [ingredients, setIngredients] = useState(product?.attributes?.ingredients?.join(", ") ?? "");
  const [howToUse, setHowToUse] = useState(product?.attributes?.howToUse ?? "");
  const [images, setImages] = useState<UploadedImage[]>(product?.images ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEditing ? `/api/admin/produtos/${product!.id}` : "/api/admin/produtos";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          categoryId,
          kind,
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          shortDescription,
          description,
          featured,
          attributes: kind === "COSMETIC" ? { ingredients: ingredients.split(",").map((i) => i.trim()).filter(Boolean), howToUse } : {},
          images: images.map((img, i) => ({ url: img.url, order: i })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Não foi possível salvar o produto.");
      }
      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} required />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-800">Categoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-organic border border-brand-200 bg-white px-4 py-3"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-800">Tipo</label>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-organic border border-brand-200 bg-white px-4 py-3">
            {PRODUCT_KINDS.map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Preço (R$)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <Input label="Preço 'de' (opcional)" type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-800">Descrição curta</label>
        <textarea
          value={shortDescription ?? ""}
          onChange={(e) => setShortDescription(e.target.value)}
          maxLength={280}
          rows={2}
          className="rounded-organic border border-brand-200 bg-white px-4 py-3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-800">Descrição completa</label>
        <textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded-organic border border-brand-200 bg-white px-4 py-3"
        />
      </div>

      {kind === "COSMETIC" && (
        <div className="space-y-4 rounded-organic border border-brand-100 p-4">
          <p className="text-sm font-medium text-brand-800">Informações de cosmético</p>
          <Input label="Ingredientes (separados por vírgula)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-800">Modo de uso</label>
            <textarea value={howToUse} onChange={(e) => setHowToUse(e.target.value)} rows={2} className="rounded-organic border border-brand-200 bg-white px-4 py-3" />
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-brand-800">Imagens do produto</p>
        <SortableImageUploader images={images} onChange={setImages} />
      </div>

      <label className="flex items-center gap-2 text-sm text-brand-700">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Exibir em destaque na Home
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar produto"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
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

export function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [kind, setKind] = useState("COSMETIC");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/produtos", {
        method: "POST",
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
          attributes: kind === "COSMETIC" ? { ingredients: ingredients.split(",").map((i) => i.trim()), howToUse } : {},
          images: images.map((img, i) => ({ url: img.url, order: i })),
        }),
      });

      if (!res.ok) throw new Error("Não foi possível salvar o produto.");
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
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          maxLength={280}
          rows={2}
          className="rounded-organic border border-brand-200 bg-white px-4 py-3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-800">Descrição completa</label>
        <textarea
          value={description}
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

      <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar produto"}</Button>
    </form>
  );
}

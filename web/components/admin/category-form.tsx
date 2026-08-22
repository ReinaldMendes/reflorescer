"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";
import { slugify } from "@/lib/utils";

export interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order: number;
  featured: boolean;
  active: boolean;
}

export function CategoryForm({ category }: { category?: CategoryFormData }) {
  const router = useRouter();
  const isEditing = !!category?.id;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [description, setDescription] = useState(category?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(category?.imageUrl ?? null);
  const [order, setOrder] = useState(String(category?.order ?? 0));
  const [featured, setFeatured] = useState(category?.featured ?? false);
  const [active, setActive] = useState(category?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      slug,
      description: description || undefined,
      imageUrl,
      order: parseInt(order, 10) || 0,
      featured,
      active,
    };

    try {
      const url = isEditing ? `/api/admin/categorias/${category!.id}` : "/api/admin/categorias";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Não foi possível salvar a categoria.");
      }

      router.push("/admin/categorias");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Nome da categoria" value={name} onChange={(e) => handleNameChange(e.target.value)} required />

      <Input
        label="Slug (URL)"
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-800">Descrição (opcional)</label>
        <textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-organic border border-brand-200 bg-white px-4 py-3"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-brand-800">Imagem da categoria</p>
        <SingleImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Ordem de exibição" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-brand-700">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Exibir na seção &ldquo;Explore&rdquo; da Home
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-700">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Categoria ativa (visível no site)
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar categoria"}
      </Button>
    </form>
  );
}

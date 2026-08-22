"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X, AlertCircle } from "lucide-react";

// Versão simplificada do uploader para casos de imagem única (categorias),
// onde não faz sentido reordenar nem ter múltiplos arquivos. Usa o mesmo
// endpoint /api/admin/upload do uploader de produtos.
export function SingleImageUploader({
  value,
  onChange,
  folder = "categorias",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Falha ao enviar imagem");

      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar imagem");
      setPreview(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const displayUrl = preview ?? value;

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-organic bg-brand-100">
        {displayUrl && <Image src={displayUrl} alt="" fill className="object-cover" />}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-800/40">
            <Loader2 size={20} className="animate-spin text-bg" />
          </div>
        )}
        {displayUrl && !uploading && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange(null);
            }}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-bg/90 text-red-500"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex-1">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-organic border border-dashed border-brand-300 p-4 text-sm text-brand-500 hover:border-brand-600">
          <Upload size={16} />
          {displayUrl ? "Trocar imagem" : "Enviar imagem"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </label>
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle size={13} /> {error}
          </p>
        )}
      </div>
    </div>
  );
}

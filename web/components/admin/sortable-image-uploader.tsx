"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical, X, Upload } from "lucide-react";

export interface UploadedImage {
  id: string;
  url: string;
}

// Upload múltiplo com reordenação via drag-and-drop — a primeira imagem
// da lista é sempre a imagem principal do produto (item 23 do briefing).
export function SortableImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    onChange(arrayMove(images, oldIndex, newIndex));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    // Em produção, cada arquivo é enviado para /api/admin/upload (Cloudinary)
    // e a URL retornada é adicionada à lista. Aqui, geramos preview local
    // como placeholder de UX enquanto a integração de upload é conectada.
    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));
    onChange([...images, ...newImages]);
  }

  return (
    <div>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-organic border border-dashed border-brand-300 p-6 text-sm text-brand-500 hover:border-brand-600">
        <Upload size={18} />
        Enviar imagens (a primeira será a imagem principal)
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
      </label>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <SortableImage key={img.id} image={img} isPrimary={index === 0} onRemove={() => onChange(images.filter((i) => i.id !== img.id))} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableImage({
  image,
  isPrimary,
  onRemove,
}: {
  image: UploadedImage;
  isPrimary: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="group relative aspect-square overflow-hidden rounded-organic bg-brand-100">
      <Image src={image.url} alt="" fill className="object-cover" />
      {isPrimary && (
        <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] text-bg">Principal</span>
      )}
      <button
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-2 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-bg/90 text-brand-600 opacity-0 group-hover:opacity-100"
      >
        <GripVertical size={14} />
      </button>
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bg/90 text-red-500 opacity-0 group-hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

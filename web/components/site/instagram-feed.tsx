import Image from "next/image";
import { Instagram } from "lucide-react";

export function InstagramFeed({ images }: { images: { url: string; permalink: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-10 flex items-center justify-center gap-2 text-center">
        <Instagram size={16} className="text-gold-deep" />
        <p className="font-display text-2xl font-light text-brand-800">Siga o nosso florescer</p>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:grid-cols-6 lg:gap-4">
        {images.map((img) => (
          <a
            key={img.url}
            href={img.permalink}
            target="_blank"
            rel="noreferrer"
            className="glass glass-hover relative aspect-square overflow-hidden rounded-organic p-1"
          >
            <div className="relative h-full w-full overflow-hidden rounded-md">
              <Image src={img.url} alt="Post do Instagram Reflorescer" fill className="object-cover" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

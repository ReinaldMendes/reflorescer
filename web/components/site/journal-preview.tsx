import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface PostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string | null;
}

export function JournalPreview({ posts }: { posts: PostPreview[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-section-y lg:px-12 lg:py-section-y-lg">
      <div className="mb-12 flex items-end justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">Diário Reflorescer</p>
          <h2 className="mt-4 font-display text-display-md text-brand-800">
            Reflexões, natureza e <em className="italic text-gold-deep">bastidores</em>
          </h2>
        </div>
        <Link href="/journal" className="hidden text-sm text-gold-deep underline-offset-4 hover:underline lg:block">
          Ver todos os textos
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="glass glass-hover group block overflow-hidden rounded-glass p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-organic bg-brand-100">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-organic ease-organic group-hover:scale-105"
                />
              )}
            </div>
            <div className="px-2 pb-1 pt-4">
              {post.publishedAt && (
                <p className="text-[11px] uppercase tracking-wide text-brand-400">{formatDate(post.publishedAt)}</p>
              )}
              <p className="mt-1 font-display text-lg font-light text-brand-800">{post.title}</p>
              {post.excerpt && <p className="mt-2 text-sm text-brand-500">{post.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

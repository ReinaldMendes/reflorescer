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
          <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Diário Reflorescer</p>
          <h2 className="mt-4 font-display text-display-md text-brand-800">Reflexões, natureza e bastidores</h2>
        </div>
        <Link href="/journal" className="hidden text-sm text-brand-600 underline-offset-4 hover:underline lg:block">
          Ver todos os textos
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="group block">
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
            {post.publishedAt && (
              <p className="mt-4 text-xs uppercase tracking-wide text-brand-300">{formatDate(post.publishedAt)}</p>
            )}
            <p className="mt-1 font-display text-xl text-brand-800">{post.title}</p>
            {post.excerpt && <p className="mt-2 text-sm text-brand-500">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}

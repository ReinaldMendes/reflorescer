import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diário Reflorescer",
  description: "Reflexões, dicas de autocuidado e bastidores do fazer artesanal.",
};

export default async function JournalPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
      <div className="mb-14 max-w-xl">
        <h1 className="font-display text-display-lg text-brand-800">Diário Reflorescer</h1>
        <p className="mt-3 text-brand-500">Reflexões sobre natureza, cuidado e o fazer artesanal.</p>
      </div>

      <div className="space-y-14">
        {posts.map((post) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="group grid gap-6 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-organic bg-brand-100">
              {post.coverImage && (
                <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-organic group-hover:scale-105" />
              )}
            </div>
            <div>
              {post.publishedAt && <p className="text-xs uppercase tracking-wide text-brand-300">{formatDate(post.publishedAt)}</p>}
              <p className="mt-2 font-display text-2xl text-brand-800">{post.title}</p>
              {post.excerpt && <p className="mt-3 text-sm text-brand-500">{post.excerpt}</p>}
            </div>
          </Link>
        ))}

        {posts.length === 0 && <p className="text-brand-400">Em breve, novos textos por aqui.</p>}
      </div>
    </main>
  );
}

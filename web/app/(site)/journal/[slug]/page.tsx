import { getBlogPostBySlug } from "@/lib/api-client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug).catch(() => null);
  if (!post) return {};
  return { title: post.seoTitle ?? post.title, description: post.seoDescription ?? post.excerpt ?? undefined };
}

export default async function JournalPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug).catch(() => null);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">
      {post.publishedAt && <p className="text-xs uppercase tracking-wide text-brand-300">{formatDate(post.publishedAt)}</p>}
      <h1 className="mt-3 font-display text-display-lg text-brand-800">{post.title}</h1>
      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-organic bg-brand-100">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <article className="prose prose-p:text-brand-600 prose-headings:font-display prose-headings:text-brand-800 mt-10 max-w-none whitespace-pre-line text-body">
        {post.content}
      </article>
    </main>
  );
}

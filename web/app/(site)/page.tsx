import { Hero } from "@/components/site/hero";
import { EditorialSection } from "@/components/site/editorial-section";
import { CategoryGrid } from "@/components/site/category-grid";
import { FeaturedProducts } from "@/components/site/featured-products";
import { ExperiencePicker } from "@/components/site/experience-picker";
import { MakingOf } from "@/components/site/making-of";
import { JournalPreview } from "@/components/site/journal-preview";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { listCategories, getFeaturedProducts, listExperiences, listBlogPosts } from "@/lib/api-client";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, featuredProducts, experiences, latestPosts] = await Promise.all([
    listCategories({ destaque: true }),
    getFeaturedProducts(8),
    listExperiences(),
    listBlogPosts(3),
  ]);

  return (
    <main>
      <Hero imageUrl="/images/hero-reflorescer.jpg" />

      <EditorialSection
        title="Há cuidados que ultrapassam a pele."
        paragraphs={[
          "A Reflorescer Artesanal Natural nasce do encontro entre a delicadeza da natureza, a beleza do feito à mão e a intenção presente em cada detalhe.",
          "Não buscamos apenas oferecer produtos — oferecemos experiências para o corpo, a mente e o espírito.",
        ]}
        imageUrl="/images/editorial-1.jpg"
      />

      <CategoryGrid
        categories={categories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl }))}
      />

      <FeaturedProducts
        products={featuredProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          isNew: p.isNew,
          images: p.images,
        }))}
      />

      <ExperiencePicker experiences={experiences} />

      <MakingOf
        images={[
          { url: "/images/making-of-1.jpg", alt: "Matérias-primas selecionadas" },
          { url: "/images/making-of-2.jpg", alt: "Preparo artesanal" },
          { url: "/images/making-of-3.jpg", alt: "Envase cuidadoso" },
          { url: "/images/making-of-4.jpg", alt: "Embalagem final" },
        ]}
      />

      {latestPosts.length > 0 && <JournalPreview posts={latestPosts} />}

      <NewsletterForm />
    </main>
  );
}

# Imagens necessárias

Este projeto referencia as seguintes imagens em `public/images/`, que devem
ser substituídas por fotografia real da Reflorescer (ver item 38 do
briefing — nunca usar banco de imagens genérico):

**Home / institucional:**
- hero-reflorescer.jpg      → Hero da Home (imagem cinematográfica de natureza)
- editorial-1.jpg           → Seção "Um convite para Reflorescer"
- making-of-1.jpg a 4.jpg   → Seção "O Fazer Artesanal"
- sobre-hero.jpg            → Página "Nossa essência"
- placeholder-product.jpg   → Fallback para produtos sem imagem cadastrada

**Categorias (usadas na grade de categorias da Home):**
- categoria-corpo-e-cuidado.jpg
- categoria-aromas.jpg
- categoria-luz-e-acolhimento.jpg
- categoria-arte-e-energia.jpg
- categoria-presentes.jpg

**Produtos (77 itens do catálogo real semeado em `prisma/seed.ts`):**
Nenhum produto foi semeado com imagem — o `ProductCard` já cai no fallback
`placeholder-product.jpg` até a proprietária subir a foto real de cada item
pelo painel (`/admin/produtos`), com upload múltiplo e reordenação por
arrastar-e-soltar (primeira imagem = principal).

Recomendação: subir todas as imagens de produto/categoria via Cloudinary
pelo painel administrativo assim que a integração de upload for conectada
(ver README.md, seção 5). As imagens estáticas de Home/Sobre podem
continuar em public/images/ ou também migrar para Cloudinary.

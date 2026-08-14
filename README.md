# Reflorescer Artesanal Natural — E-commerce

Site oficial da Reflorescer Artesanal Natural: e-commerce + landing page de marca, construído em Next.js 14 (App Router), TypeScript, TailwindCSS, Prisma e PostgreSQL.

Segue o mesmo padrão de arquitetura, stack e qualidade dos projetos Rose Monteiro e Flora Eça: **Vercel (frontend/API) + Railway (PostgreSQL)**.

---

## 1. Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- TailwindCSS + Framer Motion
- Prisma + PostgreSQL
- NextAuth (autenticação do painel admin)
- Zod (validação)
- Cloudinary (imagens — a conectar)
- Resend (e-mail transacional/newsletter — a conectar)
- dnd-kit (drag-and-drop de imagens no admin)

## 2. Estrutura do projeto

```
app/
  (site)/       → páginas públicas (Home, produtos, checkout, etc.)
  (admin)/      → painel administrativo (protegido por middleware)
  (auth)/       → login do admin (fora do layout protegido)
  api/          → route handlers (carrinho, checkout, webhooks, admin)
components/
  ui/           → primitivos (Button, Input, Badge...)
  site/         → componentes do site público
  admin/        → componentes do painel administrativo
lib/
  services/     → regras de negócio (produto, categoria, carrinho, pedido...)
  payments/     → adapter de gateway de pagamento (trocável sem reescrever checkout)
  validations/  → schemas Zod
prisma/
  schema.prisma → modelagem completa do banco (33 entidades)
  seed.ts       → dados iniciais (categorias, produto de exemplo, experiências)
```

## 3. Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha DATABASE_URL, NEXTAUTH_SECRET etc.
npx prisma db push           # cria as tabelas no banco configurado
npm run db:seed              # popula categorias, produto de exemplo, admin
npm run dev
```

Login inicial do admin criado pelo seed: `admin@reflorescerartesanal.com.br` / `reflorescer2026` — **troque essa senha assim que possível** (ou crie um novo usuário e desative este).

---

## 4. Catálogo real da Reflorescer

O `prisma/seed.ts` já vem populado com o catálogo real enviado pela proprietária em 14/08/2026: **77 produtos** organizados em **5 categorias-mãe → 13 subcategorias**, exatamente como ela nomeou (Sabonete Líquido, Sabonete em Barra, Tônico, Esfoliante, Hidratante, Sérum, Blend Roll-on, Blend Conta-gotas, Mix de Óleos Essenciais, Extrato Vegetal, Linha Imunidade, Incenso, Aromatizador de Ambiente, Vela, Mandala).

**Pontos de atenção antes do lançamento:**

- **Preços são placeholders.** Como a lista enviada não incluía valores, cada subcategoria recebeu um preço médio de mercado só para o site não subir com R$ 0,00 — todos precisam ser ajustados em `/admin/produtos` com os preços reais.
- **Nenhum produto tem foto ainda.** O card de produto já cai graciosamente no `placeholder-product.jpg` até a foto real ser enviada pelo painel (ver `public/images/LEIA-ME.md`).
- **"Meu Guardião da Imunidade"** foi modelado como um produto único com duas variantes (250 ml e 30 ml spray), não como dois produtos — reflete como a proprietária descreveu o item.
- **Nenhuma descrição inventa propriedade terapêutica.** As descrições geradas citam apenas linha + aroma informado (ex.: "Sérum artesanal Reflorescer — Anti-idade"), sem alegações de cura/tratamento — a proprietária deve enriquecer cada ficha com a composição e o modo de uso reais pelo painel.
- **Experiências pré-vinculadas por palavra-chave** (ex.: produtos com "hidratante" no nome entram automaticamente em "Quero cuidar do corpo") — revisar e ajustar manualmente os vínculos que não fizerem sentido.

Para popular o banco com esse catálogo:

```bash
npm run db:seed
```

## 5. Deploy — passo a passo

### 5.1 Banco de dados (Railway)

1. Crie uma conta em [railway.app](https://railway.app) e um novo projeto.
2. Clique em **New → Database → PostgreSQL**.
3. Depois de provisionado, abra a aba **Variables** e copie o valor de `DATABASE_URL`.
4. Guarde essa URL — ela vai para as variáveis de ambiente da Vercel no próximo passo.

> O app Next.js **não** roda no Railway neste projeto — o Railway hospeda só o Postgres. Todo o código (frontend + API routes + admin) roda na Vercel, que já lida nativamente com Next.js.

### 5.2 Aplicar o schema no banco

Localmente, com a `DATABASE_URL` do Railway no seu `.env`:

```bash
npx prisma migrate deploy   # ou npx prisma db push na primeira vez
npm run db:seed
```

### 5.3 Frontend + API (Vercel)

1. Suba este repositório para o GitHub (`git init && git add . && git commit -m "Reflorescer e-commerce" && git push`).
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta o framework Next.js automaticamente (o `vercel.json` já define `buildCommand: prisma generate && next build`).
4. Em **Environment Variables**, adicione (mesmos valores do `.env.example`):

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | a URL copiada do Railway |
   | `NEXTAUTH_URL` | a URL final do site na Vercel |
   | `NEXTAUTH_SECRET` | gerar com `openssl rand -base64 32` |
   | `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | dados da sua conta Cloudinary |
   | `RESEND_API_KEY` | chave da conta Resend |
   | `MERCADOPAGO_ACCESS_TOKEN` | token de produção do Mercado Pago |
   | `NEXT_PUBLIC_SITE_URL` | domínio final do site |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | número de contato |

5. Clique em **Deploy**.
6. Configure o domínio próprio em **Settings → Domains**.

### 5.4 Webhook de pagamento

Depois do deploy, configure no painel do Mercado Pago (ou gateway escolhido) a URL de webhook:
`https://seudominio.com.br/api/webhooks/payment`

---

## 6. O que já está funcional vs. pontos de conexão final

**Funcional de ponta a ponta:**
Home editorial, catálogo com filtros, página de produto, carrinho, checkout (3 etapas), criação de pedido, painel admin com dashboard/produtos/categorias/pedidos, autenticação do admin, sitemap/robots dinâmicos, JSON-LD de produto.

**Estrutura pronta, aguardando credenciais reais para ativar:**
- **Cloudinary** — o uploader de imagens no admin já tem drag-and-drop funcional; falta conectar o endpoint de upload real (`/api/admin/upload`) usando as credenciais do `.env`.
- **Gateway de pagamento** — a interface `PaymentProvider` (`lib/payments/`) já define o contrato; a implementação do Mercado Pago está com a chamada HTTP marcada como `TODO`, pronta para receber o token de produção.
- **Resend** — endpoint de newsletter já salva no banco; falta conectar ao provedor de e-mail marketing.
- **Instagram** — seção da Home aceita posts cadastrados manualmente no admin como fallback caso a API oficial do Instagram não esteja disponível (conforme item 19 do briefing).

Esses pontos foram deixados como interface + TODO comentado propositalmente — são credenciais/contas que só a proprietária pode fornecer, e a arquitetura já está pronta para recebê-las sem refatoração.

## 7. Próximos incrementos sugeridos

- CRUD completo de categorias, kits, cupons e journal no admin (hoje: leitura completa + criação de produto já funcional como referência de padrão a replicar nos demais CRUDs)
- Página de edição de produto existente (reaproveita o `ProductForm` já criado)
- Editor visual de `PageSection` para o conteúdo da Home
- Testes automatizados (Playwright para fluxo de checkout)

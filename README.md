# Reflorescer Artesanal Natural — Monorepo

E-commerce + landing page de marca da Reflorescer Artesanal Natural, dividido em dois projetos independentes:

```
reflorescer/
├── web/     → Next.js 14 (App Router) — só apresentação, deploy na Vercel
└── api/     → Express + Prisma + PostgreSQL — toda a lógica de negócio, deploy no Railway
```

Essa separação foi uma escolha deliberada: **`web/` nunca fala com o banco de dados diretamente.** Toda leitura e escrita passa pela API real (`api/`), via HTTP. Isso deixa a arquitetura mais clara do que uma aplicação Next.js monolítica misturando páginas, componentes e acesso a banco no mesmo lugar — e também abre caminho natural para reaproveitar a mesma API num futuro app mobile (item 44 do briefing original).

---

## 1. Como as duas partes se falam

### Leituras públicas (produtos, categorias, journal, etc.)
`web/` faz `fetch()` direto para a API a partir de Server Components — sem autenticação, com cache/revalidação do Next (`next: { revalidate }`).

```
Server Component (web/) → fetch → API (Railway) → Prisma → PostgreSQL
```

### Carrinho, checkout, newsletter
`web/` mantém rotas próprias em `app/api/*` que funcionam como **proxies finos**: recebem a requisição do navegador, cuidam do cookie de sessão do visitante (`reflorescer_session`), e repassam pra API real. A lógica de negócio (cálculo de total, criação de pedido, cupom) mora inteiramente na API.

### Autenticação do painel administrativo (o ponto mais importante de entender)

Como `web/` e `api/` normalmente ficam em **domínios diferentes** (ex.: `reflorescerartesanal.com.br` na Vercel e `reflorescer-api.up.railway.app` no Railway), não dá pra simplesmente usar um cookie httpOnly cross-domain. O fluxo adotado é o padrão **BFF (Backend-For-Frontend)**:

1. Login do admin envia e-mail/senha para `web/app/api/session/login` (rota do próprio `web/`, não da API).
2. Essa rota chama a API real (`POST /auth/login`) *server-to-server*, recebe um JWT de volta.
3. A rota guarda esse JWT como cookie **httpOnly no domínio do `web/`** — o navegador nunca vê o token.
4. Toda página administrativa (dashboard, produtos, pedidos...) roda como Server Component, lê esse cookie via `lib/admin-client.ts` e repassa como `Authorization: Bearer <token>` nas chamadas para a API.
5. Ações de escrita feitas pelo navegador (ex.: criar produto no formulário) batem numa rota proxy em `web/app/api/admin/*`, que lê o mesmo cookie server-side e encaminha autenticado — o navegador nunca envia o token diretamente para a API.

Resultado: zero necessidade de CORS com credenciais entre domínios, e o JWT nunca fica exposto a JavaScript no navegador.

---

## 2. Rodando localmente

### 2.1 API

```bash
cd api
npm install
cp .env.example .env          # preencha DATABASE_URL, JWT_SECRET, WEB_ORIGIN
npx prisma db push            # cria as tabelas
npm run db:seed               # popula o catálogo real (77 produtos)
npm run dev                   # sobe em http://localhost:4000
```

### 2.2 Web

```bash
cd web
npm install
cp .env.example .env.local    # API_URL=http://localhost:4000
npm run dev                   # sobe em http://localhost:3000
```

Login inicial do admin (criado pelo seed): `admin@reflorescerartesanal.com.br` / `reflorescer2026` — troque essa senha assim que possível.

---

## 3. Deploy — passo a passo

### 3.1 Banco de dados (Railway)

1. Crie um projeto no [railway.app](https://railway.app).
2. **New → Database → PostgreSQL**.
3. Copie a `DATABASE_URL` gerada (vai para o serviço da API no próximo passo).

### 3.2 API (Railway)

1. No mesmo projeto Railway, clique em **New → GitHub Repo** e selecione este repositório.
2. Em **Settings → Root Directory**, defina `api`.
3. Em **Variables**, adicione (valores conforme `api/.env.example`):

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | referência ao Postgres do mesmo projeto (Railway injeta automaticamente se usar "Add Reference") |
   | `JWT_SECRET` | gerar com `openssl rand -base64 32` |
   | `WEB_ORIGIN` | domínio final do `web/` na Vercel |
   | `CLOUDINARY_*` | credenciais da conta Cloudinary |
   | `RESEND_API_KEY` | chave da conta Resend |
   | `MERCADOPAGO_ACCESS_TOKEN` | token de produção |

4. O `railway.toml` já define build (`npm install && npm run build`) e start (`prisma migrate deploy && npm start`) — o deploy aplica as migrations automaticamente.
5. Depois do primeiro deploy, rode o seed uma vez (via Railway CLI ou um job manual): `npm run db:seed`.
6. Anote a URL pública gerada pelo Railway (ex.: `https://reflorescer-api.up.railway.app`) — vai para a Vercel no próximo passo.

### 3.3 Frontend (Vercel)

1. Em [vercel.com](https://vercel.com), **Add New → Project**, selecione este repositório.
2. Em **Root Directory**, defina `web`.
3. Em **Environment Variables**:

   | Variável | Valor |
   |---|---|
   | `API_URL` | URL da API no Railway |
   | `NEXT_PUBLIC_API_URL` | mesma URL (usada em componentes client-side, se necessário) |
   | `NEXT_PUBLIC_SITE_URL` | domínio final do site |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | número de contato |

4. Deploy. Configure o domínio próprio em **Settings → Domains**.
5. Volte no Railway e atualize `WEB_ORIGIN` com esse domínio final (necessário pro CORS).

### 3.4 Webhook de pagamento

Configure no painel do Mercado Pago a URL: `https://sua-api.up.railway.app/webhooks/payment`

---

## 4. Catálogo real

O `api/prisma/seed.ts` já vem com os 77 produtos reais enviados pela proprietária (Sabonete Líquido, Sabonete em Barra, Tônico, Esfoliante, Hidratante, Sérum, Blend Roll-on, Blend Conta-gotas, Mix de Óleos Essenciais, Extrato Vegetal, Linha Imunidade, Incenso, Aromatizador de Ambiente, Vela, Mandala). Preços são placeholders por família — ajuste os valores reais em `/admin/produtos` antes do lançamento. Ver `web/public/images/LEIA-ME.md` para a lista de imagens que faltam.

## 5. O que já está funcional vs. pontos de conexão final

**Funcional de ponta a ponta:** Home editorial, catálogo com filtros, produto, carrinho, checkout, criação de pedido, painel admin (dashboard, produtos, categorias, pedidos), autenticação BFF, sitemap/robots dinâmicos.

**Estrutura pronta, aguardando credenciais reais:** upload de imagem via Cloudinary (endpoint a conectar), gateway de pagamento (interface `PaymentProvider` pronta em `api/src/payments/`, chamada HTTP do Mercado Pago marcada como `TODO`), sincronização de newsletter com Resend, feed real do Instagram.

## 6. Próximos incrementos sugeridos

- CRUD completo de kits, cupons e journal no admin (hoje: produtos e categorias já seguem o padrão a replicar)
- Página de edição de produto existente
- Testes automatizados (Playwright para o fluxo de checkout ponta a ponta, incluindo a chamada real à API)

import "dotenv/config";
import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public.routes";
import { cartRouter } from "./routes/cart.routes";
import { checkoutRouter } from "./routes/checkout.routes";
import { newsletterRouter } from "./routes/newsletter.routes";
import { webhooksRouter } from "./routes/webhooks.routes";
import { authRouter } from "./routes/auth.routes";
import { adminRouter } from "./routes/admin.routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(express.json({ limit: "5mb" }));

// CORS liberado para o domínio do front (web/). Em produção, apenas
// leituras públicas e o webhook de pagamento são chamados diretamente
// pelo navegador/gateway — todo o resto (carrinho, checkout, admin) passa
// pelo web/ como BFF (Backend-For-Frontend), então o CORS aqui é uma
// camada extra de segurança, não o único portão de proteção.
app.use(
  cors({
    origin: process.env.WEB_ORIGIN?.split(",") ?? "*",
    credentials: true,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true, service: "reflorescer-api" }));

// publicRouter já define os caminhos completos internamente
// (/products, /products/featured, /categories, /experiences, etc.),
// então é montado uma única vez na raiz.
app.use("/", publicRouter);

app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/newsletter", newsletterRouter);
app.use("/webhooks", webhooksRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.use(errorHandler);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Reflorescer API rodando na porta ${PORT}`);
});

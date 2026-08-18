import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/10 bg-brand-800 text-bg">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="font-display text-2xl font-light">Reflorescer<span className="text-gold-pale">.</span></p>
          <p className="mt-4 max-w-xs text-sm text-brand-200">
            Natureza, arte e cuidado transformados em experiências para o seu cotidiano.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="https://instagram.com/reflorescer.artesanal" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://wa.me/5542999210868" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gold-pale">Loja</p>
          <ul className="space-y-2 text-sm text-brand-100">
            <li><Link href="/produtos">Todos os produtos</Link></li>
            <li><Link href="/kits">Kits</Link></li>
            <li><Link href="/experiencias">Experiências</Link></li>
            <li><Link href="/journal">Diário Reflorescer</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gold-pale">Atendimento</p>
          <ul className="space-y-2 text-sm text-brand-100">
            <li><Link href="/politicas/trocas-e-devolucoes">Trocas e devoluções</Link></li>
            <li><Link href="/politicas/privacidade">Política de privacidade</Link></li>
            <li><Link href="/politicas/termos">Termos de uso</Link></li>
            <li><Link href="/conta/pedidos">Acompanhar pedido</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gold-pale">Contato</p>
          <ul className="space-y-2 text-sm text-brand-100">
            <li>Cáceres, Mato Grosso</li>
            <li>contato@reflorescerartesanal.com.br</li>
            <li>(42) 99921-0868</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-700 px-6 py-6 text-center text-xs text-brand-300 lg:px-12">
        © {new Date().getFullYear()} Reflorescer Artesanal Natural. Todos os direitos reservados.
      </div>
    </footer>
  );
}

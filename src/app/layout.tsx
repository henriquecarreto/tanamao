import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { DemoToolbar } from '@/components/DemoToolbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tá Na Mão | Serviços e Materiais da Construção Civil',
  description: 'Encontre os melhores pedreiros, eletricistas, encanadores, pintores e ofertas de materiais de construção em Palmital, Assis, Tarumã e Cândido Mota.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <AppProvider>
          <DemoToolbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

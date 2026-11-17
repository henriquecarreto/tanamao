'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import LoginPage from '@/app/login/page';

/**
 * Raiz do projeto Tá Na Mão (/)
 * Conforme especificação oficial:
 * "Confirme que a raiz abre a nova tela de login com o layout completo e que /explorar redireciona para /login sem sessão."
 * "O resultado esperado é a tela de login aprovada, com o formulário de um lado, a foto do outro e o botão verde."
 */
export default function RootPage() {
  const router = useRouter();
  const { currentUser, isLoadingSession } = useApp();

  useEffect(() => {
    if (!isLoadingSession && currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/admin');
      } else if (currentUser.role === 'provider' || currentUser.role === 'store') {
        router.push('/painel');
      } else {
        router.push('/explorar');
      }
    }
  }, [currentUser, isLoadingSession, router]);

  return <LoginPage />;
}

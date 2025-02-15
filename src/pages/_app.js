// pages/_app.js 
import "@/styles/globals.css";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from "../components/layout";
import VerticalBarTransition from "../components/VerticalBarTransition";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Función para navegar con retardo (por ejemplo, 500 ms)
  const handleDelayedNavigation = async (href) => {
    // Si ya se está ejecutando una transición, no hacer nada
    if (loading) return;

    // Activa la transición (muestra VerticalBarTransition)
    setLoading(true);
    // Espera 500ms para que se complete la animación de entrada
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Cambia de ruta
    router.push(href);
  };

  // Cuando se complete el cambio de ruta, espera para ejecutar la animación de salida
  useEffect(() => {
    const handleComplete = () => {
      // Deja que se ejecute la animación de salida (por ejemplo, 1500ms) antes de ocultar la transición
      setTimeout(() => setLoading(false), 820);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Layout handleNavigation={handleDelayedNavigation} loading={loading}>
      {loading && <VerticalBarTransition />}
      <Component {...pageProps} />
    </Layout>
  );
}

// pages/_app.js
import "@/styles/globals.css";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from "../components/layout";
import VerticalBarTransition from "../components/VerticalBarTransition";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import WhatsAppButton from "../components/WhatsAppButton";
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { TransactionProvider } from '@/context/TransactionContext';
import { UserProvider } from '@/context/UserContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  // Detectar si estamos en un iframe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(window.self !== window.top);
    }
  }, []);

  // Función para determinar si se debe animar
  const shouldAnimate = (url) => {
    if (typeof window !== 'undefined' && window.skipAnimation) {
      return false;
    }
    const segments = url.split('/').filter(Boolean);
    return !(segments[0] === 'paginas' && segments.length > 2);
  };

  // Navegación con retardo si corresponde
  const handleDelayedNavigation = async (href, skipAnimation = false) => {
    if (typeof window !== 'undefined' && skipAnimation) {
      window.skipAnimation = true;
      router.push(href);
      return;
    }

    if (loading || !shouldAnimate(href)) {
      router.push(href);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    router.push(href);
  };

  useEffect(() => {
    const handleRouteStart = (url) => {
      if (typeof window !== 'undefined' && window.skipAnimation) {
        window.skipAnimation = false;
        return;
      }
      if (shouldAnimate(url)) setLoading(true);
    };

    const handleRouteComplete = () => {
      if (typeof window !== 'undefined') {
        window.skipAnimation = false;
      }
    };

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router]);

  // Si el componente tiene getLayout, se utiliza; de lo contrario, se usa el Layout global
  const getLayout = Component.getLayout || ((page) => (
    <Layout handleNavigation={handleDelayedNavigation} loading={loading}>
      {page}
    </Layout>
  ));

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <TransactionProvider>
          <UserProvider>
            <AppRouterCacheProvider>
              {loading && <VerticalBarTransition onComplete={() => setLoading(false)} />}
              {getLayout(<Component {...pageProps} />)}
              {/* Renderizamos WhatsAppButton solo si no estamos en un iframe */}
              {!isIframe && (
                <WhatsAppButton 
                  phoneNumber="3008676122" 
                  message="¡Hola! Quiero más información." 
                />
              )}
            </AppRouterCacheProvider>
          </UserProvider>
        </TransactionProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

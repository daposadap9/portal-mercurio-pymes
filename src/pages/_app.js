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

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <TransactionProvider>
          <AppRouterCacheProvider>
            <Layout
              handleNavigation={handleDelayedNavigation}
              loading={loading}
              previousPage={Component.previousPage}
            >
              {loading && <VerticalBarTransition onComplete={() => setLoading(false)} />}
              <Component {...pageProps} />
            </Layout>
            <WhatsAppButton 
              phoneNumber="3008676122" 
              message="¡Hola! Quiero más información." 
            />
          </AppRouterCacheProvider>
        </TransactionProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

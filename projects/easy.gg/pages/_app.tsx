import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import { styletron } from '../components/styletron';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return <StyletronProvider value={styletron} debugAfterHydration>
    <QueryClientProvider client={queryClient}>
    <BaseProvider theme={LightTheme}>
    <Component {...pageProps} />
    </BaseProvider>
    </QueryClientProvider>
  </StyletronProvider>
}

export default MyApp

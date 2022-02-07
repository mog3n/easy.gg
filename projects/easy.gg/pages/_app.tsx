import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import { styletron } from '../components/styletron';

function MyApp({ Component, pageProps }: AppProps) {
  return <StyletronProvider value={styletron} debugAfterHydration>
    <BaseProvider theme={LightTheme}>
    <Component {...pageProps} />
    </BaseProvider>
  </StyletronProvider>
}

export default MyApp

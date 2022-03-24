import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import { styletron } from '../components/styletron';
import { QueryClient, QueryClientProvider } from 'react-query';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { isClient } from '../helpers/helpers';
import { browserLocalPersistence, getAuth, RecaptchaVerifier, setPersistence } from 'firebase/auth';
import { ToasterContainer } from 'baseui/toast';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { signInModalVisibleState } from '../state/atoms/ui';
import { GlobalUI } from '../components/ui/GlobalUI';

const queryClient = new QueryClient();
const firebaseConfig = {
  apiKey: "AIzaSyDBFNUXcJOEsqv2H95J85IzC74bUzgyGfc",
  authDomain: "ezgg-14fd6.firebaseapp.com",
  projectId: "ezgg-14fd6",
  storageBucket: "ezgg-14fd6.appspot.com",
  messagingSenderId: "382337299144",
  appId: "1:382337299144:web:67f17c127ec82cd7c52bfd",
  measurementId: "G-T5QKHECN0R"
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

if (isClient()) {
  // Set an invisible recaptcha object that is available everywhere
  const auth = getAuth(app)
  window.recaptcha = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
  }, auth);
}

function MyApp({ Component, pageProps }: AppProps) {
  return <StyletronProvider value={styletron} debugAfterHydration>
    <RecoilRoot>
      <ToasterContainer>
        <QueryClientProvider client={queryClient}>
          <BaseProvider theme={DarkTheme}>
            <Component {...pageProps} />
            <GlobalUI />
          </BaseProvider>
        </QueryClientProvider>
      </ToasterContainer>
      <div id="recaptcha-container"></div>
    </RecoilRoot>
  </StyletronProvider>
}

export default MyApp

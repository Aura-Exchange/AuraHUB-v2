import AnalyticsProvider, {
  initializeAnalytics,
} from 'components/AnalyticsProvider'
initializeAnalytics()

import { Inter } from '@next/font/google'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { darkTheme, globalReset } from 'stitches.config'
import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  connectorsForWallets,
  DisclaimerComponent,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { 
  ledgerWallet,
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import * as Tooltip from '@radix-ui/react-tooltip'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import {
  ReservoirKitProvider,
  darkTheme as reservoirDarkTheme,
  lightTheme as reservoirLightTheme,
  ReservoirKitTheme,
  CartProvider,
} from '@reservoir0x/reservoir-kit-ui'
import { FC, useEffect, useState } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'
import ToastContextProvider from 'context/ToastContextProvider'
import supportedChains from 'utils/chains'
import { useMarketplaceChain } from 'hooks'
import ChainContextProvider from 'context/ChainContextProvider'
import { Analytics } from '@vercel/analytics/react'
import { faSleigh } from '@fortawesome/free-solid-svg-icons'


//CONFIGURABLE: Use nextjs to load your own custom font: https://nextjs.org/docs/basic-features/font-optimization
const inter = Inter({
  subsets: ['latin'],
})

export const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'true'
  : false

const { chains, provider } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
  publicProvider(),
])

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({  chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: 'My RainbowKit App' }),
      
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      // walletConnectWallet({ chains }),
      ledgerWallet({ chains}),
      trustWallet({ chains }),
      
    ],
  },
]);

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
    <Link href="https://termsofservice.xyz">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{' '}
    <Link href="https://disclaimer.xyz">Disclaimer</Link>
  </Text>
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

//CONFIGURABLE: Here you can override any of the theme tokens provided by RK: https://docs.reservoir.tools/docs/reservoir-kit-theming-and-customization
const reservoirKitThemeOverrides = {
  headlineFont: inter.style.fontFamily,
  font: inter.style.fontFamily,
  primaryColor: '#6E56CB',
  primaryHoverColor: '#644fc1',
}

function AppWrapper(props: AppProps & { baseUrl: string }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      value={{
        dark: darkTheme.className,
        light: 'light',
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <ChainContextProvider>
          <AnalyticsProvider>
            <MyApp {...props} />
          </AnalyticsProvider>
        </ChainContextProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

function MyApp({
  Component,
  pageProps,
  baseUrl,
}: AppProps & { baseUrl: string }) {
  globalReset()

  const { theme } = useTheme()
  const marketplaceChain = useMarketplaceChain()
  const [reservoirKitTheme, setReservoirKitTheme] = useState<
    ReservoirKitTheme | undefined
  >()

  const [rainbowKitTheme, setRainbowKitTheme] = useState<
    | ReturnType<typeof rainbowDarkTheme>
    | ReturnType<typeof rainbowLightTheme>
    | undefined
  >()

  useEffect(() => {
    if (theme == 'dark') {
      setReservoirKitTheme(reservoirDarkTheme(reservoirKitThemeOverrides))
      setRainbowKitTheme(
        rainbowDarkTheme({
          borderRadius: 'small',
        })
      )
    } else {
      setReservoirKitTheme(reservoirLightTheme(reservoirKitThemeOverrides))
      setRainbowKitTheme(
        rainbowLightTheme({
          borderRadius: 'small',
        })
      )
    }
  }, [theme])

  const FunctionalComponent = Component as FC

  let source = process.env.NEXT_PUBLIC_MARKETPLACE_SOURCE

  if (!source && process.env.NEXT_PUBLIC_HOST_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_HOST_URL)
      source = url.host
    } catch (e) { }
  }

  return (
    <HotkeysProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        value={{
          dark: darkTheme.className,
          light: 'light',
        }}
      >
        <ReservoirKitProvider
          options={{
            //CONFIGURABLE: Override any configuration available in RK: https://docs.reservoir.tools/docs/reservoirkit-ui#configuring-reservoirkit-ui
            // Note that you should at the very least configure the source with your own domain
            chains: supportedChains.map(({ proxyApi, id }) => {
              return {
                id,
                baseApiUrl: `${baseUrl}${proxyApi}`,
                active: marketplaceChain.id === id,
              }
            }),
            source: source,
            normalizeRoyalties: NORMALIZE_ROYALTIES,
            disablePoweredByReservoir: true,
            //CONFIGURABLE: Set your marketplace fee and recipient, (fee is in BPS)
            // Note that this impacts orders created on your marketplace (offers/listings)
            marketplaceFee: 100,
            marketplaceFeeRecipient: "0xd2f6BF9e792DbBCA466D93bCC5a939e2D1c72B2B"
          }}
          theme={reservoirKitTheme}
        >
          <CartProvider>
            <Tooltip.Provider>
              <RainbowKitProvider
                coolMode
                chains={chains}
                theme={rainbowDarkTheme({
                  accentColor: '#6e56cf',
                  accentColorForeground: 'white',
                  borderRadius: 'small',
                  overlayBlur: 'large',
                })}
                showRecentTransactions={true}
                modalSize="wide"
                appInfo={{
                  appName: 'Aura Exchange HUB',
                  disclaimer: Disclaimer,
                }}
              >
                <ToastContextProvider>
                  <FunctionalComponent {...pageProps} />
                  <Analytics />
                </ToastContextProvider>
              </RainbowKitProvider>
            </Tooltip.Provider>
          </CartProvider>
        </ReservoirKitProvider>
      </ThemeProvider>
    </HotkeysProvider>
  )
}

AppWrapper.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(appContext)
  let baseUrl = ''

  if (appContext.ctx.req?.headers.host) {
    const host = appContext.ctx.req?.headers.host
    baseUrl = `${host.includes('localhost') ? 'http' : 'https'}://${host}`
  } else if (process.env.NEXT_PUBLIC_HOST_URL) {
    baseUrl = process.env.NEXT_PUBLIC_HOST_URL || ''
  }
  baseUrl = baseUrl.replace(/\/$/, '')

  return { ...appProps, baseUrl }
}

export default AppWrapper

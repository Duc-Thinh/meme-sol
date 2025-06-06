'use client'

import { wagmiAdapter, projectId } from '@/until/web3'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, solana } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
    name: 'appkit-example',
    description: 'AppKit Example',
    url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}
const solanaWeb3JsAdapter = new SolanaAdapter()
// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter],
    projectId,
    networks: [mainnet, arbitrum, solana],
    defaultNetwork: mainnet,
    metadata: metadata,
    features: {
        analytics: false // Optional - defaults to your Cloud configuration
    }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <TonConnectUIProvider
            manifestUrl={'https://bitnet-cdn.s3.ap-southeast-1.amazonaws.com/tonconnect-manifest.json'}
        >
            <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </WagmiProvider>
        </TonConnectUIProvider>
    )
}

export default ContextProvider
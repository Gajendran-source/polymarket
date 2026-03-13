import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { mainnet, polygon, arbitrum, polygonAmoy, solana, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '8873668a5adf4c64be1fbe93f76e9148'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks_list: any = [polygonAmoy, polygon, mainnet, arbitrum, solana, solanaDevnet]

// Set up Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: networks_list.filter((n: any) => n.chainNamespace !== 'solana'),
  projectId,
  ssr: true
})

// Set up Solana Adapter
export const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
})

// Create modal
createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks: networks_list,
  projectId,
  metadata: {
    name: 'Polymarket Clone',
    description: 'Polymarket Clone Web3 Auth',
    url: 'http://localhost:3000',
    icons: ['https://assets.reown.com/reown-profile-pic.png']
  },
  features: {
    analytics: true
  }
})

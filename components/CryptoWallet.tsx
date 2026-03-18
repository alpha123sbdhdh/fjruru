import React, { useState, useEffect, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';

const RPC_URL = 'https://ethereum.publicnode.com';
const projectId = 'c5f69b7369f5bc90d5b2c62e445050f5';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: RPC_URL
};

const metadata = {
  name: 'The Arena',
  description: 'The Arena Crypto Wallet',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://the-arena.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const LazyCryptoWalletContent = React.lazy(() => import('./CryptoWalletContent'));
const LazyLocalWalletContent = React.lazy(() => import('./LocalWalletContent'));

export function CryptoWallet() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [useLocalWallet, setUseLocalWallet] = useState(false);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                // Dynamically import Web3Modal to prevent top-level failures
                const { createWeb3Modal, defaultConfig } = await import('@web3modal/ethers');
                
                // Initialize
                createWeb3Modal({
                    ethersConfig: defaultConfig({ metadata }),
                    chains: [mainnet],
                    projectId,
                    enableAnalytics: false
                });

                if (mounted) {
                    setIsInitialized(true);
                }
            } catch (err: any) {
                console.warn('Failed to initialize Web3Modal, falling back to local wallet:', err);
                if (mounted) {
                    setUseLocalWallet(true);
                    setIsInitialized(true);
                }
            }
        };

        init();

        return () => {
            mounted = false;
        };
    }, []);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                Loading Wallet...
            </div>
        );
    }

    if (useLocalWallet) {
        return (
            <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading Local Wallet...</div>}>
                <LazyLocalWalletContent />
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading Wallet Interface...</div>}>
            <LazyCryptoWalletContent />
        </Suspense>
    );
}

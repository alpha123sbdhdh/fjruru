import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Token, CurrencyAmount } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v3-sdk';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, Send, Download, RefreshCw, AlertTriangle, Shield, Eye, EyeOff, CheckCircle2,
    ChevronDown, Scan, Clock, Settings, Plus, SlidersHorizontal, ArrowLeftRight, Wallet, X,
    ArrowUpRight, ArrowDownLeft, History, CreditCard, LogOut, Home
} from 'lucide-react';
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider, useDisconnect } from '@web3modal/ethers/react';
import { fetchTokenPrices } from '../services/priceService';

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const NETWORKS = {
    ethereum: {
        id: 'ethereum',
        name: 'Ethereum',
        chainId: 1,
        rpcUrl: 'https://ethereum.publicnode.com',
        symbol: 'ETH',
        explorer: 'https://etherscan.io',
        apiUrl: 'https://api.etherscan.io/api',
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        nativeId: 'ethereum'
    },
    polygon: {
        id: 'polygon',
        name: 'Polygon',
        chainId: 137,
        rpcUrl: 'https://polygon.publicnode.com',
        symbol: 'MATIC',
        explorer: 'https://polygonscan.com',
        apiUrl: 'https://api.polygonscan.com/api',
        logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
        nativeId: 'matic-network'
    },
    bsc: {
        id: 'bsc',
        name: 'BSC',
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org',
        symbol: 'BNB',
        explorer: 'https://bscscan.com',
        apiUrl: 'https://api.bscscan.com/api',
        logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
        nativeId: 'binancecoin'
    }
};

const NETWORK_TOKENS = {
    ethereum: [
        { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', price: 0.00, id: 'ethereum' },
        { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', price: 1.00, id: 'usd-coin' },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', price: 1.00, id: 'tether' },
        { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', decimals: 18, logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', price: 7.50, id: 'uniswap' },
    ],
    polygon: [
        { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', decimals: 6, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', price: 1.00, id: 'usd-coin' },
        { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', price: 1.00, id: 'tether' },
        { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC', decimals: 18, logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png', price: 0.00, id: 'matic-network' },
    ],
    bsc: [
        { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB', decimals: 18, logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', price: 0.00, id: 'binancecoin' },
        { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', decimals: 18, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', price: 1.00, id: 'usd-coin' },
        { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', decimals: 18, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', price: 1.00, id: 'tether' },
        { address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', symbol: 'CAKE', decimals: 18, logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png', price: 0.00, id: 'pancakeswap-token' },
    ]
};

export default function CryptoWalletContent() {
    const { open } = useWeb3Modal();
    const { address: connectedAddress, isConnected, chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { disconnect: disconnectWeb3Modal } = useDisconnect();

    const [wallet, setWallet] = useState<ethers.Wallet | ethers.HDNodeWallet | ethers.JsonRpcSigner | null>(null);
    const [balance, setBalance] = useState<string>('0.0');
    const [isLoading, setIsLoading] = useState(false);
    const [sendAddress, setSendAddress] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [importKey, setImportKey] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('tokens');
    const [customTokens, setCustomTokens] = useState<any[]>([]);
    const [showAddTokenModal, setShowAddTokenModal] = useState(false);
    const [newTokenAddress, setNewTokenAddress] = useState('');
    const [currentView, setCurrentView] = useState('home');
    const [currentNetwork, setCurrentNetwork] = useState<keyof typeof NETWORKS>('ethereum');
    const [showSendModal, setShowSendModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [ethPrice, setEthPrice] = useState<number>(0);
    const [ethPriceChange, setEthPriceChange] = useState<number>(0);
    const [estimatedGas, setEstimatedGas] = useState<string>('');
    const [gasUsdValue, setGasUsdValue] = useState<number>(0);
    const [isEstimatingGas, setIsEstimatingGas] = useState(false);
    
    // Swap States
    const [swapAmountIn, setSwapAmountIn] = useState('');
    const [swapAmountOut, setSwapAmountOut] = useState('');
    const [isQuoting, setIsQuoting] = useState(false);
    const [swapSuccess, setSwapSuccess] = useState(false);

    const [tokenPrices, setTokenPrices] = useState<Record<string, { price: number, change: number }>>({});
    const [walletBalances, setWalletBalances] = useState<Record<string, string>>({});
    const [transactions, setTransactions] = useState<{hash: string, type: string, amount: string, asset: string, date: string, status: string}[]>([]);

    const switchNetwork = async (networkId: keyof typeof NETWORKS) => {
        const network = NETWORKS[networkId];
        
        if (isConnected && walletProvider) {
            try {
                await walletProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.toBeHex(network.chainId) }],
                });
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await walletProvider.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: ethers.toBeHex(network.chainId),
                                    chainName: network.name,
                                    rpcUrls: [network.rpcUrl],
                                    nativeCurrency: {
                                        name: network.symbol,
                                        symbol: network.symbol,
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: [network.explorer],
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error("Failed to add network", addError);
                    }
                } else {
                    console.error("Failed to switch network", switchError);
                }
            }
        } else {
            setCurrentNetwork(networkId);
        }
    };

    useEffect(() => {
        if (isConnected && walletProvider) {
            const provider = new ethers.BrowserProvider(walletProvider);
            provider.getNetwork().then(network => {
                // Only fetch balance if the provider's network matches the currentNetwork
                // This prevents CALL_EXCEPTION errors when fetching token balances on the wrong network
                if (network.chainId === BigInt(NETWORKS[currentNetwork].chainId)) {
                    provider.getSigner().then(signer => {
                        setWallet(signer);
                        fetchBalance(signer);
                    });
                }
            });
        } else {
            // Fallback to local storage if not connected via Web3Modal
            const savedKey = localStorage.getItem('iron_temple_wallet_pk');
            if (savedKey) {
                try {
                    const provider = new ethers.JsonRpcProvider(NETWORKS[currentNetwork].rpcUrl);
                    const w = new ethers.Wallet(savedKey, provider);
                    setWallet(w);
                    fetchBalance(w);
                } catch (e) {
                    console.error("Failed to load saved wallet", e);
                }
            } else {
                setWallet(null);
            }
        }
    }, [isConnected, walletProvider, currentNetwork]);

    useEffect(() => {
        if (isConnected && chainId) {
            const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
            if (network && network.id !== currentNetwork) {
                setCurrentNetwork(network.id as keyof typeof NETWORKS);
            }
        }
    }, [chainId, isConnected]);

    useEffect(() => {
        const getQuote = async () => {
            if (!swapAmountIn || isNaN(Number(swapAmountIn)) || Number(swapAmountIn) <= 0) {
                setSwapAmountOut('');
                return;
            }
            
            // Only support swap on Ethereum for now
            if (currentNetwork !== 'ethereum') {
                setSwapAmountOut('');
                return;
            }

            setIsQuoting(true);
            try {
                const provider = new ethers.JsonRpcProvider(NETWORKS.ethereum.rpcUrl);
                const WETH_TOKEN = new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
                const USDC_TOKEN = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin');
                
                const POOL_ABI = [
                    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
                    "function liquidity() external view returns (uint128)"
                ];
                
                // WETH/USDC pool with 0.05% fee
                const poolAddress = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'; 
                const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
                
                const [slot0, liquidity] = await Promise.all([
                    poolContract.slot0(),
                    poolContract.liquidity()
                ]);
                
                const pool = new Pool(
                    WETH_TOKEN,
                    USDC_TOKEN,
                    500,
                    slot0.sqrtPriceX96.toString(),
                    liquidity.toString(),
                    Number(slot0.tick)
                );
                
                const amountIn = ethers.parseEther(swapAmountIn).toString();
                const currencyAmountIn = CurrencyAmount.fromRawAmount(WETH_TOKEN, amountIn);
                
                const [outputAmount] = await pool.getOutputAmount(currencyAmountIn);
                setSwapAmountOut(outputAmount.toExact());
            } catch (err) {
                console.error("Failed to get quote", err);
                setSwapAmountOut('');
            } finally {
                setIsQuoting(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (showSwapModal) {
                getQuote();
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [swapAmountIn, showSwapModal]);

    useEffect(() => {
        const estimateSwapGas = async () => {
            if (!wallet || !swapAmountIn || !swapAmountOut || isNaN(Number(swapAmountIn)) || Number(swapAmountIn) <= 0) {
                setEstimatedGas('');
                setGasUsdValue(0);
                return;
            }

            setIsEstimatingGas(true);
            try {
                const provider = wallet.provider;
                if (!provider) throw new Error("No provider");

                const feeData = await provider.getFeeData();
                const gasPrice = feeData.gasPrice || feeData.maxFeePerGas || 0n;

                // Typical Uniswap V3 swap gas limit is around 150,000 to 250,000
                const gasLimit = 200000n;
                const gasCostWei = gasPrice * gasLimit;
                const gasCostEth = ethers.formatEther(gasCostWei);
                
                setEstimatedGas(parseFloat(gasCostEth).toFixed(6));
                setGasUsdValue(parseFloat(gasCostEth) * ethPrice);
            } catch (err) {
                console.error("Failed to estimate swap gas", err);
                setEstimatedGas('');
                setGasUsdValue(0);
            } finally {
                setIsEstimatingGas(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (showSwapModal && swapAmountOut) {
                estimateSwapGas();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [swapAmountIn, swapAmountOut, showSwapModal, wallet, ethPrice]);

    useEffect(() => {
        let mounted = true;
        const fetchPrice = async () => {
            try {
                const tokens = [...NETWORK_TOKENS[currentNetwork], ...customTokens];
                const addresses = tokens.map(t => t.address);
                
                const pairs = await fetchTokenPrices(addresses);
                
                if (!mounted) return;

                const newPrices: Record<string, { price: number, change: number }> = {};
                
                pairs.forEach(pair => {
                    const token = tokens.find(t => t.address.toLowerCase() === pair.baseToken.address.toLowerCase());
                    if (token) {
                        newPrices[token.symbol] = {
                            price: parseFloat(pair.priceUsd) || 0,
                            change: pair.priceChange?.h24 || 0
                        };
                    }
                });
                
                setTokenPrices(newPrices);
                
                // Update native price from wrapped token price
                const network = NETWORKS[currentNetwork];
                const wrappedSymbol = network.symbol === 'ETH' ? 'WETH' : 
                                      network.symbol === 'MATIC' ? 'WMATIC' : 
                                      network.symbol === 'BNB' ? 'WBNB' : '';
                
                if (wrappedSymbol && newPrices[wrappedSymbol]) {
                    setEthPrice(newPrices[wrappedSymbol].price);
                    setEthPriceChange(newPrices[wrappedSymbol].change);
                }
                
            } catch (err) {
                console.error("Failed to fetch prices", err);
            }
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 60000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [currentNetwork]);


    const fetchBalance = async (w: ethers.Signer | ethers.Wallet) => {
        setIsLoading(true);
        try {
            const address = await w.getAddress();
            const bal = await w.provider!.getBalance(address);
            setBalance(ethers.formatEther(bal));

            // Fetch token balances
            const tokens = [...NETWORK_TOKENS[currentNetwork], ...customTokens];
            
            const balancePromises = tokens.map(async (token) => {
                try {
                    const contract = new ethers.Contract(token.address, ERC20_ABI, w.provider);
                    const tokenBal = await contract.balanceOf(address);
                    const formattedBal = ethers.formatUnits(tokenBal, token.decimals);
                    return { symbol: token.symbol, balance: formattedBal };
                } catch (e) {
                    console.error(`Failed to fetch ${token.symbol} balance`, e);
                    return { symbol: token.symbol, balance: '0' };
                }
            });

            const results = await Promise.all(balancePromises);
            const newBalances: Record<string, string> = {};
            results.forEach(res => {
                newBalances[res.symbol] = res.balance;
            });
            
            setWalletBalances(newBalances);

            // Fetch real transactions from Explorer
            try {
                const network = NETWORKS[currentNetwork];
                const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || 'YourApiKeyToken';
                // Use the same key for now, or fallback to no key if different network
                const apiKeyParam = currentNetwork === 'ethereum' ? `&apikey=${apiKey}` : '';
                
                const ethTxUrl = `${network.apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc${apiKeyParam}`;
                const tokenTxUrl = `${network.apiUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc${apiKeyParam}`;

                const [ethRes, tokenRes] = await Promise.all([
                    fetch(ethTxUrl).catch(() => null),
                    fetch(tokenTxUrl).catch(() => null)
                ]);

                let ethData = { status: '0', result: [] };
                let tokenData = { status: '0', result: [] };

                try {
                    ethData = ethRes && ethRes.ok ? await ethRes.json() : { status: '0', result: [] };
                } catch (e) {
                    console.error("Failed to parse eth tx data", e);
                }

                try {
                    tokenData = tokenRes && tokenRes.ok ? await tokenRes.json() : { status: '0', result: [] };
                } catch (e) {
                    console.error("Failed to parse token tx data", e);
                }

                let allTxs: any[] = [];
                if (ethData.status === '1' && Array.isArray(ethData.result)) {
                    allTxs = [...allTxs, ...ethData.result.map((tx: any) => ({ ...tx, isToken: false }))];
                }
                if (tokenData.status === '1' && Array.isArray(tokenData.result)) {
                    allTxs = [...allTxs, ...tokenData.result.map((tx: any) => ({ ...tx, isToken: true }))];
                }

                // Sort by timestamp descending
                allTxs.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp));
                
                // Take top 10
                const recentTxs = allTxs.slice(0, 10);

                const formattedTxs = recentTxs.map((tx: any) => {
                    const isReceive = tx.to.toLowerCase() === address.toLowerCase();
                    let type = isReceive ? 'Receive' : 'Send';
                    if (!tx.isToken && tx.input !== '0x' && !isReceive) type = 'Contract';

                    const decimals = tx.isToken ? parseInt(tx.tokenDecimal) : 18;
                    const amount = parseFloat(ethers.formatUnits(tx.value, decimals)).toFixed(4);
                    const asset = tx.isToken ? tx.tokenSymbol : network.symbol;
                    
                    const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                    });
                    const status = tx.isError === '1' ? 'Failed' : 'Completed';

                    return {
                        hash: tx.hash,
                        type,
                        amount,
                        asset,
                        date,
                        status
                    };
                });

                setTransactions(formattedTxs);
            } catch (e) {
                // Silently fail for transactions if API key is invalid or rate limited
                setTransactions([]);
            }

        } catch (err) {
            console.error("Failed to fetch balance", err);
        } finally {
            setIsLoading(false);
        }
    };

    const createNewWallet = () => {
        const provider = new ethers.JsonRpcProvider(NETWORKS[currentNetwork].rpcUrl);
        const w = ethers.Wallet.createRandom(provider);
        localStorage.setItem('iron_temple_wallet_pk', w.privateKey);
        setWallet(w);
        fetchBalance(w);
    };

    const importWallet = () => {
        try {
            setError('');
            const provider = new ethers.JsonRpcProvider(NETWORKS[currentNetwork].rpcUrl);
            const w = new ethers.Wallet(importKey, provider);
            localStorage.setItem('iron_temple_wallet_pk', w.privateKey);
            setWallet(w);
            fetchBalance(w);
            setImportKey('');
        } catch (err) {
            setError('Invalid private key');
        }
    };

    const disconnectWallet = () => {
        if (isConnected) {
            disconnectWeb3Modal();
        } else {
            localStorage.removeItem('iron_temple_wallet_pk');
            setWallet(null);
            setBalance('0.0');
            setTxHash('');
            setError('');
        }
    };

    useEffect(() => {
        const estimateGas = async () => {
            if (!wallet || !sendAddress || !sendAmount || isNaN(Number(sendAmount)) || Number(sendAmount) <= 0) {
                setEstimatedGas('');
                setGasUsdValue(0);
                return;
            }

            setIsEstimatingGas(true);
            try {
                const provider = wallet.provider;
                if (!provider) throw new Error("No provider");

                const feeData = await provider.getFeeData();
                const gasPrice = feeData.gasPrice || feeData.maxFeePerGas || 0n;

                // Basic ETH transfer gas limit is 21000
                const gasLimit = 21000n;
                const gasCostWei = gasPrice * gasLimit;
                const gasCostEth = ethers.formatEther(gasCostWei);
                
                setEstimatedGas(parseFloat(gasCostEth).toFixed(6));
                setGasUsdValue(parseFloat(gasCostEth) * ethPrice);
            } catch (err) {
                console.error("Failed to estimate gas", err);
                setEstimatedGas('');
                setGasUsdValue(0);
            } finally {
                setIsEstimatingGas(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (showSendModal) {
                estimateGas();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [sendAddress, sendAmount, showSendModal, wallet, ethPrice]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet) return;
        
        setIsSending(true);
        setError('');
        setTxHash('');

        try {
            const tx = await wallet.sendTransaction({
                to: sendAddress,
                value: ethers.parseEther(sendAmount)
            });
            setTxHash(tx.hash);
            setSendAddress('');
            setSendAmount('');
            
            // Wait for confirmation
            await tx.wait();
            fetchBalance(wallet);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Transaction failed');
        } finally {
            setIsSending(false);
        }
    };

    const handleSwap = async () => {
        if (!wallet || !swapAmountIn || !swapAmountOut) return;
        setIsSending(true);
        setError('');
        setSwapSuccess(false);
        try {
            const provider = new ethers.BrowserProvider(walletProvider as any);
            const signer = await provider.getSigner();

            const ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
            const ROUTER_ABI = [
                "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
            ];
            const routerContract = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

            const amountIn = ethers.parseEther(swapAmountIn);
            const amountOutMinimum = ethers.parseUnits((Number(swapAmountOut) * 0.99).toFixed(6), 6); // 1% slippage

            const params = {
                tokenIn: WETH_ADDRESS,
                tokenOut: USDC_ADDRESS,
                fee: 500,
                recipient: await signer.getAddress(),
                deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            };

            const tx = await routerContract.exactInputSingle(params, {
                value: amountIn
            });

            await tx.wait();
            
            setSwapSuccess(true);
            setSwapAmountIn('');
            setSwapAmountOut('');
            setTimeout(() => {
                setSwapSuccess(false);
                setShowSwapModal(false);
            }, 3000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Swap failed');
        } finally {
            setIsSending(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!wallet) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-[#09090b] text-white">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                            <Shield size={32} className="text-[#D4AF37]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">Connect Wallet</h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">
                        Connect your wallet to access your assets and start trading.
                    </p>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => open()}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors mb-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <Wallet size={18} /> Connect Wallet
                    </motion.button>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR USE LOCAL WALLET</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={createNewWallet}
                        className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#F3C623] transition-colors mb-6 flex items-center justify-center gap-2"
                    >
                        <Download size={18} /> Generate New Wallet
                    </motion.button>

                    <div className="space-y-3 mt-2">
                        <input 
                            type="password" 
                            placeholder="Paste Private Key (0x...)" 
                            value={importKey}
                            onChange={(e) => setImportKey(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={importWallet}
                            disabled={!importKey}
                            className="w-full py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Import Wallet
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const handleAddToken = async () => {
        if (!ethers.isAddress(newTokenAddress)) {
            setError('Invalid address');
            return;
        }
        
        try {
            const provider = new ethers.JsonRpcProvider(NETWORKS[currentNetwork].rpcUrl);
            const tokenContract = new ethers.Contract(newTokenAddress, [
                "function symbol() view returns (string)",
                "function decimals() view returns (uint8)"
            ], provider);
            
            const [symbol, decimals] = await Promise.all([
                tokenContract.symbol(),
                tokenContract.decimals()
            ]);
            
            const newToken = {
                address: newTokenAddress,
                symbol,
                decimals,
                logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.getAddress(newTokenAddress)}/logo.png`,
                price: 0,
                id: symbol.toLowerCase()
            };
            
            setCustomTokens([...customTokens, newToken]);
            setShowAddTokenModal(false);
            setNewTokenAddress('');
        } catch (err) {
            setError('Failed to add token');
        }
    };

    const ethBalanceNum = parseFloat(balance);
    const ethUsdValue = ethBalanceNum * ethPrice;
    
    const displayTokens = [...NETWORK_TOKENS[currentNetwork], ...customTokens].map(token => {
        const bal = walletBalances[token.symbol] || '0';
        const priceData = tokenPrices[token.symbol] || { price: token.price, change: 0 };
        return {
            ...token,
            balance: bal,
            price: priceData.price,
            priceChange: priceData.change,
            usdValue: parseFloat(bal) * priceData.price
        };
    }).filter(t => parseFloat(t.balance) > 0 || t.symbol === 'USDC' || t.symbol === 'UNI' || t.symbol === 'USDT' || t.symbol === 'WMATIC' || t.symbol === 'CAKE');

    const tokensUsdValue = displayTokens.reduce((acc, token) => acc + token.usdValue, 0);
    const totalUsdValue = ethUsdValue + tokensUsdValue;
    
    const usdChange = ethUsdValue * (ethPriceChange / 100); // Simplified change calculation

    return (
        <div className="flex flex-col h-full bg-[#09090b] text-white overflow-hidden relative font-sans selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                        <img src={NETWORKS[currentNetwork].logo} alt={NETWORKS[currentNetwork].name} className="w-6 h-6 rounded-full" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Current Network</div>
                        <div className="relative group cursor-pointer flex items-center gap-1">
                            <span className="font-bold text-sm">{NETWORKS[currentNetwork].name}</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                            
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                                {Object.values(NETWORKS).map((network) => (
                                    <div 
                                        key={network.id}
                                        onClick={() => switchNetwork(network.id as keyof typeof NETWORKS)}
                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors ${currentNetwork === network.id ? 'bg-white/5' : ''}`}
                                    >
                                        <img src={network.logo} alt={network.name} className="w-5 h-5 rounded-full" />
                                        <span className="text-sm font-medium">{network.name}</span>
                                        {currentNetwork === network.id && <CheckCircle2 size={14} className="text-green-500 ml-auto" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${isConnected ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                        {isConnected ? 'Connected' : 'Local Wallet'}
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} className="p-2 hover:bg-white/5 rounded-full cursor-pointer transition-colors" onClick={() => setShowReceiveModal(true)}>
                        <Scan size={20} className="text-gray-400 hover:text-white" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="p-2 hover:bg-white/5 rounded-full cursor-pointer transition-colors" onClick={() => setShowSettingsModal(true)}>
                        <Settings size={20} className="text-gray-400 hover:text-white" />
                    </motion.div>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-32 px-6 scrollbar-hide z-10">
                {/* Navigation Icons */}
                <div className="flex justify-around items-center bg-[#18181b]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 mb-6">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentView('home')} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <Home size={24} className={`${currentView === 'home' ? 'text-blue-500' : 'text-gray-500'} transition-colors`} />
                        <span className={`text-[10px] ${currentView === 'home' ? 'text-blue-500' : 'text-gray-500'} transition-colors`}>Home</span>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSwapModal(true)} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:bg-blue-500 transition-colors border-4 border-[#09090b]">
                            <ArrowLeftRight size={24} className="text-white" />
                        </div>
                        <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors">Swap</span>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentView('activity')} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <Wallet size={24} className={`${currentView === 'activity' ? 'text-blue-500' : 'text-gray-500'} transition-colors`} />
                        <span className={`text-[10px] ${currentView === 'activity' ? 'text-blue-500' : 'text-gray-500'} transition-colors`}>Wallet</span>
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {currentView === 'home' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Balance Card */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 shadow-2xl shadow-blue-900/20">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                                
                                <div className="relative z-10">
                                    <div className="text-blue-100 text-sm font-medium mb-1">Total Balance</div>
                                    <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
                                        ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h1>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md bg-black/20 flex items-center gap-1 ${usdChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                            {usdChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                            ${Math.abs(usdChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md bg-black/20 ${ethPriceChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                            {ethPriceChange >= 0 ? '+' : ''}{ethPriceChange.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { icon: Plus, label: 'Buy', action: () => window.open(`https://buy.moonpay.com?walletAddress=${connectedAddress || ''}&currencyCode=eth`, '_blank') },
                                    { icon: Send, label: 'Send', action: () => setShowSendModal(true) },
                                    { icon: ArrowDownLeft, label: 'Receive', action: () => setShowReceiveModal(true) },
                                    { icon: ArrowLeftRight, label: 'Swap', action: () => setShowSwapModal(true) }
                                ].map((btn, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={btn.action}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#18181b] border border-white/5 flex items-center justify-center shadow-lg group-hover:bg-[#27272a] group-hover:border-white/10 transition-all">
                                            <btn.icon size={24} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{btn.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Assets Tabs */}
                            <div>
                                <div className="flex items-center gap-6 border-b border-white/5 mb-4">
                                    {['tokens', 'nfts'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                                                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div 
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                                                />
                                            )}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => setShowAddTokenModal(true)}
                                        className="pb-3 text-sm font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors ml-auto"
                                    >
                                        + Add Token
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {activeTab === 'tokens' ? (
                                        <motion.div 
                                            key="tokens"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-3"
                                        >
                                            {/* Native Token */}
                                            <div className="flex items-center justify-between p-4 bg-[#18181b]/50 border border-white/5 rounded-2xl hover:bg-[#18181b] transition-colors cursor-pointer group backdrop-blur-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 p-1.5 group-hover:bg-white/10 transition-colors">
                                                        <img src={NETWORKS[currentNetwork].logo} alt={NETWORKS[currentNetwork].name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base text-white">{NETWORKS[currentNetwork].name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            ${ethPrice.toLocaleString()} 
                                                            <span className={ethPriceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                                ({ethPriceChange >= 0 ? '+' : ''}{ethPriceChange.toFixed(2)}%)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-base text-white">${ethUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{parseFloat(balance).toFixed(4)} {NETWORKS[currentNetwork].symbol}</div>
                                                </div>
                                            </div>

                                            {/* Other Tokens */}
                                            {displayTokens.map((token, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-[#18181b]/50 border border-white/5 rounded-2xl hover:bg-[#18181b] transition-colors cursor-pointer group backdrop-blur-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-white/5 p-1.5 group-hover:bg-white/10 transition-colors">
                                                            <img src={token.logo} alt={token.symbol} className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-base text-white">{token.symbol}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                ${token.price.toFixed(2)}
                                                                <span className={token.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                                    ({token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-base text-white">${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{parseFloat(token.balance).toFixed(4)} {token.symbol}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="nfts"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="text-center py-12 text-gray-500 bg-[#18181b]/50 border border-white/5 rounded-2xl flex flex-col items-center gap-3 backdrop-blur-sm"
                                        >
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-2">
                                                <div className="grid grid-cols-2 gap-1">
                                                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                                                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                                                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                                                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                                                </div>
                                            </div>
                                            <p>No NFTs found in this wallet.</p>
                                            <button className="text-blue-400 text-sm hover:underline font-medium">Explore Marketplace</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {currentView === 'activity' && (
                        <motion.div
                            key="activity"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
                            
                            {transactions.length > 0 ? transactions.map((tx, idx) => (
                                <a 
                                    key={idx} 
                                    href={`${NETWORKS[currentNetwork].explorer}/tx/${tx.hash}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center justify-between p-4 bg-[#18181b]/50 border border-white/5 rounded-2xl hover:bg-[#18181b] transition-colors cursor-pointer block group backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${
                                            tx.type === 'Receive' ? 'bg-emerald-500/10 text-emerald-400' : 
                                            tx.type === 'Send' ? 'bg-blue-500/10 text-blue-400' : 
                                            'bg-purple-500/10 text-purple-400'
                                        }`}>
                                            {tx.type === 'Receive' ? <ArrowDownLeft size={18} /> : 
                                             tx.type === 'Send' ? <ArrowUpRight size={18} /> : 
                                             <ArrowLeftRight size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{tx.type} {tx.asset}</div>
                                            <div className="text-xs text-gray-500">{tx.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold text-sm ${tx.type === 'Receive' ? 'text-emerald-400' : 'text-white'} ${tx.status === 'Failed' ? 'line-through opacity-50' : ''}`}>
                                            {tx.type === 'Receive' ? '+' : '-'}{tx.amount} {tx.asset}
                                        </div>
                                        <div className={`text-xs ${tx.status === 'Completed' ? 'text-gray-400' : 'text-red-400'}`}>{tx.status}</div>
                                    </div>
                                </a>
                            )) : (
                                <div className="text-center py-16 text-gray-500 bg-[#18181b]/50 border border-white/5 rounded-2xl flex flex-col items-center gap-4 backdrop-blur-sm">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                        <History size={32} className="opacity-40" />
                                    </div>
                                    <p>No recent transactions found.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showSendModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end"
                    >
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#18181b] rounded-t-3xl p-6 h-[85%] flex flex-col shadow-2xl border-t border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Send {NETWORKS[currentNetwork].symbol}</h2>
                                <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSend} className="space-y-6 flex-1 flex flex-col">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recipient Address</label>
                                    <input 
                                        type="text" 
                                        placeholder="0x..." 
                                        value={sendAddress}
                                        onChange={(e) => setSendAddress(e.target.value)}
                                        className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-4 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount ({NETWORKS[currentNetwork].symbol})</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            step="0.000000000000000001"
                                            min="0"
                                            placeholder="0.0" 
                                            value={sendAmount}
                                            onChange={(e) => setSendAmount(e.target.value)}
                                            className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-4 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors pr-16 placeholder:text-gray-700 text-white"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setSendAmount(balance)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-400 px-3 py-1.5 bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            MAX
                                        </button>
                                    </div>
                                    <div className="text-right mt-2 text-xs text-gray-500">
                                        Available: {parseFloat(balance).toFixed(4)} {NETWORKS[currentNetwork].symbol}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 break-words flex items-start gap-2">
                                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                        {error}
                                    </div>
                                )}

                                {txHash && (
                                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-500 break-words flex items-start gap-2">
                                        <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                                        <div>
                                            Transaction sent! Hash: <br/>
                                            <a href={`${NETWORKS[currentNetwork].explorer}/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline font-mono mt-1 block hover:text-green-400">
                                                {txHash}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto">
                                    {sendAmount && !error && !txHash && (
                                        <div className="flex justify-between items-center p-4 bg-[#09090b] border border-white/5 rounded-xl text-sm mb-4">
                                            <span className="text-gray-400">Estimated Gas Fee</span>
                                            <div className="text-right">
                                                {isEstimatingGas ? (
                                                    <span className="text-gray-500 animate-pulse">Estimating...</span>
                                                ) : estimatedGas ? (
                                                    <>
                                                        <div className="font-medium text-white">{estimatedGas} {NETWORKS[currentNetwork].symbol}</div>
                                                        <div className="text-xs text-gray-500">${gasUsdValue.toFixed(2)}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">Unavailable</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSending || !sendAddress || !sendAmount || isEstimatingGas}
                                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                                    >
                                        {isSending ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                                        {isSending ? 'Sending...' : 'Send Funds'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showReceiveModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end"
                    >
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#18181b] rounded-t-3xl p-6 flex flex-col items-center shadow-2xl border-t border-white/10"
                        >
                            <div className="w-full flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Receive {NETWORKS[currentNetwork].symbol}</h2>
                                <button onClick={() => setShowReceiveModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><X size={20} /></button>
                            </div>
                            
                            <div className="bg-white p-6 rounded-3xl mb-8 shadow-xl">
                                <QRCodeSVG value={wallet.address} size={200} level="H" />
                            </div>

                            <p className="text-sm text-gray-400 text-center mb-6 max-w-xs">
                                Send only <span className="text-white font-bold">{NETWORKS[currentNetwork].name} ({NETWORKS[currentNetwork].symbol})</span> to this address. Sending other assets may result in permanent loss.
                            </p>

                            <div className="w-full bg-[#09090b] border border-white/5 rounded-2xl p-4 flex items-center justify-between mb-8">
                                <div className="truncate font-mono text-sm text-gray-300 mr-4 select-all">
                                    {wallet.address}
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard(wallet.address)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white shrink-0"
                                >
                                    {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                                </motion.button>
                            </div>
                            
                            <div className="w-full flex gap-3">
                                <button className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors text-white">Share Address</button>
                                <button 
                                    onClick={() => copyToClipboard(wallet.address)}
                                    className="flex-1 py-3 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-white"
                                >
                                    Copy Address
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSwapModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end"
                    >
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#18181b] rounded-t-3xl p-6 h-[90%] flex flex-col shadow-2xl border-t border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Swap Tokens</h2>
                                <button onClick={() => setShowSwapModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><X size={20} /></button>
                            </div>
                            
                            <div className="space-y-2 mb-6 flex-1">
                                <div className="bg-[#09090b] border border-white/5 rounded-2xl p-4 transition-colors hover:border-white/10">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">You Pay</label>
                                    <div className="flex justify-between items-center">
                                        <input 
                                            type="number" 
                                            placeholder="0.0" 
                                            value={swapAmountIn}
                                            onChange={(e) => setSwapAmountIn(e.target.value)}
                                            className="bg-transparent text-3xl font-bold w-1/2 focus:outline-none placeholder:text-gray-700 text-white"
                                        />
                                        <div className="flex items-center gap-2 bg-[#18181b] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#27272a] transition-colors border border-white/5">
                                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                                            <span className="font-bold text-base text-white">ETH</span>
                                            <ChevronDown size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                        <span>Balance: {parseFloat(balance).toFixed(4)}</span>
                                        <span className="text-blue-500 cursor-pointer hover:text-blue-400" onClick={() => setSwapAmountIn(balance)}>MAX</span>
                                    </div>
                                </div>

                                <div className="flex justify-center -my-5 relative z-10">
                                    <div className="bg-[#18181b] p-1.5 rounded-full border border-white/5">
                                        <div className="w-10 h-10 bg-[#27272a] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3f3f46] transition-colors shadow-lg">
                                            <ArrowLeftRight size={20} className="text-white rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#09090b] border border-white/5 rounded-2xl p-4 pt-6 transition-colors hover:border-white/10">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">You Receive</label>
                                    <div className="flex justify-between items-center">
                                        <input 
                                            type="text" 
                                            placeholder="0.0" 
                                            value={isQuoting ? '...' : swapAmountOut}
                                            className={`bg-transparent text-3xl font-bold w-1/2 focus:outline-none text-white ${isQuoting ? 'text-gray-500 animate-pulse' : ''}`}
                                            readOnly
                                        />
                                        <div className="flex items-center gap-2 bg-[#18181b] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#27272a] transition-colors border border-white/5">
                                            <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                                            <span className="font-bold text-base text-white">USDC</span>
                                            <ChevronDown size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 break-words mb-4 flex items-center gap-2">
                                    <AlertTriangle size={16} /> {error}
                                </div>
                            )}

                            {swapSuccess && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-500 break-words mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Swap successful!
                                </div>
                            )}

                            {swapAmountIn && swapAmountOut && !error && !swapSuccess && (
                                <div className="flex justify-between items-center p-4 bg-[#09090b] border border-white/5 rounded-xl text-sm mb-4">
                                    <span className="text-gray-400">Estimated Gas Fee</span>
                                    <div className="text-right">
                                        {isEstimatingGas ? (
                                            <span className="text-gray-500 animate-pulse">Estimating...</span>
                                        ) : estimatedGas ? (
                                            <>
                                                <div className="font-medium text-white">{estimatedGas} ETH</div>
                                                <div className="text-xs text-gray-500">${gasUsdValue.toFixed(2)}</div>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Unavailable</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSwap}
                                disabled={isSending || !swapAmountIn || !swapAmountOut || isQuoting || isEstimatingGas}
                                className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg ${
                                    !swapAmountIn || !swapAmountOut || isQuoting || isEstimatingGas
                                        ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
                                }`}
                            >
                                {isSending ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" /> Swapping...
                                    </>
                                ) : !swapAmountIn ? (
                                    'Enter an amount'
                                ) : isQuoting ? (
                                    'Fetching quote...'
                                ) : (
                                    'Swap'
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddTokenModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-[#18181b] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Add Custom Token</h2>
                            <input 
                                type="text" 
                                placeholder="Token Contract Address" 
                                value={newTokenAddress}
                                onChange={(e) => setNewTokenAddress(e.target.value)}
                                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700 text-white mb-6"
                            />
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowAddTokenModal(false)}
                                    className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors text-white"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddToken}
                                    className="flex-1 py-3 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-white"
                                >
                                    Add Token
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSettingsModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end"
                    >
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#18181b] rounded-t-3xl p-6 shadow-2xl border-t border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Shield size={20} className="text-blue-500" /> Security & Settings</h2>
                                <button onClick={() => setShowSettingsModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><X size={20} /></button>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-4 bg-[#09090b] border border-white/5 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Private Key</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {isConnected ? 'Managed by your wallet provider' : 'Never share this with anyone.'}
                                        </p>
                                    </div>
                                    {!isConnected && (
                                        <button 
                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 text-white"
                                        >
                                            {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {showPrivateKey ? 'Hide' : 'Reveal'}
                                        </button>
                                    )}
                                </div>
                                
                                <AnimatePresence>
                                    {showPrivateKey && !isConnected && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between mb-4">
                                                <div className="font-mono text-xs text-red-400 break-all mr-4 select-all">
                                                    {wallet && 'privateKey' in wallet ? wallet.privateKey : 'Private key not available'}
                                                </div>
                                                {wallet && 'privateKey' in wallet && (
                                                    <button 
                                                        onClick={() => copyToClipboard(wallet.privateKey)}
                                                        className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-red-400 shrink-0"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        disconnectWallet();
                                        setShowSettingsModal(false);
                                    }}
                                    className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} /> Disconnect Wallet
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

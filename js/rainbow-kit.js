/**
 * Rainbow Kit Vanilla JavaScript Integration
 * Provides Rainbow Kit-like functionality for vanilla JS projects
 */

class RainbowKitVanilla {
    constructor(config = {}) {
        this.config = {
            projectId: config.projectId || '7f42df324365dc2204b43902ba44a9bd',
            chains: config.chains || [
                { id: 1, name: 'Ethereum', network: 'ethereum', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 } },
                { id: 137, name: 'Polygon', network: 'polygon', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 } },
                { id: 56, name: 'BNB Smart Chain', network: 'bsc', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 } },
                { id: 42161, name: 'Arbitrum One', network: 'arbitrum', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 } },
                { id: 10, name: 'Optimism', network: 'optimism', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 } }
            ],
            walletConnectOptions: config.walletConnectOptions || {},
            ...config
        };

        this.state = {
            isConnected: false,
            isConnecting: false,
            account: null,
            chain: null,
            connector: null,
            error: null
        };

        this.listeners = {
            connect: [],
            disconnect: [],
            accountChanged: [],
            chainChanged: [],
            error: []
        };

        this.walletConnectService = null;
        this.init();
    }

    init() {
        console.log('RainbowKit: Initializing...');
        // Initialize WalletConnect service
        if (typeof WalletConnectService !== 'undefined') {
            console.log('RainbowKit: WalletConnectService found, creating instance...');
            this.walletConnectService = new WalletConnectService({
                projectId: this.config.projectId,
                metadata: {
                    name: 'ZeroPad',
                    description: 'ZeroPad Platform with Rainbow Kit',
                    url: 'https://zeropad.fun',
                    icons: ['https://zeropad.fun/icon.png']
                },
                ...this.config.walletConnectOptions
            });

            this.setupWalletConnectListeners();
            console.log('RainbowKit: Initialization complete');
        } else {
            console.error('WalletConnectService not found. Make sure wallet-connect-service.js is loaded.');
        }
    }

    setupWalletConnectListeners() {
        if (!this.walletConnectService) return;

        this.walletConnectService.on('connected', async (data) => {
            console.log('RainbowKit: Wallet connected:', data);
            this.state.isConnected = true;
            this.state.isConnecting = false;
            this.state.account = {
                address: data.address,
                connector: 'walletconnect'
            };
            this.state.chain = this.getChainById(data.chainId || 1);
            
            this.emit('connect', this.state.account);
            this.updateUI();
        });

        this.walletConnectService.on('disconnected', () => {
            console.log('RainbowKit: Wallet disconnected');
            this.state.isConnected = false;
            this.state.isConnecting = false;
            this.state.account = null;
            this.state.chain = null;
            this.state.connector = null;
            
            this.emit('disconnect');
            this.updateUI();
        });

        this.walletConnectService.on('accountChanged', async (account) => {
            console.log('RainbowKit: Account changed:', account);
            if (account.address) {
                this.state.account = {
                    address: account.address,
                    connector: 'walletconnect'
                };
                this.emit('accountChanged', this.state.account);
            } else {
                this.state.account = null;
                this.emit('disconnect');
            }
            this.updateUI();
        });

        this.walletConnectService.on('chainChanged', (chain) => {
            console.log('RainbowKit: Chain changed:', chain);
            this.state.chain = this.getChainById(chain.chainId);
            this.emit('chainChanged', this.state.chain);
            this.updateUI();
        });

        this.walletConnectService.on('modalClosed', () => {
            console.log('RainbowKit: Modal closed');
            this.state.isConnecting = false;
            this.updateUI();
        });
    }

    getChainById(chainId) {
        return this.config.chains.find(chain => chain.id === chainId) || this.config.chains[0];
    }

    // Event system
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }

    // Connection methods
    async connect() {
        if (this.state.isConnecting) {
            console.log('RainbowKit: Already connecting...');
            return;
        }

        if (this.state.isConnected) {
            console.log('RainbowKit: Already connected');
            return this.state.account;
        }

        try {
            this.state.isConnecting = true;
            this.state.error = null;
            this.updateUI();

            if (this.walletConnectService) {
                await this.walletConnectService.connect();
            } else {
                throw new Error('WalletConnect service not available');
            }
        } catch (error) {
            console.error('RainbowKit: Connection failed:', error);
            this.state.error = error;
            this.state.isConnecting = false;
            this.emit('error', error);
            this.updateUI();
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.walletConnectService) {
                await this.walletConnectService.disconnect();
            }
        } catch (error) {
            console.error('RainbowKit: Disconnect failed:', error);
            this.emit('error', error);
        }
    }

    async switchChain(chainId) {
        if (!this.state.isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            if (this.walletConnectService && this.walletConnectService.switchChain) {
                await this.walletConnectService.switchChain(chainId);
            } else {
                // Fallback: try to switch using ethereum provider
                if (window.ethereum) {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${chainId.toString(16)}` }]
                    });
                }
            }
        } catch (error) {
            console.error('RainbowKit: Chain switch failed:', error);
            this.emit('error', error);
            throw error;
        }
    }

    // State getters
    getAccount() {
        return this.state.account;
    }

    getChain() {
        return this.state.chain;
    }

    isConnected() {
        return this.state.isConnected;
    }

    isConnecting() {
        return this.state.isConnecting;
    }

    getError() {
        return this.state.error;
    }

    // UI methods
    updateUI() {
        // Update connect button text
        const connectButtons = document.querySelectorAll('.connect-wallet-btn, .rainbow-connect-btn');
        connectButtons.forEach(btn => {
            if (this.state.isConnected && this.state.account) {
                const shortAddress = `${this.state.account.address.slice(0, 6)}...${this.state.account.address.slice(-4)}`;
                btn.innerHTML = `
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.6399 11.7607V14.2008C19.6399 15.3054 18.7445 16.2008 17.6399 16.2008H3.39982C2.29527 16.2008 1.39985 15.3054 1.39982 14.2008L1.39948 3.80085C1.39944 2.69625 2.29488 1.80078 3.39948 1.80078H17.6399C18.7445 1.80078 19.6399 2.69621 19.6399 3.80078V6.1717M20.5999 11.7607H17.4799C16.0219 11.7607 14.8399 10.5787 14.8399 9.12066C14.8399 7.66263 16.0219 6.48067 17.4799 6.48067H20.5999V11.7607Z" stroke="white" stroke-width="2" stroke-linejoin="round"></path>
                    </svg>
                    <span>${shortAddress}</span>
                `;
                btn.classList.add('connected');
                btn.disabled = false;
                btn.title = 'Click to disconnect wallet';
            } else if (this.state.isConnecting) {
                btn.innerHTML = `
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.6399 11.7607V14.2008C19.6399 15.3054 18.7445 16.2008 17.6399 16.2008H3.39982C2.29527 16.2008 1.39985 15.3054 1.39982 14.2008L1.39948 3.80085C1.39944 2.69625 2.29488 1.80078 3.39948 1.80078H17.6399C18.7445 1.80078 19.6399 2.69621 19.6399 3.80078V6.1717M20.5999 11.7607H17.4799C16.0219 11.7607 14.8399 10.5787 14.8399 9.12066C14.8399 7.66263 16.0219 6.48067 17.4799 6.48067H20.5999V11.7607Z" stroke="white" stroke-width="2" stroke-linejoin="round"></path>
                    </svg>
                    <span>Connecting...</span>
                `;
                btn.disabled = true;
                btn.title = 'Connecting to wallet...';
            } else {
                btn.innerHTML = `
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.6399 11.7607V14.2008C19.6399 15.3054 18.7445 16.2008 17.6399 16.2008H3.39982C2.29527 16.2008 1.39985 15.3054 1.39982 14.2008L1.39948 3.80085C1.39944 2.69625 2.29488 1.80078 3.39948 1.80078H17.6399C18.7445 1.80078 19.6399 2.69621 19.6399 3.80078V6.1717M20.5999 11.7607H17.4799C16.0219 11.7607 14.8399 10.5787 14.8399 9.12066C14.8399 7.66263 16.0219 6.48067 17.4799 6.48067H20.5999V11.7607Z" stroke="white" stroke-width="2" stroke-linejoin="round"></path>
                    </svg>
                    <span>Connect wallet</span>
                `;
                btn.classList.remove('connected');
                btn.disabled = false;
                btn.title = 'Click to connect wallet';
            }
        });

        // Update chain indicator if exists
        const chainIndicator = document.querySelector('.chain-indicator');
        if (chainIndicator && this.state.chain) {
            chainIndicator.textContent = this.state.chain.name;
            chainIndicator.style.display = 'block';
        }
    }

    // Utility methods
    formatAddress(address, start = 6, end = 4) {
        if (!address) return '';
        return `${address.slice(0, start)}...${address.slice(-end)}`;
    }

    formatBalance(balance, decimals = 18) {
        if (!balance) return '0';
        return (parseFloat(balance) / Math.pow(10, decimals)).toFixed(4);
    }

    // Get supported chains
    getSupportedChains() {
        return this.config.chains;
    }

    // Check if chain is supported
    isChainSupported(chainId) {
        return this.config.chains.some(chain => chain.id === chainId);
    }
}

// Global instance
window.RainbowKitVanilla = RainbowKitVanilla; 
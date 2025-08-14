class TokenPriceService {
    constructor() {
        this.sources = [
            {
                name: 'CoinGecko',
                url: (symbol) => `https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoinGeckoId(symbol)}&vs_currencies=usd`,
                parseResponse: (data, symbol) => {
                    const id = this.getCoinGeckoId(symbol);
                    return data[id]?.usd;
                },
                headers: {}
            },
            {
                name: 'Binance',
                url: (symbol) => `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
                parseResponse: (data) => parseFloat(data.price),
                headers: {}
            },
            {
                name: 'Bybit',
                url: (symbol) => `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`,
                parseResponse: (data) => parseFloat(data.result?.list?.[0]?.lastPrice),
                headers: {}
            },
            {
                name: 'KuCoin',
                url: (symbol) => `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}-USDT`,
                parseResponse: (data) => parseFloat(data.data?.price),
                headers: {}
            },
            {
                name: 'CryptoCompare',
                url: (symbol) => `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`,
                parseResponse: (data) => parseFloat(data.USD),
                headers: {}
            }
        ];
    }

    getCoinGeckoId(symbol) {
        const idMap = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'BNB': 'binancecoin',
            'ADA': 'cardano',
            'SOL': 'solana',
            'MATIC': 'polygon',
            'POL': 'polygon',
            'AVAX': 'avalanche-2',
            'DOT': 'polkadot',
            'UNI': 'uniswap'
        };
        return idMap[symbol.toUpperCase()] || symbol.toLowerCase();
    }

    async fetchFromSource(source, symbol) {
        try {
            const options = {
                method: 'GET',
                headers: source.headers
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(source.url(symbol), {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const price = source.parseResponse(data, symbol);

            if (price && price > 0) {
                return {
                    success: true,
                    price: price,
                    source: source.name
                };
            } else {
                throw new Error('Invalid or zero price data');
            }
        } catch (error) {
            console.warn(`${source.name} failed for ${symbol}:`, error.message);
            return {
                success: false,
                error: error.message,
                source: source.name
            };
        }
    }

    async getTokenPrice(symbol, retryCount = 2) {
        const results = [];
        
        for (const source of this.sources) {
            console.log(`Trying ${source.name} for ${symbol}...`);
            const result = await this.fetchFromSource(source, symbol);
            results.push(result);
            
            if (result.success) {
                console.log(`✅ Got ${symbol} price from ${result.source}: $${result.price}`);
                return {
                    price: result.price,
                    source: result.source,
                    timestamp: new Date().toISOString(),
                    allResults: results
                };
            } else {
                console.warn(`❌ ${result.source} failed: ${result.error}`);
                continue;
            }
        }

        if (retryCount > 0) {
            console.log(`🔄 All sources failed for ${symbol}, retrying... attempts left: ${retryCount}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return this.getTokenPrice(symbol, retryCount - 1);
        }

        const errorMessage = `Failed to get ${symbol} price from all sources: ${results.map(r => `${r.source}: ${r.error}`).join(', ')}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    async getMultipleTokenPrices(symbols) {
        const promises = symbols.map(async symbol => {
            try {
                const result = await this.getTokenPrice(symbol);
                return { symbol, ...result };
            } catch (error) {
                return { symbol, error: error.message };
            }
        });

        const results = await Promise.all(promises);
        return results.reduce((acc, result) => {
            if (result.price) {
                acc[result.symbol] = result;
            } else {
                acc[result.symbol] = { error: result.error };
            }
            return acc;
        }, {});
    }
}

async function getPrice(symbol) {
    try {
        const result = await priceService.getTokenPrice(symbol);
        console.log(`${symbol} price: $${result.price} (from ${result.source})`);
        return result.price;
    } catch (error) {
        console.error(`Error getting ${symbol} price:`, error.message);
        return null;
    }
}

async function getMultiplePrices(symbols) {
    try {
        const results = await priceService.getMultipleTokenPrices(symbols);
        console.log('Multiple prices:', results);
        return results;
    } catch (error) {
        console.error('Error getting multiple prices:', error);
        return {};
    }
}




function openSignMessageModal(){
	document.querySelector('#sign_message').style.display = 'block';
	document.querySelector('#sign_message').classList.add('popup_show');

	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
	
}

function closeAllPopups() {
	document.querySelector('#sign_message').style.display = 'none';
	document.querySelector('#sign_message').classList.remove('popup_show');

	document.querySelector('html').classList.remove('popup-show');
	document.querySelector('html').classList.remove('lock');
}

document.querySelector('#sign_message').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#sign_message .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});






const modal = document.getElementById('connect');
		 
		  
// Twitter elements removed
// const subscribeBtn = document.getElementById('subscribeBtn');
// const subscribedBtn = document.getElementById('subscribedBtn');
// const twitterInput = document.getElementById('twitterInput');








modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModalFunction();
    }
});


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalFunction();
    }
});

// Replace Twitter follow handler with a simple redirect (or leave unused if modal is gone)
// (Removed, no longer used)


/* removed: checkTwitterSubscription (unused) */


/* removed: extractTwitterUsername (unused) */



/* removed: verifyTwitter (unused) */



let errorTimeout;

function showErrorMessage(message) {
const errorElement = document.getElementById('error_message');
const popupItem = document.querySelector('#connect .popup__item');

if (errorTimeout) {
clearTimeout(errorTimeout);
}

if (errorElement) {
errorElement.textContent = message;
errorElement.style.display = 'block';
}

if (popupItem) {
popupItem.style.marginBottom = '0px';
popupItem.style.border = '1px solid red';
}

errorTimeout = setTimeout(() => {
hideErrorMessage();
}, 5000);
}

function hideErrorMessage() {
const errorElement = document.getElementById('error_message');
const popupItem = document.querySelector('#connect .popup__item');

if (errorTimeout) {
clearTimeout(errorTimeout);
errorTimeout = null;
}

if (errorElement) {
errorElement.style.display = 'none';
errorElement.textContent = '';
}

if (popupItem) {
popupItem.style.marginBottom = '';
popupItem.style.border = '';
}
}




/* removed twitter verify flow: subscribedBtn click handler is no longer used */


document.addEventListener('DOMContentLoaded', function() {

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);


    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});










function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let walletService;
let isConnecting = false;
let modalCheckInterval = null;
let connectionStartTime = null;
let isAuthenticating = false;
let isHandlingInitialConnection = false;





function initWallet() {
    if (walletService) {
        return walletService;
    }

    walletService = new WalletConnectService({
        projectId: '8d25d0acbe9473a58a17dff9f274e604',
        metadata: {
            name: 'ZeroPad',
            description: 'ZeroPad Platform',
            url: 'https://zeropad.fun',
            icons: ['https://zeropad.fun/icon.png']
        }
    });

    // Событие подключения
    walletService.on('connected', async (data) => {
        console.log('Wallet connected:', data.address);
        stopModalWatcher();

        if (data.address) {
            updateButtonsTextSign('connected');
            await handleConnection(data.address);
        }
    });

    // Событие отключения
    walletService.on('disconnected', () => {
        console.log('Wallet disconnected');
        stopModalWatcher();
        clearAuthData();
        updateButtonsTextSign('default');
        isHandlingConnection = false;
    });

    // При смене аккаунта
    walletService.on('accountChanged', async (account) => {
        console.log('Account changed:', account.address);

        if (!account.address) {
            // Если пользователь полностью отключил аккаунт
            clearAuthData();
            updateButtonsTextSign('default');
            isHandlingConnection = false;
        } else {
            // Если поменял адрес — сбрасываем авторизацию и начинаем цепочку подключения заново
            clearAuthData();
            updateButtonsTextSign('default');
            try {
                await handleConnection(account.address);
            } catch (e) {
                console.error('Ошибка при переподключении на новый аккаунт:', e);
            }
        }
    });

    walletService.on('modalClosed', () => {
        console.log('Modal closed by user');
        stopModalWatcher();
        isHandlingConnection = false;
        // Если окно закрыли без подключения — сбрасываем текст кнопки
        updateButtonsTextSign('default');
    });

    return walletService;
}

function startModalWatcher() {
    if (modalCheckInterval) {
        clearInterval(modalCheckInterval);
    }
    
    modalCheckInterval = setInterval(() => {
        if (!isConnecting) {
            clearInterval(modalCheckInterval);
            modalCheckInterval = null;
            return;
        }
        
        const modalSelectors = [
            'w3m-modal',
            'wcm-modal',
            '[data-testid="w3m-modal"]',
            'w3m-connect-button[aria-expanded="true"]'
        ];
        
        let modalExists = false;
        for (const selector of modalSelectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
                modalExists = true;
                break;
            }
        }
        
        const timePassed = Date.now() - connectionStartTime;
        
        if (!modalExists && timePassed > 3000) {
            console.log('Modal disappeared, resetting connection state');
            stopModalWatcher();
            isConnecting = false;
        }
        
        const timeoutDuration = isMobileDevice() ? 90000 : 60000;
        if (timePassed > timeoutDuration) {
            console.log('Connection timeout');
            stopModalWatcher();
            
            isConnecting = false;
            connectionStartTime = null;
            
            cleanupWalletService();
        }
    }, 1000);
    
    console.log('Modal watcher started');
}

function stopModalWatcher() {
    isConnecting = false;
    connectionStartTime = null;
    
    if (modalCheckInterval) {
        clearInterval(modalCheckInterval);
        modalCheckInterval = null;
        console.log('Modal watcher stopped');
    }
}

function saveAuthData(address) {
    localStorage.setItem('authenticated_address', address);
    localStorage.setItem('auth_timestamp', Date.now().toString());
}

function clearAuthData() {
    localStorage.removeItem('authenticated_address');
    localStorage.removeItem('auth_timestamp');
}

function isAuthValid() {
    const address = localStorage.getItem('authenticated_address');
    const timestamp = localStorage.getItem('auth_timestamp');
    
    if (!address || !timestamp) return false;
    
    const hoursPassed = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60);
    return hoursPassed < 24;
}

function showTwitterModal() {
    // No-op: Twitter modal removed
}

async function requestNonce(address) {
    const response = await fetch('/api/auth/request-nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data.nonce;
}

async function authenticateUser(address) {
    if (isAuthenticating) {
        console.log('Authentication already in progress, skipping');
        return;
    }
    
    try {
        isAuthenticating = true;
        openSignMessageModal();
        
        const nonce = await requestNonce(address);
        const result = await walletService.authenticateWithSignature(nonce);
        
        saveAuthData(address);
        localStorage.setItem('wallet_address', address);
        
        return result;
    } catch (error) {
        closeAllPopups();
        console.error('Authentication failed:', error);
        throw error;
    } finally {
        closeAllPopups();
        isAuthenticating = false;
    }
}

let isHandlingConnection = false;

let handleConnectionTimeout = null;

async function handleConnection(address) {
    if (!address) return;
    
    if (handleConnectionTimeout) {
        clearTimeout(handleConnectionTimeout);
    }
    
    handleConnectionTimeout = setTimeout(async () => {
        if (isHandlingConnection) {
            console.log('Already handling connection, skipping');
            return;
        }
        
        isHandlingConnection = true;
        
        const savedAddress = localStorage.getItem('authenticated_address');
        const isValid = isAuthValid();

        if (savedAddress === address && isValid) {
            console.log('Already authenticated');
            updateButtonsTextSign('authenticated');
            window.location.href = '/home';
            isHandlingConnection = false;
            return;
        }

        if (savedAddress !== address) {
            clearAuthData();
        }

        try {
            const authResult = await authenticateUser(address);
            if (authResult) {
                updateButtonsTextSign('authenticated');
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Error in handleConnection:', error);
        } finally {
            isHandlingConnection = false;
        }
    }, 500);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

async function checkTwitterStatusAndHandle() {
    // Directly proceed to the app after auth
    window.location.href = '/home';
    return true;
}

async function connectWallet() {
    console.log('Connect wallet clicked');
    if (isConnecting) {
        console.log('Уже идёт подключение, игнорируем клик');
        return;
    }

    const sessionId = getCookie("session_id");
    if (sessionId) {
        window.location.href = '/home';
        return;
    }

    const wallet = initWallet();
    const connectionInfo = wallet.getConnectionInfo();

    if (connectionInfo.isConnected && connectionInfo.address) {
        console.log('Кошелёк уже подключен, проверяю авторизацию...');
        const savedAddress = localStorage.getItem('authenticated_address');
        const isValid = isAuthValid();

        if (savedAddress === connectionInfo.address && isValid) {
            console.log('Уже авторизован');
            updateButtonsTextSign('authenticated');
            window.location.href = '/home';
            return;
        }

        updateButtonsTextSign('connected');
        console.log('Кошелёк подключен, но не авторизован, запрашиваю подпись...');
        try {
            await handleConnection(connectionInfo.address);
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            updateButtonsTextSign('default');
        }
        return;
    }

    // Новое подключение
    try {
        localStorage.removeItem('wagmi.store');
        localStorage.removeItem('wagmi.recentConnectorId');
        const wcKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('wc@') || key.startsWith('wagmi'))) {
                wcKeys.push(key);
            }
        }
        wcKeys.forEach(key => localStorage.removeItem(key));

        isConnecting = true;
        connectionStartTime = Date.now();
        startModalWatcher();

        console.log('Открываю модалку кошелька...');
        await wallet.connect();
    } catch (error) {
        console.error('Подключение не удалось:', error);
        stopModalWatcher();
        isConnecting = false;
        connectionStartTime = null;
        updateButtonsTextSign('default');

        // Если пользователь закрыл модалку или отменил коннект
        if (error.message && error.message.includes('User closed modal')) {
            console.log('Пользователь закрыл модалку — ждём нового нажатия');
        } else if (error.message && (error.message.includes('timeout') || error.message.includes('expired'))) {
            console.log('Таймаут или срок истёк — пересоздаём подключение');
            cleanupWalletService();
            setTimeout(() => {
                console.log('Готов к новой попытке подключения');
            }, 1000);
        }
    }
}

const connectWalletBtns = document.querySelectorAll('.connect-wallet-btn');
connectWalletBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const sessionId = getCookie('session_id');
        if (sessionId) {
            window.location.href = '/home';
            return;
        }
        connectWallet();
    });
});

// On load, if session exists, reflect Dashboard text immediately
window.addEventListener('DOMContentLoaded', () => {
    const sessionId = getCookie('session_id');
    if (sessionId) {
        updateButtonsTextSign('authenticated');
    }
});

function restorePageInteraction() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';
    
    const overlayElements = document.querySelectorAll('[style*="position: fixed"], [style*="overflow: hidden"]');
    overlayElements.forEach(el => {
        if (el.className && (el.className.includes('w3m') || el.className.includes('wcm'))) {
            el.remove();
        }
    });
}
  

function cleanupWalletService() {
    if (walletService) {
        try {
            if (walletService.modal) {
                walletService.modal.close();
            }
            walletService.disconnect();
        } catch (e) {
            console.error('Error during wallet cleanup:', e);
        }
        walletService = null;
    }
    
    localStorage.removeItem('wagmi.store');
    localStorage.removeItem('wagmi.recentConnectorId');
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wagmi')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}




function updateButtonsTextSign(status) {
    const buttons = document.querySelectorAll('.connect-wallet-btn');
    buttons.forEach((btn, index) => {
        if (isMobileDevice() && index === 0) return;

        switch (status) {
            case 'connected':
                btn.textContent = 'Sign & Verify';
                break;
            case 'authenticated':
                btn.textContent = 'Dashboard';
                break;
            default:
                btn.textContent = 'Connect Wallet';
        }
    });
}


















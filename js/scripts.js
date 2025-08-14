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
		 
		  
const subscribeBtn = document.getElementById('subscribeBtn');
const subscribedBtn = document.getElementById('subscribedBtn');
const twitterInput = document.getElementById('twitterInput');








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


subscribeBtn.addEventListener('click', function() {
    window.open('https://twitter.com/intent/follow?screen_name=ZeroPad_fun', '_blank');
    

   
    

    
    subscribedBtn.style.display = 'block';
});


async function checkTwitterSubscription(baseUrl = '') {
try {

const sessionId = getCookie('session_id');

if (!sessionId) {
    throw new Error('Session ID not found in cookies');
}

          const response = await fetch(`/api/twitter/subscription`, {
    method: 'GET',
    headers: {
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json'
    }
});

if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();

console.log('Twitter subscription check:', data);
return data;

} catch (error) {
console.error('Failed to check Twitter subscription:', error);
throw error;
}
}


function extractTwitterUsername(input) {
if (!input) {
throw new Error('Twitter input is required');
}

const cleanInput = input.trim();

if (!/^https?:\/\//.test(cleanInput) && !cleanInput.includes('@')) {
const username = cleanInput.replace(/^@/, '');
if (/^[A-Za-z0-9_]{1,15}$/.test(username)) {
    return username;
}
}


const patterns = [

/^https?:\/\/(?:www\.)?x\.com\/([A-Za-z0-9_]{1,15})(?:\/.*|\?.*|$)/,

/^https?:\/\/(?:www\.)?twitter\.com\/([A-Za-z0-9_]{1,15})(?:\/.*|\?.*|$)/,

/^@([A-Za-z0-9_]{1,15})$/
];


for (const pattern of patterns) {
const match = cleanInput.match(pattern);
if (match && match[1]) {
    return match[1];
}
}


throw new Error('Invalid Twitter URL or username format');
}


async function verifyTwitter(walletAddress, twitterInput, baseUrl = '', apiKey = null) {
try {
if (!walletAddress || !twitterInput) {
  throw new Error('Wallet address and Twitter input are required');
}

const twitterId = extractTwitterUsername(twitterInput);

console.log(`Extracted Twitter username: ${twitterId} from input: ${twitterInput}`);

const headers = {
  'Content-Type': 'application/json'
};

if (apiKey) {
  headers['X-API-Key'] = apiKey;
}

const response = await fetch(`/api/auth/verify-twitter`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
      wallet: walletAddress,
      twitterId: twitterId
  })
});

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
}

const data = await response.json();

if (data.success === false) {
  showErrorMessage(data.message);
  
  if (data.error === "Пользователь не подписан на Twitter") {
      console.log('User is not subscribed to Twitter');
      return false;
  }
  
  return false;
}

hideErrorMessage();

console.log('Twitter verification successful:', data);
return data['success'];

} catch (error) {
console.error('Twitter verification failed:', error);

showErrorMessage(error.message);

if (error.message && error.message.includes("Пользователь не подписан на Twitter")) {
  return false;
}

throw error;
}
}

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




subscribedBtn.addEventListener('click', async function() {
const twitterLink = twitterInput.value.trim();
    
if (!twitterLink) {
alert('Please enter your Twitter profile link');
return;
}
console.log('subscribedBtn clicked!');

subscribedBtn.disabled = true;
subscribedBtn.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 16px; height: 16px; border: 2px solid #e3f2fd; border-top: 2px solid #2196f3; border-radius: 50%; animation: spin 1s linear infinite;"></div>Authenticating...</div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>';

try {
const twitterLinkk = twitterInput.value.trim();
const walletAddress = localStorage.getItem("wallet_address");

resp = await verifyTwitter(walletAddress, twitterLinkk);


if (resp){
    location.href = '/home';
}

console.log('Auth successful:', resp);




} catch (error) {
console.error('Auth failed:', error);
subscribedBtn.textContent = 'Try Again';
alert('Authentication failed: ' + error.message);
} finally {
setTimeout(() => {
    subscribedBtn.disabled = false;
    subscribedBtn.textContent = 'I\'m subscribed';
}, 3000);
}
});


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
    
    walletService.on('connected', async (data) => {
        console.log('Wallet connected:', data.address);
        stopModalWatcher();
        
        if (data.address) {
            updateButtonsTextSign('connected');
            await handleConnection(data.address);
        }
    });

    walletService.on('disconnected', () => {
        console.log('Wallet disconnected');
        stopModalWatcher();
        clearAuthData();
       
        updateButtonsTextSign('default');
        isHandlingConnection = false;
    });

    walletService.on('accountChanged', async (account) => {
        console.log('Account changed:', account.address);
        
        if (!account.address) {
            clearAuthData();
            isHandlingConnection = false;
        }
    });

    walletService.on('modalClosed', () => {
        console.log('Modal closed by user');
        stopModalWatcher();
        isHandlingConnection = false;
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
    const openTwitterBtn = document.getElementById('openTwitterbtn');
    
    if (openTwitterBtn) {
        openTwitterBtn.click();
        console.log('Twitter modal opened via openTwitterbtn click');
    } else {
        console.warn('Element with ID "openTwitterbtn" not found, trying fallback method');
        
        const twitterModalEl = document.querySelector('.modal');
        if (twitterModalEl) {
            twitterModalEl.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Twitter modal opened via fallback method');
        } else {
            console.error('Could not open Twitter modal - neither button nor modal element found');
        }
    }
    
    if (walletService && walletService.modal) {
        walletService.modal.close();
    }
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
            checkTwitterStatusAndHandle();
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
                checkTwitterStatusAndHandle();
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

async function checkTwitterStatus() {
    try {
        const sessionId = getCookie('session_id');
        if (!sessionId) throw new Error('No session');

        const response = await fetch('/api/twitter/status', {
            method: 'GET',
            headers: {
                'X-Session-ID': sessionId,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data['status'];
    } catch (error) {
        console.error('Twitter check failed:', error);
        throw error;
    }
}

async function connectWallet() {
    console.log('Connect wallet clicked');
    
    if (isConnecting) {
        console.log('Already connecting, ignoring click');
        return;
    }
    
    const sessionId = getCookie("session_id");
    if (sessionId) {
        checkTwitterStatusAndHandle();
        return;
    }
    
    const wallet = initWallet();
    const connectionInfo = wallet.getConnectionInfo();
    
    if (connectionInfo.isConnected && connectionInfo.address) {
		console.log('Wallet already connected, checking authentication...');
		
		const savedAddress = localStorage.getItem('authenticated_address');
		const isValid = isAuthValid();
		
		if (savedAddress === connectionInfo.address && isValid) {
			console.log('Already authenticated, showing Twitter modal');
			updateButtonsTextSign('authenticated');
            checkTwitterStatusAndHandle();
			
			return;
		}
		
		updateButtonsTextSign('connected');
		console.log('Wallet connected but not authenticated, requesting signature...');
		try {
			await handleConnection(connectionInfo.address);
		} catch (error) {
			console.error('Authentication error:', error);
		}
		return;
	}
    
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
        
        console.log('Opening wallet modal...');
        await wallet.connect();
        
    } catch (error) {
        console.error('Connection failed:', error);
        stopModalWatcher();
        
        isConnecting = false;
        connectionStartTime = null;
        
        if (error.message && error.message.includes('User closed modal')) {
            console.log('User closed modal, ready for next attempt');
        } else if (error.message && (error.message.includes('timeout') || error.message.includes('expired'))) {
            console.log('Connection timeout or expired, reinitializing...');
            cleanupWalletService();
            setTimeout(() => {
                console.log('Ready for next connection attempt');
            }, 1000);
        }
    }
}

async function disconnectWallet() {
    try {
        stopModalWatcher();
        clearAuthData();
        if (walletService) {
            await walletService.disconnect();
        }
    } catch (error) {
        console.error('Disconnect failed:', error);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isConnecting) {
        console.log('Escape pressed during connection');
        setTimeout(() => {
            const modalSelectors = [
                'w3m-modal',
                'wcm-modal', 
                '[data-testid="w3m-modal"]'
            ];
            
            let modalExists = false;
            for (const selector of modalSelectors) {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    modalExists = true;
                    break;
                }
            }
            
            if (!modalExists) {
                console.log('Modal closed after Escape, stopping watcher');
                stopModalWatcher();
            }
        }, 200);
    }
});

document.addEventListener('click', (e) => {
    if (isConnecting) {
        const isModalClick = e.target.closest('w3m-modal, wcm-modal, [data-testid="w3m-modal"]');
        if (!isModalClick) {
            setTimeout(() => {
                const modalSelectors = [
                    'w3m-modal',
                    'wcm-modal',
                    '[data-testid="w3m-modal"]'
                ];
                
                let modalExists = false;
                for (const selector of modalSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.offsetParent !== null) {
                        modalExists = true;
                        break;
                    }
                }
                
                if (!modalExists && isConnecting) {
                    console.log('Modal closed by outside click, stopping watcher');
                    stopModalWatcher();
                }
            }, 300);
        }
    }
});

window.addEventListener('load', async () => {
    console.log('Page loaded');
    
    try {
        const wallet = initWallet();
        const connectionInfo = wallet.getConnectionInfo();
        
        if (connectionInfo.isConnected) {
            const address = wallet.getAddress();
            if (address) {
                try {
                    await wallet.getBalance(address);
                    
                    
                    
                    const savedAddress = localStorage.getItem('authenticated_address');
                    const isValid = isAuthValid();
                    
                    if (savedAddress === address && isValid) {
                        console.log('Authentication valid on load');
                        updateButtonsTextSign('authenticated');
                    } else {
                        updateButtonsTextSign('connected');
                        if (!isValid && savedAddress) {
                            clearAuthData();
                        }
                    }
                } catch (error) {
                    console.log('Stale connection detected, cleaning up...');
                    localStorage.removeItem('wagmi.store');
                    localStorage.removeItem('wagmi.recentConnectorId');
                    cleanupWalletService();
                    updateButtonsTextSign('default');
                }
            }
        } else {
            updateButtonsTextSign('default');
            localStorage.removeItem('wagmi.store');
            localStorage.removeItem('wagmi.recentConnectorId');
        }
    } catch (error) {
        console.error('Load error:', error);
        localStorage.removeItem('wagmi.store');
        localStorage.removeItem('wagmi.recentConnectorId');
        updateButtonsTextSign('default');
    }
    
  
    const sessionId = getCookie('session_id');
    if (sessionId) {
        updateButtonsTextSign('authenticated');
    }
});

setInterval(() => {
    const isValid = isAuthValid();
    if (!isValid && localStorage.getItem('authenticated_address')) {
        clearAuthData();
    }
}, 30000);

window.addEventListener('beforeunload', () => {
    stopModalWatcher();
    cleanupWalletService();
});

async function checkTwitterStatusAndHandle() {
    const sessionId = getCookie('session_id');
    if (!sessionId) return false;
    try {
        const response = await fetch('/api/twitter/status', {
            method: 'GET',
            headers: {
                'X-Session-ID': sessionId,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const data = await response.json();
        console.log(data);
        if (data.hasTwitter === true) {
            window.location.href = '/home';
            return true;
        } else {
            showTwitterModal();
            return false;
        }
    } catch (error) {
        console.error('Twitter status check failed:', error);
        showTwitterModal();
        return false;
    }
}

const connectWalletBtns = document.querySelectorAll('.connect-wallet-btn');
connectWalletBtns.forEach(btn => {
    btn.addEventListener('click', async (event) => {
        const sessionId = getCookie('session_id');
        console.log(sessionId)
        if (sessionId) {
            const handled = await checkTwitterStatusAndHandle();
            if (handled) return;
            return;
        }
        
        connectWallet();
    });
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
        if (isMobileDevice() && index === 0) {
            return;
        }
        
        switch(status) {
            case 'connected':
                btn.textContent = 'Sign & Verify';
                break;
            case 'authenticated':
                btn.textContent = 'Connect Twitter';
                break;
            default:
                btn.textContent = 'Connect Wallet';
        }
    });
}

















async function checkTwitterStatus() {
    try {
        const response = await fetch('/api/twitter/status');
        const data = await response.json();
        
        if (data.hasTwitter === true) {
            const connectButtons = document.querySelectorAll('.connect-wallet-btn');
            const isMobile = window.innerWidth <= 768;
            
            connectButtons.forEach((button, index) => {
                if (isMobile) {
                    if (index !== 0) {
                        button.textContent = 'Dashboard';
                    }
                } else {
                    button.textContent = 'Dashboard';
                }
            });
        }
    } catch (error) {
        console.error('Error checking Twitter status:', error);
    }
}

window.addEventListener('load', checkTwitterStatus);


async function fetchAndDisplayPoints() {
    try {
        const response = await fetch('/api/points/balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const data = await response.json();
        if (data && data.points !== undefined) {
            document.getElementById('totalPoints').textContent = data.points;
        }
    } catch (error) {
        console.error('Failed to fetch points balance:', error);
    }
}

window.addEventListener('load', async () => {
    await fetchAndDisplayPoints();
});


function shortenAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function loadWalletAddress() {
    if (window.innerWidth <= 768) {
        return;
    }
    
    const walletAddress = localStorage.getItem('wallet_address');
    
    if (walletAddress) {
        const accountSpan = document.querySelector('.header__account span');
        
        if (accountSpan) {
            accountSpan.textContent = shortenAddress(walletAddress);
        }
    }
}

window.addEventListener('load', loadWalletAddress);

window.addEventListener('resize', () => {
    const accountSpan = document.querySelector('.header__account span');
    if (accountSpan) {
        if (window.innerWidth <= 768) {
            accountSpan.textContent = 'Account';
        } else {
            loadWalletAddress();
        }
    }
});

const accountButton = document.getElementById('accountButton');
const accountDropdown = document.getElementById('accountDropdown');


accountButton.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const isActive = accountDropdown.classList.contains('active');
    
    if (isActive) {
        closeDropdown();
    } else {
        openDropdown();
    }
});


document.addEventListener('click', function(e) {
    if (!accountButton.contains(e.target)) {
        closeDropdown();
    }
});


accountDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
});

function openDropdown() {
    accountDropdown.classList.add('active');
    accountButton.classList.add('active');
}

function closeDropdown() {
    accountDropdown.classList.remove('active');
    accountButton.classList.remove('active');
}


function disconnectSite() {

        
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname + ";";
        
        
        localStorage.removeItem('wallet_address');
        sessionStorage.removeItem('session_id');
        
        
        closeDropdown();
        
        
        window.location.href = '/index.html';
    }
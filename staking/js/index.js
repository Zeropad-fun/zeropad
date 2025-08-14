const networkToCurrency = {
    'ethereum': { currency: 'ETH', icon: '../img/icon1.svg', name: 'Ethereum' },
    'arbitrum': { currency: 'ETH', icon: '../img/F20250214013812396t6W3LsvAR4tzev.png', name: 'Arbitrum' },
    'optimism': { currency: 'ETH', icon: '../img/rsz_optimism.webp', name: 'Optimism' },
    'base': { currency: 'ETH', icon: '../img/rsz_base.webp', name: 'Base' },
    'blast': { currency: 'ETH', icon: '../img/rsz_blast.webp', name: 'Blast' },
    'berachain': { currency: 'ETH', icon: '../img/berachain-icon.png', name: 'Berachain' },
    'abstract': { currency: 'ETH', icon: '../img/rsz_abstract.webp', name: 'Abstract' },
    'polygon': { currency: 'POL', icon: '../img/rsz_polygon.webp', name: 'Polygon' },
    'avalanche': { currency: 'AVAX', icon: '../img/rsz_avalanche.webp', name: 'Avalanche' }
};

async function getStakeBalance() {
    try {
        const response = await fetch('/api/stake/balance');
        const data = await response.json();
        
        updateBalanceDisplay(data);
        
    } catch (error) {
        console.error('Error fetching balance:', error);
        updateBalanceDisplay({ balances: null });
    }
}

function updateBalanceDisplay(data) {
    const balances = {
        'ETH': 0,
        'POL': 0,
        'AVAX': 0
    };
    
    if (data.balances && Array.isArray(data.balances)) {
        data.balances.forEach(balance => {
            const network = balance.network.toLowerCase();
            const amount = parseFloat(balance.amount);
            
            if (networkToCurrency[network]) {
                const currency = networkToCurrency[network].currency;
                
                
                if (amount < 0.0001) {
                    balances[currency] = 0;
                } else {
                    balances[currency] += amount;
                }
            }
        });
    }
    
    updateHTMLElements(balances);
}

function updateHTMLElements(balances) {
    const container = document.querySelector('.exchange__rowd');
    
    container.innerHTML = '';
    
    container.innerHTML += `
        <div class="exchange__boxd">
            <img src="../img/icon1.svg" alt="Ethereum" width="25" height="24">
            <div class="exchange__value">${balances.ETH.toFixed(4)} ETH</div>
        </div>
    `;
    
    container.innerHTML += `
        <div class="exchange__boxd">
            <img src="../img/rsz_polygon.webp" style="border-radius: 50%;" alt="Polygon" width="25" height="24">
            <div class="exchange__value">${balances.POL.toFixed(4)} POL</div>
        </div>
    `;
    
    container.innerHTML += `
        <div class="exchange__boxd">
            <img src="../img/rsz_avalanche.webp" style="border-radius: 50%;" alt="Avalanche" width="25" height="24">
            <div class="exchange__value">${balances.AVAX.toFixed(4)} AVAX</div>
        </div>
    `;
}

getStakeBalance();




function refreshBalance() {
    const updateButton = document.querySelector('.exchange__update');
    const svg = updateButton.querySelector('svg');
    
    svg.style.transform = 'rotate(360deg)';
    svg.style.transition = 'transform 0.8s ease-in-out';
    
    setTimeout(() => {
        svg.style.transition = 'none';
        svg.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            svg.style.transition = 'transform 0.8s ease-in-out';
        }, 10);
    }, 800);
    
    loadBalanceData();
}

document.querySelector('.exchange__update').addEventListener('click', function() {
    refreshBalance();
});



async function loadEarningsData() {
    try {
        const response = await fetch('/api/earnings/stake');
        const data = await response.json();
        
        let totalDepositXP = 0;
        
        if (data.success && data.data && data.data.earnings) {
            data.data.earnings.forEach(earning => {
                if (earning.source === 'deposit' || earning.source === 'first_deposit' || earning.source === 'staking_daily') {
                    totalDepositXP += parseFloat(earning.amount);
                }
            });
        }
        
        document.getElementById('totalFarmFromDeposit').textContent = `${totalDepositXP} XP`;
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('totalFarmFromDeposit').textContent = '0 XP';
    }
}

loadEarningsData();





function openExpiredDepositModal(){
	document.querySelector('#expired_deposit').style.display = 'block';
	document.querySelector('#expired_deposit').classList.add('popup_show');
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#success_deposit').classList.remove('popup_show');
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('#success_deposit').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}


function openSuccessDepositModal(){
	document.querySelector('#success_deposit').style.display = 'block';
	document.querySelector('#success_deposit').classList.add('popup_show');
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

function openDepositModal(){
	document.querySelector('#deposit').style.display = 'block';
	document.querySelector('#deposit').classList.add('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

function openNiceModal(){
	document.querySelector('#nice').style.display = 'block';
	document.querySelector('#nice').classList.add('popup_show');
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

function openWaiteModal(){
	document.querySelector('#waite').style.display = 'block';
	document.querySelector('#waite').classList.add('popup_show');
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

function openWithdrawalModal(){
	document.querySelector('#withdrawal').style.display = 'block';
	document.querySelector('#withdrawal').classList.add('popup_show');
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
	loadBalanceData();
}

function closeAllPopups() {
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#success_deposit').classList.remove('popup_show');
	document.querySelector('#expired_deposit').classList.remove('popup_show');
	document.querySelector('#success_withdrow').classList.remove('popup_show');
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('#success_deposit').style.display = 'none';
	document.querySelector('#expired_deposit').style.display = 'none';
	document.querySelector('#success_withdrow').style.display = 'none';
    document.querySelector('#xchecksubscribe').style.display = 'none';
				document.querySelector('#xchecksubscribe').classList.remove('popup_show');
		
				document.querySelector('#xconnect').classList.remove('popup_show');
				document.querySelector('#success_verify').classList.remove('popup_show');
				
			
				document.querySelector('#success_verify').style.display = 'none';
				
	
				document.querySelector('#xconnect').style.display = 'none';
	document.querySelector('html').classList.remove('popup-show');
	document.querySelector('html').classList.remove('lock');
}

function openSuccessWithdrowModal(){
	document.querySelector('#success_withdrow').style.display = 'block';
	document.querySelector('#success_withdrow').classList.add('popup_show');
	document.querySelector('#deposit').classList.remove('popup_show');
	document.querySelector('#waite').classList.remove('popup_show');
	document.querySelector('#nice').classList.remove('popup_show');
	document.querySelector('#withdrawal').classList.remove('popup_show');
	document.querySelector('#deposit').style.display = 'none';
	document.querySelector('#waite').style.display = 'none';
	document.querySelector('#nice').style.display = 'none';
	document.querySelector('#withdrawal').style.display = 'none';
	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

document.querySelector('#deposit .popup__close').addEventListener('click', function() {
	closeAllPopups();
});



document.querySelector('#waite .popup__close').addEventListener('click', function() {
	closeAllPopups();
});

document.querySelector('#withdrawal .popup__close').addEventListener('click', function() {
	closeAllPopups();
});
document.querySelector('#expired_deposit .popup__close').addEventListener('click', function() {
	closeAllPopups();
});





document.querySelector('#success_withdrow').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#success_withdrow .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});


document.querySelector('#expired_deposit').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#expired_deposit .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});


document.querySelector('#success_deposit').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#success_deposit .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});

document.querySelector('#deposit').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#deposit .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});

document.querySelector('#nice').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#nice .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});

document.querySelector('#waite').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#waite .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});

document.querySelector('#withdrawal').addEventListener('click', function(e) {
	const popupContent = document.querySelector('#withdrawal .popup__content');
	if (!popupContent.contains(e.target)) {
		closeAllPopups();
	}
});





document.querySelector('.js-button1').addEventListener('click', async function() {
    const networkSelect = document.getElementById('network');
    const currencySelect = document.getElementById('currency');
    const selectedNetwork = networkSelect.options[networkSelect.selectedIndex].text.toLowerCase();
    const selectedCurrency = currencySelect.options[currencySelect.selectedIndex].text;
    const amountInput = document.querySelector('#deposit .popup__inp');
    const depositAmount = amountInput.value.trim();
    
    clearError(amountInput);
    
    if (!depositAmount) {
        showError(amountInput);
        return;
    }
    
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
        showError(amountInput);
        return;
    }
    
    const minAmounts = {
        'ETH': 0.005,
        'AVAX': 0.5,
        'POL': 50
    };
    
    if (minAmounts[selectedCurrency] && amount < minAmounts[selectedCurrency]) {
        showError(amountInput);
        return;
    }
    
    openWaiteModal();
    
    setTimeout(async () => {
        try {
            const response = await fetch('/api/payment/start-monitoring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    network: selectedNetwork
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.Hash) {
                const monitoringResponse = await fetch(`/api/payment/monitoring/${data.Hash}`);
                const monitoringData = await monitoringResponse.json();
                
                if (monitoringData.success && monitoringData.task) {
                    const task = monitoringData.task;
                    console.log('Task data:', task);
                    
                    const networkInfo = getNetworkInfo(task.network);
                    console.log('Network info:', networkInfo);
                    
                    document.querySelector('#nice .nice-popup__address.address').textContent = task.address;
                    
                    const networkButton = document.querySelector('#nice .set__title');
                    const networkImg = networkButton.querySelector('.select__asset img');
                    const networkText = networkButton.querySelector('.select__text');
                    
                    if (networkImg && networkText) {
                        networkImg.src = networkInfo.icon;
                        networkText.textContent = networkInfo.name;
                    }
                    
                    const amountElement = document.querySelector('#nice .nice-popup__address.amount');
                    amountElement.textContent = `${depositAmount} ${networkInfo.currency}`;
                    
                    const textElement = document.querySelector('#nice .nice-popup__text p:first-child');
                    textElement.textContent = `Send only ${networkInfo.currency} to this address.`;
                    
                    startPaymentTimer(task.EndTime);
                    startMonitoring(data.Hash);
                    
                    openNiceModal();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            closeAllPopups();
        }
    }, 3000);
});

let monitoringInterval;

function startMonitoring(hash) {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }
    
    monitoringInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/payment/monitoring/${hash}`);
            const data = await response.json();
            
            if (data.success && data.status === 'success') {
                clearInterval(monitoringInterval);
                
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
                
                await getStakeBalance();
                loadEarningsData();
				await loadTransactionHistory();
                
                openSuccessDepositModal();
				fetchAndDisplayPoints();
            }
        } catch (error) {
            console.error('Monitoring error:', error);
        }
    }, 10000);
}

function showError(inputElement) {
    inputElement.style.border = '2px solid red';
    inputElement.classList.add('error');
    inputElement.focus();
    
    setTimeout(() => {
        clearError(inputElement);
    }, 3000);
}

function clearError(inputElement) {
    inputElement.style.border = '';
    inputElement.classList.remove('error');
}

document.querySelector('#deposit .popup__inp').addEventListener('input', function() {
    if (this.classList.contains('error')) {
        clearError(this);
    }
});

function getNetworkInfo(networkId) {
    const networkMap = {
        1: { name: 'Ethereum', currency: 'ETH', icon: '../img/icon1.svg' },
        42161: { name: 'Arbitrum', currency: 'ETH', icon: '../img/F20250214013812396t6W3LsvAR4tzev.png' },
        10: { name: 'Optimism', currency: 'ETH', icon: '../img/rsz_optimism.webp' },
        8453: { name: 'Base', currency: 'ETH', icon: '../img/rsz_base.webp' },
        81457: { name: 'Blast', currency: 'ETH', icon: '../img/rsz_blast.webp' },
        80094: { name: 'Berachain', currency: 'ETH', icon: '../img/berachain-icon.png' },
        2741: { name: 'Abstract', currency: 'ETH', icon: '../img/rsz_abstract.webp' },
        137: { name: 'Polygon', currency: 'POL', icon: '../img/rsz_polygon.webp' },
        43114: { name: 'Avalanche', currency: 'AVAX', icon: '../img/rsz_avalanche.webp' }
    };
    
    return networkMap[networkId] || { name: 'Unknown', currency: 'ETH', icon: '../img/icon1.svg' };
}

let timerInterval;

function startPaymentTimer(endTime) {
    const minutesElement = document.querySelector('#nice #minutes');
    const secondsElement = document.querySelector('#nice #seconds');
    
    if (!minutesElement || !secondsElement) {
        console.error('Timer elements not found');
        return;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    console.log('Raw endTime:', endTime);
    
    const endTimeNum = Number(endTime);
    console.log('Converted endTime:', endTimeNum);
    
    if (isNaN(endTimeNum)) {
        console.error('EndTime is not a valid number');
        return;
    }
    
    function updateTimer() {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = endTimeNum - now;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(monitoringInterval);
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            openExpiredDepositModal();
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function clearAllTimers() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
}



const copyBtn2 = document.querySelector(".copy2");
	copyBtn2?.addEventListener("click", () => {
		const text = document.querySelector(".amount")?.textContent?.trim();
		if (text) {
			const numbersOnly = text.replace(/[^\d.]/g, '');
			const tempInput = document.createElement("textarea");
			tempInput.value = numbersOnly;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand("copy");
			document.body.removeChild(tempInput);
			copyBtn2.classList.add("tooltip-visible");
			setTimeout(() => {
				copyBtn2.classList.remove("tooltip-visible");
			}, 1500);
		}
	});


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


    const priceService = new TokenPriceService();
    let currentSymbol = 'ETH';
    let currentWithdrawalSymbol = 'ETH';
    let currentWithdrawalNetwork = '1';
    let debounceTimer;
    let balanceData = null;
    
    const networkMapping = {
        '1': 'ethereum',
        '2': 'arbitrum', 
        '3': 'optimism',
        '4': 'base',
        '5': 'blast',
        '6': 'berachain',
        '7': 'abstract',
        '8': 'polygon',
        '9': 'avalanche'
    };
    
    function isValidEVMAddress(address) {
        if (!address) return false;
        
        const evmAddressPattern = /^0x[a-fA-F0-9]{40}$/;
        return evmAddressPattern.test(address);
    }
    
    async function loadBalanceData() {
        try {
            const response = await fetch('/api/stake/balance');
            const data = await response.json();
            balanceData = data;
            updateWithdrawalBalance();
        } catch (error) {
            console.error('Error loading balance:', error);
            balanceData = null;
            updateWithdrawalBalance();
        }
    }
    
    function getCurrentBalance() {
        if (!balanceData || !balanceData.balances) return 0;
        
        const networkName = networkMapping[currentWithdrawalNetwork];
        const networkBalance = balanceData.balances.find(b => b.network.toLowerCase() === networkName);
        
        if (networkBalance) {
            return parseFloat(networkBalance.amount) || 0;
        }
        return 0;
    }
    
    function updateWithdrawalBalance() {
        const availableSpan = document.querySelector('#withdrawal .popup__value span');
        if (!availableSpan) return;
        
        const balance = getCurrentBalance();
        availableSpan.textContent = `${balance.toFixed(4)} ${currentWithdrawalSymbol}`;
    }
    
    function clearQuantityInput() {
        const quantityInput = document.querySelector('#withdrawal .popup__input[placeholder*="ETH"], #withdrawal .popup__input[placeholder*="POL"], #withdrawal .popup__input[placeholder*="AVAX"]');
        if (quantityInput) {
            quantityInput.value = '';
        }
    }
    
    function showBlockError(inputElement) {
        if (inputElement) {
            let blockElement = null;
            
            if (inputElement.placeholder.includes('EVM wallet address')) {
                blockElement = document.querySelector('#withdrawal .popup__item');
            } else if (inputElement.placeholder.includes('ETH') || inputElement.placeholder.includes('POL') || inputElement.placeholder.includes('AVAX')) {
                blockElement = document.querySelector('#withdrawal .popup__block');
            }
            
            if (blockElement) {
                blockElement.style.borderColor = 'red';
                blockElement.style.borderWidth = '3px';
                blockElement.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
                
                setTimeout(() => {
                    blockElement.style.borderColor = '';
                    blockElement.style.borderWidth = '';
                    blockElement.style.boxShadow = '';
                }, 3000);
            }
        }
    }
    
    async function handleWithdrawal() {
        const quantityInput = document.querySelector('#withdrawal .popup__input[placeholder*="ETH"], #withdrawal .popup__input[placeholder*="POL"], #withdrawal .popup__input[placeholder*="AVAX"]');
        const walletAddressInput = document.querySelector('#withdrawal .popup__input[placeholder*="EVM wallet address"]');
        
        if (!quantityInput || !walletAddressInput) return;
        
        const amount = parseFloat(quantityInput.value) || 0;
        const walletAddress = walletAddressInput.value.trim();
        const availableBalance = getCurrentBalance();
        
        let hasError = false;
        
        if (amount <= 0 || amount > availableBalance) {
            showBlockError(quantityInput);
            hasError = true;
        }
        
        if (!walletAddress || !isValidEVMAddress(walletAddress)) {
            showBlockError(walletAddressInput);
            hasError = true;
        }
        
        if (hasError) return;
        
        try {
            const networkName = networkMapping[currentWithdrawalNetwork];
            
            const response = await fetch('/api/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount.toString(),
                    network: networkName
                })
            });
            
            const data = await response.json();
            
            if (response.ok && !data.error && (data.withdraw_id || data.new_balance !== undefined)) {
                if (data.new_balance !== undefined) {
                    updateBalanceInData(networkName, data.new_balance);
                    updateWithdrawalBalance();
                    updateMainBalanceDisplay();
                    loadWithdrawalHistory();
                }
                closeAllPopups();
                openSuccessWithdrowModal();
            } else {
                showBlockError(quantityInput);
            }
            
        } catch (error) {
            console.error('Withdrawal error:', error);
            showBlockError(quantityInput);
        }
    }
    
    function updateBalanceInData(networkName, newBalance) {
        if (balanceData && balanceData.balances) {
            const balanceIndex = balanceData.balances.findIndex(b => b.network.toLowerCase() === networkName.toLowerCase());
            if (balanceIndex !== -1) {
                balanceData.balances[balanceIndex].amount = newBalance;
            }
        }
    }
    
    function updateMainBalanceDisplay() {
        const balances = { ETH: 0, POL: 0, AVAX: 0 };
        
        if (balanceData && balanceData.balances) {
            balanceData.balances.forEach(balance => {
                const amount = parseFloat(balance.amount);
                const network = balance.network.toLowerCase();
                
                if (amount >= 0.0001) {
                    if (network === 'polygon') {
                        balances.POL += amount;
                    } else if (network === 'avalanche') {
                        balances.AVAX += amount;
                    } else {
                        balances.ETH += amount;
                    }
                }
            });
        }
        
        document.querySelector('.exchange__rowd').innerHTML = `
            <div class="exchange__boxd">
                <img src="../img/icon1.svg" alt="Ethereum" width="25" height="24">
                <div class="exchange__value">${balances.ETH.toFixed(4)} ETH</div>
            </div>
            <div class="exchange__boxd">
                <img src="../img/rsz_polygon.webp" style="border-radius: 50%;" alt="Polygon" width="25" height="24">
                <div class="exchange__value">${balances.POL.toFixed(4)} POL</div>
            </div>
            <div class="exchange__boxd">
                <img src="../img/rsz_avalanche.webp" style="border-radius: 50%;" alt="Avalanche" width="25" height="24">
                <div class="exchange__value">${balances.AVAX.toFixed(4)} AVAX</div>
            </div>
        `;
    }
    
    
    function calculateXP(amount) {
        if (amount >= 10 && amount <= 50) {
            return 25;
        } else if (amount >= 51 && amount <= 100) {
            return 50;
        } else if (amount >= 101 && amount <= 250) {
            return 100;
        } else if (amount >= 251 && amount <= 500) {
            return 200;
        } else if (amount > 500) {
            return Math.floor(amount / 2);
        } else {
            return 0;
        }
    }
    
    async function updateXPDisplay(tokenAmount, symbol) {
        if (!tokenAmount || tokenAmount <= 0) {
            const xpDisplay = document.querySelector('.popup__value span[style*="color"]');
            if (xpDisplay) {
                xpDisplay.textContent = '0 XP';
            }
            return;
        }
    
        try {
            const result = await priceService.getTokenPrice(symbol);
            const usdValue = tokenAmount * result.price;
            const xpAmount = calculateXP(usdValue);
            
            const xpDisplay = document.querySelector('.popup__value span[style*="color"]');
            if (xpDisplay) {
                xpDisplay.textContent = `${xpAmount.toLocaleString()} XP`;
            }
        } catch (error) {
            console.error('Error calculating XP:', error);
            const xpDisplay = document.querySelector('.popup__value span[style*="color"]');
            if (xpDisplay) {
                xpDisplay.textContent = '0 XP';
            }
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const today = new Date();
        const nextWithdrawal = new Date(today);
        nextWithdrawal.setDate(today.getDate() + 30);
        
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const formattedDate = `${months[nextWithdrawal.getMonth()]} ${nextWithdrawal.getDate()}, ${nextWithdrawal.getFullYear()}`;
        
        const withdrawalDateElement = document.querySelector('.popup__desc p');
        if (withdrawalDateElement) {
            withdrawalDateElement.textContent = `Next Withdrawal: ${formattedDate}`;
        }
        
        const networkSelects = document.querySelectorAll('[data-id="2"], [data-id="4"]');
        
        networkSelects.forEach(networkSelect => {
            const networkOptions = networkSelect.querySelectorAll('.select__option');
            
            networkOptions.forEach(option => {
                const value = option.getAttribute('data-value');
                if (value === '8' || value === '9') {
                    option.style.display = 'none';
                    option.setAttribute('hidden', '');
                }
            });
        });
        
        loadBalanceData();
    });
    
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('popup__inp')) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const amount = parseFloat(e.target.value) || 0;
                updateXPDisplay(amount, currentSymbol);
            }, 500);
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.id === 'maxButton') {
            const quantityInput = document.querySelector('#withdrawal .popup__input[placeholder*="ETH"], #withdrawal .popup__input[placeholder*="POL"], #withdrawal .popup__input[placeholder*="AVAX"]');
            if (quantityInput) {
                const balance = getCurrentBalance();
                quantityInput.value = balance.toFixed(3);
            }
            return;
        }
        
        if (e.target.classList.contains('popup__link') && e.target.textContent.trim() === 'Withdrawal') {
            e.preventDefault();
            handleWithdrawal();
            return;
        }
        
        if (e.target.closest('.select__option[data-value]') && (e.target.closest('[data-id="1"]') || e.target.closest('[data-id="3"]'))) {
            const selectedValue = e.target.closest('.select__option').getAttribute('data-value');
            const selectedText = e.target.closest('.select__option').querySelector('.select__text').textContent;
            
            let networkSelect;
            if (e.target.closest('[data-id="1"]')) {
                networkSelect = document.querySelector('[data-id="2"]');
                currentSymbol = selectedText;
                
                const depositInput = document.querySelector('.popup__inp');
                if (depositInput && selectedText === 'ETH') {
                    depositInput.placeholder = 'Minimum: 0.005 ETH';
                } else if (depositInput && selectedText === 'POL') {
                    depositInput.placeholder = 'Minimum: 50 POL';
                } else if (depositInput && selectedText === 'AVAX') {
                    depositInput.placeholder = 'Minimum: 0.5 AVAX';
                }
                
                const currentAmount = parseFloat(depositInput.value) || 0;
                if (currentAmount > 0) {
                    updateXPDisplay(currentAmount, currentSymbol);
                }
                
            } else if (e.target.closest('[data-id="3"]')) {
                networkSelect = document.querySelector('[data-id="4"]');
                currentWithdrawalSymbol = selectedText;
                
                const quantityInput = document.querySelector('#withdrawal .popup__input[placeholder*="ETH"], #withdrawal .popup__input[placeholder*="POL"], #withdrawal .popup__input[placeholder*="AVAX"]');
                const quantityIcon = document.querySelector('#withdrawal .popup__icon img');
                
                if (quantityInput) {
                    quantityInput.placeholder = `0.00 ${selectedText}`;
                }
                if (quantityIcon) {
                    const selectedOption = e.target.closest('.select__option');
                    const assetImg = selectedOption.querySelector('.select__asset img');
                    if (assetImg) {
                        quantityIcon.src = assetImg.src;
                    }
                }
                
                clearQuantityInput();
            }
            
            const networkOptions = networkSelect.querySelectorAll('.select__option');
            const networkScroll = networkSelect.querySelector('.select__scroll');
            
            networkOptions.forEach(option => {
                option.style.display = 'block';
                option.removeAttribute('hidden');
            });
            
            if (selectedText === 'ETH') {
                networkOptions.forEach(option => {
                    const value = option.getAttribute('data-value');
                    if (value === '8' || value === '9') {
                        option.style.display = 'none';
                        option.setAttribute('hidden', '');
                    }
                });
            } else if (selectedText === 'POL') {
                networkOptions.forEach(option => {
                    const value = option.getAttribute('data-value');
                    if (value !== '8') {
                        option.style.display = 'none';
                        option.setAttribute('hidden', '');
                    }
                });
            } else if (selectedText === 'AVAX') {
                networkOptions.forEach(option => {
                    const value = option.getAttribute('data-value');
                    if (value !== '9') {
                        option.style.display = 'none';
                        option.setAttribute('hidden', '');
                    }
                });
            }
            
            const firstVisibleOption = networkSelect.querySelector('.select__option:not([hidden])');
            if (firstVisibleOption) {
                const networkTitle = networkSelect.querySelector('.select__title .select__content');
                const newContent = firstVisibleOption.innerHTML;
                networkTitle.innerHTML = newContent;
                
                const networkSelectElement = networkSelect.querySelector('select');
                networkSelectElement.value = firstVisibleOption.getAttribute('data-value');
                
                if (e.target.closest('[data-id="3"]')) {
                    currentWithdrawalNetwork = firstVisibleOption.getAttribute('data-value');
                    updateWithdrawalBalance();
                }
            }
        }
        
        if (e.target.closest('.select__option[data-value]') && e.target.closest('[data-id="4"]')) {
            const selectedValue = e.target.closest('.select__option').getAttribute('data-value');
            currentWithdrawalNetwork = selectedValue;
            clearQuantityInput();
            updateWithdrawalBalance();
        }
    });
    
    document.addEventListener('change', function(e) {
        if (e.target.id === 'currency') {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const selectedText = selectedOption.textContent;
            currentWithdrawalSymbol = selectedText;
            
            const quantityInput = document.querySelector('#withdrawal .popup__input[placeholder*="ETH"], #withdrawal .popup__input[placeholder*="POL"], #withdrawal .popup__input[placeholder*="AVAX"]');
            const quantityIcon = document.querySelector('#withdrawal .popup__icon img');
            
            if (quantityInput) {
                quantityInput.placeholder = `0.00 ${selectedText}`;
            }
            if (quantityIcon) {
                const assetSrc = selectedOption.getAttribute('data-asset');
                if (assetSrc) {
                    quantityIcon.src = assetSrc;
                }
            }
            
            clearQuantityInput();
            
            const networkSelect = document.querySelector('#network');
            const networkOptions = networkSelect.querySelectorAll('option');
            
            networkOptions.forEach(option => {
                option.style.display = 'block';
                option.removeAttribute('hidden');
            });
            
            if (selectedText === 'ETH') {
                networkOptions.forEach(option => {
                    const value = option.value;
                    if (value === '8' || value === '9') {
                        option.style.display = 'none';
                        option.setAttribute('hidden', '');
                    }
                });
            } else if (selectedText === 'POL') {
                networkOptions.forEach(option => {
                    const value = option.value;
                    if (value !== '8') {
                        option.style.display = 'none';
                        option.setAttribute('hidden', '');
                    }
                });
            } else if (selectedText === 'AVAX') {
                networkOptions.forEach(option => {
                    const value = option.value;
                    if (value !== '9') {
                        option.style.display = 'none';
                        option.setAttribute('hidden', '');
                    }
                });
            }
            
            const firstVisibleOption = networkSelect.querySelector('option:not([hidden])');
            if (firstVisibleOption) {
                networkSelect.value = firstVisibleOption.value;
                currentWithdrawalNetwork = firstVisibleOption.value;
                updateWithdrawalBalance();
            }
        }
        
        if (e.target.id === 'network') {
            currentWithdrawalNetwork = e.target.value;
            clearQuantityInput();
            updateWithdrawalBalance();
        }
    });
    
    
    async function loadPlatformStatistics() {
        try {
            const response = await fetch('/api/platform/statistic');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const stats = data[0];
            
            updateStatistics(stats);
        } catch (error) {
            console.error('Error loading platform statistics:', error);
        }
    }
    
    function formatTVL(num) {
        return `$${num.toFixed(1)}M`;
    }
    
    function formatNetworkTVL(num) {
        if (num >= 1000) {
            return `$${(num / 1000).toFixed(2)}M`;
        } else {
            return `$${Math.round(num)}K`;
        }
    }
    
    function formatActiveStakers(num) {
        return num.toString();
    }
    
    function formatPoints(num) {
        return `${num}K`;
    }
    
    function formatNewDeposits(num) {
        return num.toString();
    }
    
    function formatVolumeToday(num) {
        return `$${Math.round(num)}K`;
    }
    
    function formatPointsEarned(num) {
        return num.toString();
    }
    
    function formatPercentage(num) {
        return `+${num.toFixed(1)}%`;
    }
    
    function updateStatistics(stats) {
        document.querySelector('.widget-exchange__col:nth-child(1) .widget-exchange__value').textContent = formatTVL(stats.TotalValueLocked);
        
        document.querySelector('.widget-exchange__col:nth-child(2) .widget-exchange__value').textContent = formatActiveStakers(stats.ActiveStakers);
        
        document.querySelector('.widget-exchange__col:nth-child(3) .widget-exchange__value').textContent = formatPoints(stats.TodayTotalPoints);
        
        document.querySelector('.widget-exchange__col:nth-child(1) .widget-exchange__label').textContent = formatPercentage(stats.TVLUpPercent);
        
        document.querySelector('.widget-exchange__col:nth-child(2) .widget-exchange__label').textContent = formatPercentage(stats.UsersUpPercent);
        
        document.querySelector('.widget-exchange__row:nth-child(1) .widget-exchange__item').textContent = formatNetworkTVL(stats.EthereumNetworkTVL);
        
        document.querySelector('.widget-exchange__row:nth-child(2) .widget-exchange__item').textContent = formatNetworkTVL(stats.BaseNetworkTVL);
        
        document.querySelector('.widget-exchange__row:nth-child(3) .widget-exchange__item').textContent = formatNetworkTVL(stats.ArbitrumNetworkTVL);
        
        const activityRows = document.querySelectorAll('.widget-exchange__column:nth-child(2) .widget-exchange__row');
        activityRows[0].querySelector('.widget-exchange__item').textContent = formatNewDeposits(stats.NewDepositsToday);
        activityRows[1].querySelector('.widget-exchange__item').textContent = formatVolumeToday(stats.TotalVolumeOfDepositsToday);
        activityRows[2].querySelector('.widget-exchange__item').textContent = formatPointsEarned(stats.PointsFromDepositsToday);
        
        const now = new Date();
        const timeAgo = Math.floor((now.getTime() - stats.UpdatedAt * 1000) / 60000);
        const lastUpdateText = timeAgo < 1 ? 'Just now' : `${timeAgo} min ago`;
       
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        loadPlatformStatistics();
    });

    

    async function loadLastDeposits() {
        try {
            const response = await fetch('/api/lastdeps');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const deposits = data.records.slice(0, 3);
            
            const sortedDeposits = deposits.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return 0;
            });
            
            await updateDepositsTable(sortedDeposits);
        } catch (error) {
            console.error('Error loading last deposits:', error);
        }
    }
    
    function getNetworkConfig(network) {
        const networkMap = {
            'Ethereum': { 
                currency: 'ETH', 
                icon: '../img/icon1.svg' 
            },
            'Arbitrum': { 
                currency: 'ETH', 
                icon: '../img/F20250214013812396t6W3LsvAR4tzev.png' 
            },
            'Optimism': { 
                currency: 'ETH', 
                icon: '../img/rsz_optimism.webp' 
            },
            'Base': { 
                currency: 'ETH', 
                icon: '../img/rsz_base.webp' 
            },
            'Blast': { 
                currency: 'ETH', 
                icon: '../img/rsz_blast.webp' 
            },
            'Berachain': { 
                currency: 'ETH', 
                icon: '../img/berachain-icon.png' 
            },
            'Abstract': { 
                currency: 'ETH', 
                icon: '../img/rsz_abstract.webp' 
            },
            'Polygon': { 
                currency: 'POL', 
                icon: '../img/rsz_polygon.webp' 
            },
            'Avalanche': { 
                currency: 'AVAX', 
                icon: '../img/rsz_avalanche.webp' 
            }
        };
        
        return networkMap[network] || { currency: 'ETH', icon: '../img/icon1.svg' };
    }
    
    function calculateXP(usdAmount) {
        if (usdAmount >= 10 && usdAmount <= 50) {
            return 25;
        } else if (usdAmount >= 51 && usdAmount <= 100) {
            return 50;
        } else if (usdAmount >= 101 && usdAmount <= 250) {
            return 100;
        } else if (usdAmount >= 251 && usdAmount <= 500) {
            return 200;
        } else if (usdAmount > 500) {
            return Math.floor(usdAmount / 2);
        } else {
            return 0;
        }
    }
    
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    async function calculateDepositXP(amount, currency) {
        try {
            const price = await priceService.getTokenPrice(currency);
            const usdValue = amount * price.price;
            return calculateXP(usdValue);
        } catch (error) {
            console.error(`Error calculating XP for ${currency}:`, error);
            return 0;
        }
    }
    
    async function updateDepositsTable(deposits) {
        const exchangeBlocks = document.querySelectorAll('.exchange__block');
        const secondBlock = exchangeBlocks[1];
        const tableInner = secondBlock.querySelector('.table-exchange__inner');
        const existingRows = tableInner.querySelectorAll('.table-exchange__row');
        
        existingRows.forEach(row => row.remove());
        
        for (const deposit of deposits) {
            const networkConfig = getNetworkConfig(deposit.network);
            const amount = parseFloat(deposit.amount);
            const xp = await calculateDepositXP(amount, networkConfig.currency);
            const status = deposit.status === 'pending' ? 'Processing' : 'Confirmed';
            const statusClass = deposit.status === 'pending' ? 'processing-status' : '';
            
            const row = document.createElement('div');
            row.className = 'table-exchange__row';
            
            row.innerHTML = `
                <div class="table-exchange__item">
                    <div class="table-exchange__arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.375 12.8333L12 17M12 17L7.625 12.8333M12 17L12 7" stroke="#0BDF00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="table-exchange__text">Deposit</div>
                </div>
                <div class="table-exchange__item">
                    <div class="table-exchange__icon">
                        <img src="${networkConfig.icon}" alt="${deposit.network}" width="25" height="24">
                    </div>
                    <div class="table-exchange__text">${deposit.network}</div>
                </div>
                <div class="table-exchange__text">${amount.toFixed(4)} ${networkConfig.currency}</div>
                <div class="table-exchange__points">+${xp} XP</div>
                <div class="table-exchange__item">
                    <div class="table-exchange__status ${statusClass}">${status}</div>
                </div>
                <div class="table-exchange__text">${formatDate(deposit.createdAt)}</div>
            `;
            
            tableInner.appendChild(row);
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        loadPlatformStatistics();
        loadLastDeposits();
    });

    



    async function loadTransactionHistory() {
        try {
            const response = await fetch('/api/stake/history');
            const data = await response.json();
            
            if (data.transactions && data.transactions.length > 0) {
                const filteredTransactions = filterValidTransactions(data.transactions);
                const last3Transactions = filteredTransactions.slice(0, 3);
                await renderTransactionHistory(last3Transactions);
            }
        } catch (error) {
            console.error('Error loading transaction history:', error);
        }
    }
    
    function filterValidTransactions(transactions) {
        const minAmounts = {
            'ETH': 0.0005,
            'AVAX': 0.5,
            'POL': 50
        };
        
        return transactions.filter(transaction => {
            if (transaction.type !== 'stake') {
                return false;
            }
            
            const networkInfo = getNetworkInfo(transaction.network);
            const currency = networkInfo.currency;
            const amount = parseFloat(transaction.amount);
            
            if (minAmounts[currency]) {
                return amount >= minAmounts[currency];
            }
            
            return true;
        });
    }
    
    function getNetworkInfo(networkId) {
        const networkMap = {
            1: { name: 'Ethereum', currency: 'ETH', icon: '../img/icon1.svg' },
            42161: { name: 'Arbitrum', currency: 'ETH', icon: '../img/F20250214013812396t6W3LsvAR4tzev.png' },
            10: { name: 'Optimism', currency: 'ETH', icon: '../img/rsz_optimism.webp' },
            8453: { name: 'Base', currency: 'ETH', icon: '../img/rsz_base.webp' },
            81457: { name: 'Blast', currency: 'ETH', icon: '../img/rsz_blast.webp' },
            80094: { name: 'Berachain', currency: 'ETH', icon: '../img/berachain-icon.png' },
            2741: { name: 'Abstract', currency: 'ETH', icon: '../img/rsz_abstract.webp' },
            137: { name: 'Polygon', currency: 'POL', icon: '../img/rsz_polygon.webp' },
            43114: { name: 'Avalanche', currency: 'AVAX', icon: '../img/rsz_avalanche.webp' }
        };
        
        return networkMap[networkId] || { name: 'Unknown', currency: 'ETH', icon: '../img/icon1.svg' };
    }
    
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year}`;
    }
    
    async function calculateXPFromAmount(amount, currency) {
        try {
            const result = await priceService.getTokenPrice(currency);
            const usdValue = parseFloat(amount) * result.price;
            return calculateXP(usdValue);
        } catch (error) {
            console.error('Error calculating XP:', error);
            return 0;
        }
    }
    
    async function renderTransactionHistory(transactions) {
        const tableInner = document.querySelector('.exchange__table .table-exchange__inner');
        const tableTop = tableInner.querySelector('.table-exchange__top');
        
        tableInner.innerHTML = '';
        tableInner.appendChild(tableTop);
        
        for (const transaction of transactions) {
            const networkInfo = getNetworkInfo(transaction.network);
            const formattedDate = formatDate(transaction.createdAt);
            const xp = await calculateXPFromAmount(transaction.amount, networkInfo.currency);
            
            const amount = parseFloat(transaction.amount);
            const transaction_amount = isNaN(amount) ? '0.0000' : amount.toFixed(4);
            
            const row = document.createElement('div');
            row.className = 'table-exchange__row';
            
            row.innerHTML = `
                <div class="table-exchange__item">
                    <div class="table-exchange__arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.375 12.8333L12 17M12 17L7.625 12.8333M12 17L12 7" stroke="#0BDF00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="table-exchange__text">Deposit</div>
                </div>
                <div class="table-exchange__item">
                    <div class="table-exchange__icon">
                        <img src="${networkInfo.icon}" alt="${networkInfo.name}" width="24" height="24">
                    </div>
                    <div class="table-exchange__text">${networkInfo.name}</div>
                </div>
                <div class="table-exchange__text">${transaction_amount} ${networkInfo.currency}</div>
                <div class="table-exchange__points">+${xp} XP</div>
                <div class="table-exchange__item">
                    <div class="table-exchange__status">Confirmed</div>
                </div>
                <div class="table-exchange__text">${formattedDate}</div>
            `;
            
            tableInner.appendChild(row);
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        loadTransactionHistory();
    });
    

    


    const networkIdToToken = {
        1: 'ETH',
        42161: 'ETH',
        10: 'ETH',
        8453: 'ETH',
        81457: 'ETH',
        80094: 'ETH',
        2741: 'ETH',
        137: 'POL',
        43114: 'AVAX'
    };
    
    async function loadWithdrawalHistory() {
        try {
            const response = await fetch('/api/stake/history');
            const data = await response.json();
            
            updateWithdrawalDisplay(data);
            
        } catch (error) {
            console.error('Error loading withdrawal history:', error);
            updateWithdrawalDisplay(null);
        }
    }
    
    async function updateWithdrawalDisplay(data) {
        const withdrawalBalances = { ETH: 0, POL: 0, AVAX: 0 };
        
        if (data && data.transactions) {
            const withdrawalTransactions = data.transactions.filter(tx => tx.type === 'withdraw');
            
            if (withdrawalTransactions.length > 0) {
                withdrawalTransactions.forEach(tx => {
                    const token = networkIdToToken[tx.network];
                    if (token) {
                        const amount = parseFloat(tx.amount) || 0;
                        withdrawalBalances[token] += amount;
                    }
                });
            }
        }
        
        const withdrawalContainers = document.querySelectorAll('.exchange__rowd');
        if (withdrawalContainers.length >= 2) {
            const withdrawalContainer = withdrawalContainers[1];
            withdrawalContainer.innerHTML = `
                <div class="exchange__boxd">
                    <img src="../img/icon1.svg" alt="Ethereum" width="25" height="24">
                    <div class="exchange__value">${withdrawalBalances.ETH.toFixed(4)} ETH</div>
                </div>
                <div class="exchange__boxd">
                    <img src="../img/rsz_polygon.webp" style="border-radius: 50%;" alt="Polygon" width="25" height="24">
                    <div class="exchange__value">${withdrawalBalances.POL.toFixed(4)} POL</div>
                </div>
                <div class="exchange__boxd">
                    <img src="../img/rsz_avalanche.webp" style="border-radius: 50%;" alt="Avalanche" width="25" height="24">
                    <div class="exchange__value">${withdrawalBalances.AVAX.toFixed(4)} AVAX</div>
                </div>
            `;
        }
        
        try {
            const [ethPrice, polPrice, avaxPrice] = await Promise.all([
                priceService.getTokenPrice('ETH'),
                priceService.getTokenPrice('POL'),
                priceService.getTokenPrice('AVAX')
            ]);
            
            const totalUSD = (withdrawalBalances.ETH * ethPrice.price) + 
                            (withdrawalBalances.POL * polPrice.price) + 
                            (withdrawalBalances.AVAX * avaxPrice.price);
            
            const averageElement = document.getElementById('averageWithdrawal');
            if (averageElement) {
                averageElement.textContent = `$${totalUSD.toFixed(2)}`;
            }
            
        } catch (error) {
            console.error('Error getting token prices:', error);
            const averageElement = document.getElementById('averageWithdrawal');
            if (averageElement) {
                averageElement.textContent = '$0.00';
            }
        }
    }
    
    function refreshWithdrawalHistory() {
        const updateButtons = document.querySelectorAll('.exchange__update');
        if (updateButtons.length >= 2) {
            const updateButton = updateButtons[1];
            const svg = updateButton.querySelector('svg');
            
            svg.style.transform = 'rotate(360deg)';
            svg.style.transition = 'transform 0.8s ease-in-out';
            
            setTimeout(() => {
                svg.style.transition = 'none';
                svg.style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    svg.style.transition = 'transform 0.8s ease-in-out';
                }, 10);
            }, 800);
        }
        
        loadWithdrawalHistory();
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.exchange__update')) {
            const updateButtons = document.querySelectorAll('.exchange__update');
            const clickedButton = e.target.closest('.exchange__update');
            
            const buttonIndex = Array.from(updateButtons).indexOf(clickedButton);
            
            if (buttonIndex === 1) {
                refreshWithdrawalHistory();
            }
        }
    });
    
    loadWithdrawalHistory();
    
    
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


    
    
    function disconnectSite() {
    
            
            document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            
            document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
            document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname + ";";
            
            
            localStorage.removeItem('wallet_address');
            sessionStorage.removeItem('session_id');
            
            
   
            
            
            window.location.href = '/index.html';
        }


        function setVerificationIcon(isVerified) {
			console.log(isVerified)
		  const verified = document.getElementById('verified_icon');
		  const notVerified = document.getElementById('not_verified_icon');
		  if (verified) verified.style.display = isVerified ? 'inline' : 'none';
		  if (notVerified) notVerified.style.display = isVerified ? 'none' : 'inline';
		}

        function openXconnectModal(){
            document.querySelector('#xconnect').style.display = 'block';
            document.querySelector('#xconnect').classList.add('popup_show');
            
            document.querySelector('#xchecksubscribe').classList.remove('popup_show');
            document.querySelector('#success_verify').classList.remove('popup_show');
            
        
            document.querySelector('#success_verify').style.display = 'none';
        
            document.querySelector('#xchecksubscribe').style.display = 'none';
        
            document.querySelector('html').classList.add('popup-show');
            document.querySelector('html').classList.add('lock');
        }
        
        function openXchecksubscribeModal(){
            document.querySelector('#xchecksubscribe').style.display = 'block';
            document.querySelector('#xchecksubscribe').classList.add('popup_show');
        
            document.querySelector('#xconnect').classList.remove('popup_show');
            document.querySelector('#success_verify').classList.remove('popup_show');
            
        
            document.querySelector('#success_verify').style.display = 'none';
            
            document.querySelector('#xconnect').style.display = 'none';
        
            document.querySelector('html').classList.add('popup-show');
            document.querySelector('html').classList.add('lock');
        }
        
        function openXverifyModal(){
            document.querySelector('#success_verify').style.display = 'block';
            document.querySelector('#success_verify').classList.add('popup_show');
        
            document.querySelector('#xconnect').classList.remove('popup_show');
            document.querySelector('#xchecksubscribe').style.display = 'none';
            document.querySelector('#xchecksubscribe').classList.remove('popup_show');
            
            document.querySelector('#xconnect').style.display = 'none';
        
            document.querySelector('html').classList.add('popup-show');
            document.querySelector('html').classList.add('lock');
        }
        
        (function(){
            const verifyBtn = document.getElementById('subscribedBtn');
            const twitterInputEl = document.getElementById('twitterInput');
            const errorEl = document.getElementById('error_message');
            let errorTimer = null;

            function showErr(msg){
              if (!errorEl) return;
              errorEl.textContent = msg || 'Verification failed';
              errorEl.style.display = 'block';
              if (errorTimer) clearTimeout(errorTimer);
              errorTimer = setTimeout(()=>{ errorEl.style.display='none'; }, 5000);
            }

            function extractTwitterUsername(input){
              if (!input) return null;
              const s = input.trim();
              const at = s.match(/^@([A-Za-z0-9_]{1,15})$/);
              if (at) return at[1];
              const plain = s.match(/^([A-Za-z0-9_]{1,15})$/);
              if (plain) return plain[1];
              const x = s.match(/^https?:\/\/(?:www\.)?x\.com\/([A-Za-z0-9_]{1,15})/);
              if (x) return x[1];
              const tw = s.match(/^https?:\/\/(?:www\.)?twitter\.com\/([A-Za-z0-9_]{1,15})/);
              if (tw) return tw[1];
              return null;
            }

            async function verifyTwitter(){
              try{
                const link = twitterInputEl ? twitterInputEl.value.trim() : '';
                const username = extractTwitterUsername(link);
                if (!username) throw new Error('Enter a valid X/Twitter handle or link');
                const wallet = localStorage.getItem('wallet_address');
                if (!wallet) throw new Error('Wallet not found. Connect wallet first');
                const headers = { 'Content-Type': 'application/json' };
                const resp = await fetch(`/api/twitter/verify`, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({ wallet, twitterId: username })
                });
                if (!resp.ok) {
                  const txt = await resp.text();
                  throw new Error(`HTTP error! status: ${resp.status} - ${txt}`);
                }
                const data = await resp.json();
                if (data.success === false) {
                  showErr(data.message || 'Verification failed');
                  if (data.error === 'Пользователь не подписан на Twitter') {
                    return false;
                  }
                  return false;
                }
                if (typeof setVerificationIcon === 'function') setVerificationIcon(true);
                if (typeof openXverifyModal === 'function') openXverifyModal();
                fetchAndDisplayPoints();
                return data['success'];
              } catch (error) {
                console.error('Twitter verification failed:', error);
                showErr(error.message || 'Verification failed');
                if (error.message && error.message.includes('Пользователь не подписан на Twitter')) {
                  return false;
                }
                throw error;
              }
            }

            function setLoading(state){
              if (!verifyBtn) return;
              if (state){
                verifyBtn.disabled = true;
                verifyBtn.textContent = 'Verifying...';
              } else {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify';
              }
            }

            if (verifyBtn){
              verifyBtn.addEventListener('click', async ()=>{
                setLoading(true);
                try { await verifyTwitter(); } finally { setLoading(false); }
              });
            }
          })();

          (function(){
					

					
            (async function checkTwitterStatusOnHome(){
                try {
                    const sessionId = getCookie && getCookie('session_id');
                    if (!sessionId) {
                        console.log('not verified');
                        
                        
                        if (typeof setVerificationIcon === 'function') setVerificationIcon(false);
                        return;
                    }
                    const resp = await fetch('/api/twitter/status', {
                        method: 'GET',
                        headers: {
                            'X-Session-ID': sessionId,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!resp.ok) throw new Error('HTTP '+resp.status);
                    const data = await resp.json();
                    if (data && data.hasTwitter === true) {
                        
                        if (typeof setVerificationIcon === 'function') setVerificationIcon(true);
                    } else {
                        
                        console.log("hidden")
                        if (typeof setVerificationIcon === 'function') setVerificationIcon(false);
                    }

                } catch (e) {
                    
                    if (typeof setVerificationIcon === 'function') setVerificationIcon(false);
                }
            })();
        })();



        document.addEventListener('DOMContentLoaded', function () {
			const verifiedIcon = document.getElementById("verified_icon");
			const verifiedNotIcon = document.getElementById("not_verified_icon");
			const accountButton = document.getElementById('accountButton');
		
			let isVerified = false; 
		
			function isMobile() {
				return window.innerWidth < 768;
			}
		
			
			function createMobilePanel() {
				if (document.getElementById('account-fixed-panel')) return;
		
				let panel = document.createElement('div');
				panel.id = 'account-fixed-panel';
		
				let width = isMobile() ? '363px' : (isVerified ? '160px' : '363px');
				let height = isVerified ? '125px' : (isMobile() ? '162px' : '126px');
		
				Object.assign(panel.style, {
					position: 'fixed',
					top: '110px',
					left: '50%',
					transform: 'translateX(-50%)',
					width,
					height,
					background: 'rgba(4,16,40,0.9)',
					border: '1px solid rgba(255,255,255,0.15)',
					backdropFilter: 'blur(4px)',
					borderRadius: '16px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '5px',
					gap: '4px',
					zIndex: '10000',
					boxSizing: 'border-box'
				});
		
				if (!isVerified) {
					panel.innerHTML = `
						<div style="color:#F15D6B; font-weight:500; font-size:16px; display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
							<span style="font-size:18px; margin-right:8px;">&#10006;</span> Not Verified
						</div>
						<button style="width: 90%; background: linear-gradient(90deg, #3122ff, #550fff); color: #fff; font-weight: 500; font-size: 16px; border: none; border-radius: 12px; padding: 12px 0; margin-bottom: 8px; cursor: pointer;"
							onclick="openXconnectModal(); removeMobilePanel();">
							Verification &rarr;
						</button>
						<button style="width: 90%; background: #441013; color: #F15D6B; font-size: 16px; font-weight: 500; border: none; border-radius: 12px; padding: 12px 0; cursor: pointer;"
							onclick="disconnectSite(); removeMobilePanel();">
							Disconnect
						</button>
					`;
				} else {
					panel.innerHTML = `
		  <div style="color:#B7FF2C; font-weight:600; font-size:16px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; padding-top:15px;">
			<span style="font-size:18px; margin-right:7px;">&#10003;</span> Verified
		  </div>
		  <button 
			style="width: 90%; background: #441013; color: #F15D6B; font-size: 15px; font-weight: 500; border: none; border-radius: 12px; padding: 12px 0; cursor: pointer; margin-bottom: 5px; box-sizing: border-box;"
			onclick="disconnectSite(); removeMobilePanel();"
		  >
			Disconnect
		  </button>
		`;
				}
		
				document.body.appendChild(panel);
			}
		
			function removeMobilePanel() {
				let panel = document.getElementById('account-fixed-panel');
				if (panel) panel.remove();
			}
		
			
			function initTippy() {
				if (!accountButton) return;
		
				tippy(accountButton, {
					content: isVerified
						? `
							<div style="
								box-sizing: border-box;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								padding: 5px;
								gap: 4px;
								width: 160px;
								height: 86px;
								background: rgba(4,16,40,0.9);
								border: 1px solid rgba(255,255,255,0.15);
								backdrop-filter: blur(4px);
								border-radius: 16px;
							">
								<div style="color:#B7FF2C;font-weight:600;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
									<span style="font-size:14px;margin-right:6px;">&#10003;</span> Verified
								</div>
								<button style="
									width:90%;
									background:#441013;
									color:#F15D6B;
									font-size:14px;
									font-weight:500;
									border:none;
									border-radius:12px;
									padding:8px 0;
									cursor:pointer;
								" onclick="disconnectSite(); this._tippy.hide();">
									Disconnect
								</button>
							</div>
						`
						: `
							<div style="
								box-sizing: border-box;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								padding: 5px;
								gap: 4px;
								width: 192px;
								height: 126px;
								background: rgba(4,16,40,0.9);
								border: 1px solid rgba(255,255,255,0.15);
								backdrop-filter: blur(4px);
								border-radius: 16px;
							">
								<div style="color:#F15D6B;font-weight:500;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
									<span style="font-size:14px;margin-right:6px;">&#10006;</span> Not Verified
								</div>
								<button style="
									width:90%;
									background:linear-gradient(90deg,#3122ff,#550fff);
									color:#fff;
									font-weight:500;
									font-size:14px;
									border:none;
									border-radius:12px;
									padding:8px 0;
									margin-bottom:6px;
									cursor:pointer;
								" onclick="openXconnectModal(); this._tippy.hide();">
									Verification &rarr;
								</button>
								<button style="
									width:90%;
									background:#441013;
									color:#F15D6B;
									font-size:14px;
									font-weight:500;
									border:none;
									border-radius:12px;
									padding:8px 0;
									cursor:pointer;
								" onclick="disconnectSite(); this._tippy.hide();">
									Disconnect
								</button>
							</div>
						`,
					allowHTML: true,
					theme: 'panel',
					placement: 'bottom-end',
					trigger: 'click',
					interactive: true,
					arrow: false,
					offset: [0, 10],
					onShow(instance) {
						document.querySelectorAll('[data-tippy-root]').forEach(el => {
							if (el._tippy && el._tippy !== instance) {
								el._tippy.hide();
							}
						});
					}
				});
			}
		
			
			function initUI() {
				if (isMobile()) {
					if (accountButton) {
						accountButton.onclick = function () {
							if (document.getElementById('account-fixed-panel')) {
								removeMobilePanel();
							} else {
								createMobilePanel();
							}
						};
					}
				} else {
					initTippy();
				}
			}
		
		
			fetch('/api/twitter/status', {
				method: 'GET',
				headers: {
					'X-Session-ID': sessionId,
					'Content-Type': 'application/json'
				}
			})
				.then(resp => resp.json())
				.then(data => {
					isVerified = !!data.hasTwitter;
					initUI();
				})
				.catch(err => {
					console.error('Ошибка получения статуса:', err);
					isVerified = false;
					initUI();
				});
		
			window.addEventListener('resize', () => {
				removeMobilePanel();
				if (accountButton) accountButton.onclick = null;
				document.querySelectorAll('[data-tippy-root]').forEach(el => {
					if (el._tippy) el._tippy.destroy();
				});
				initUI();
			});
		});
		
		
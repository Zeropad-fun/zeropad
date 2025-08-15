async function getReferralLink() {
    try {
        const response = await fetch('/api/myid');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const userID = data.userID;
        const referralLink = `https://zeropad.fun/?r=${userID}`;
        
        const referralField = document.getElementById('referralLink');
        
        if (referralField) {
            referralField.innerHTML = referralLink;
        }
        
        const shareButton = document.getElementById('shareReferral');
        if (shareButton) {
            const tweetText = `🚀 We're launching a platform for NFT launches through bonding curve! Join us and be part of the revolution!

${referralLink}`;
            
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            
            shareButton.onclick = function() {
                window.open(twitterUrl, '_blank');
            };
        }
        
        return referralLink;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getReferralLink();
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
            if (document.getElementById('totalPoints')) {
                document.getElementById('totalPoints').textContent = data.points;
            }
            if (document.getElementById('totalPoints2')) {
                document.getElementById('totalPoints2').textContent = data.points;
            }
        }
    } catch (error) {
        console.error('Failed to fetch points balance:', error);
    }
}


async function fetchAndDisplayReferrals() {
    try {
        const response = await fetch('/api/referrals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const data = await response.json();
        if (data && data.total) {
            const lvl1 = data.total.level1 || 0;
            const lvl2 = data.total.level2 || 0;
            const lvl3 = data.total.level3 || 0;
            const total = lvl1 + lvl2 + lvl3;
            if (document.getElementById('totalReferrals')) {
                document.getElementById('totalReferrals').textContent = total;
            }
            if (document.getElementById('lvl1')) {
                document.getElementById('lvl1').textContent = lvl1;
            }
            if (document.getElementById('lvl2')) {
                document.getElementById('lvl2').textContent = lvl2;
            }
            if (document.getElementById('lvl3')) {
                document.getElementById('lvl3').textContent = lvl3;
            }
        }
    } catch (error) {
        console.error('Failed to fetch referrals:', error);
    }
}

window.addEventListener('load', async () => {
    await fetchAndDisplayPoints();
    await fetchAndDisplayReferrals();
});





async function loadReferralEarnings() {
    try {
        const response = await fetch('/api/earnings/referral');
        const data = await response.json();
        
        if (data.success && data.data) {
            const todayEarnings = calculateTodayEarnings(data.data.levels);
            updateTodayReferralPoints(todayEarnings);
        }
    } catch (error) {
        console.error('Error loading referral earnings:', error);
    }
}

function calculateTodayEarnings(levels) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    const todayStartTimestamp = Math.floor(todayStart.getTime() / 1000);
    const todayEndTimestamp = Math.floor(todayEnd.getTime() / 1000);
    
    let totalTodayEarnings = 0;
    
    Object.keys(levels).forEach(level => {
        const levelData = levels[level];
        if (levelData.earnings && levelData.earnings.length > 0) {
            levelData.earnings.forEach(earning => {
                if (earning.updatedAt >= todayStartTimestamp && earning.updatedAt <= todayEndTimestamp) {
                    totalTodayEarnings += parseFloat(earning.amount);
                }
            });
        }
    });
    
    return totalTodayEarnings;
}

function updateTodayReferralPoints(earnings) {
    const todayReferralPointsElement = document.getElementById('todayRefferalPoints');
    
    if (todayReferralPointsElement) {
        if (earnings > 0) {
            todayReferralPointsElement.textContent = `+${earnings.toLocaleString()}`;
        } else {
            todayReferralPointsElement.textContent = '0';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadReferralEarnings();
});




async function loadTodayPoints() {
    try {
        const response = await fetch('/api/earnings/today');
        const data = await response.json();
        
        updateTodayPoints(data);
        
    } catch (error) {
        console.error('Error loading today earnings:', error);
        updateTodayPoints(null);
    }
}

function updateTodayPoints(data) {
    let todayTotal = 0;
    
    if (data && data.success && data.data) {
        const referralTotal = parseFloat(data.data.referralEarnings.total) || 0;
        const regularTotal = parseFloat(data.data.regularEarnings.total) || 0;
        
        todayTotal = referralTotal + regularTotal;
        
   
    }
    
    const todayElement = document.getElementById('todayPoints');
    if (todayElement) {
        todayElement.textContent = `${todayTotal}`;
    }
}

loadTodayPoints();





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

function removeMobilePanel() {
    let panel = document.getElementById('account-fixed-panel');
    if (panel) panel.remove();
    document.removeEventListener('mousedown', handleMobilePanelOutsideClick, true);
    document.removeEventListener('touchstart', handleMobilePanelOutsideClick, true);
}
function handleMobilePanelOutsideClick(e) {
    const panel = document.getElementById('account-fixed-panel');
    if (panel && !panel.contains(e.target)) {
        removeMobilePanel();
    }
}


function disconnectSite() {

        
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname + ";";
        
        
        localStorage.removeItem('wallet_address');
        sessionStorage.removeItem('session_id');
        
        
    
        
        
        window.location.href = '/index.html';
    }


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
            setTimeout(() => {
                document.addEventListener('mousedown', handleMobilePanelOutsideClick, true);
                document.addEventListener('touchstart', handleMobilePanelOutsideClick, true);
            }, 0);
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
              if (data.error === 'User is not subscribed to Twitter') {
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
            if (error.message && error.message.includes('User is not subscribed to Twitter')) {
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



      function openXconnectModal(){
        removeMobilePanel();
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
    
    function closeAllPopups() {
        document.querySelector('#xchecksubscribe').style.display = 'none';
        document.querySelector('#xchecksubscribe').classList.remove('popup_show');

        document.querySelector('#xconnect').classList.remove('popup_show');
        document.querySelector('#success_verify').classList.remove('popup_show');
        
    
        document.querySelector('#success_verify').style.display = 'none';
        

        document.querySelector('#xconnect').style.display = 'none';
        
    
        document.querySelector('html').classList.remove('popup-show');
        document.querySelector('html').classList.remove('lock');
    }



    
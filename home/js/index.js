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
        const toast = document.getElementById('toast');
        if (!toast) return;
        const titleEl = toast.querySelector('.toast__title');
        const textEl = toast.querySelector('.toast__text');
        const iconEl = toast.querySelector('.toast__icon img');
        const closeBtn = toast.querySelector('.toast__close, .popup__close');
        let hideTimer = null;

        window.showToast = function({ title, text, icon, timeout = 4000 } = {}){
            if (title) titleEl.textContent = title;
            if (text) textEl.textContent = text;
            if (icon) iconEl.src = icon;
            toast.classList.remove('toast--hidden');
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                toast.classList.add('toast--hidden');
            }, timeout);
        };

    
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toast.classList.add('toast--hidden');
                if (hideTimer) clearTimeout(hideTimer);
            });
        }

        
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.popup__close')) {
                if (typeof openXconnectModal === 'function') openXconnectModal();
                toast.classList.add('toast--hidden');
            }
        });

        
        (async function checkTwitterStatusOnHome(){
            try {
                const sessionId = getCookie && getCookie('session_id');
                if (!sessionId) {
                    console.log('not verified');
                    
                    toast.classList.add('toast--hidden');
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
                    toast.classList.add('toast--hidden');
                    if (typeof setVerificationIcon === 'function') setVerificationIcon(true);
                } else {
                    toast.classList.remove('toast--hidden');
                    console.log("hidden")
                    if (typeof setVerificationIcon === 'function') setVerificationIcon(false);
                }

            } catch (e) {
                toast.classList.remove('toast--hidden');
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

    


    
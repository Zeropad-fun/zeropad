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

        document.querySelector('#Congratulations').style.display = 'none';
        document.querySelector('#Congratulations').classList.remove('popup_show');
        document.querySelector('#crap').classList.remove('popup_show');
        document.querySelector('#Boom').classList.remove('popup_show');

        
        document.querySelector('#crap').style.display = 'none';
        document.querySelector('#Boom').style.display = 'none';

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





    
function openCongrModal(){
	document.querySelector('#Congratulations').style.display = 'block';
	document.querySelector('#Congratulations').classList.add('popup_show');
	document.querySelector('#crap').classList.remove('popup_show');
	document.querySelector('#Boom').classList.remove('popup_show');
	
	document.querySelector('#crap').style.display = 'none';
	document.querySelector('#Boom').style.display = 'none';

	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

function openBoomModal(){
	document.querySelector('#Boom').style.display = 'block';
	document.querySelector('#Boom').classList.add('popup_show');
	document.querySelector('#crap').classList.remove('popup_show');
	document.querySelector('#Congratulations').classList.remove('popup_show');
	
	document.querySelector('#crap').style.display = 'none';
	document.querySelector('#Congratulations').style.display = 'none';

	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
}

function openCrapModal(){
	document.querySelector('#crap').style.display = 'block';
	document.querySelector('#crap').classList.add('popup_show');
	document.querySelector('#Boom').classList.remove('popup_show');
	document.querySelector('#Congratulations').classList.remove('popup_show');
	
	document.querySelector('#Boom').style.display = 'none';
	document.querySelector('#Congratulations').style.display = 'none';

	document.querySelector('html').classList.add('popup-show');
	document.querySelector('html').classList.add('lock');
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


const main = document.getElementById('main');
		

	
		async function getGameInfo() {
			try {
				const response = await fetch('/api/game/info');
				if (!response.ok) throw new Error('Failed to fetch game info');
				return await response.json();
			} catch (error) {
				console.error('Error fetching game info:', error);
				return null;
			}
		}

		async function sendGameWin() {
			try {
				const response = await fetch('/api/game/win', { method: 'POST' });
				if (!response.ok) throw new Error('Failed to send win');
				return await response.json();
			} catch (error) {
				console.error('Error sending win:', error);
				return null;
			}
		}

		async function sendGameLose() {
			try {
				const response = await fetch('/api/game/lose', { method: 'POST' });
				if (!response.ok) throw new Error('Failed to send lose');
				return await response.json();
			} catch (error) {
				console.error('Error sending lose:', error);
				return null;
			}
		}

	
		let gameState = {
			canPlay: false,
			timeLeft: 0,
			countdownTimer: null
		};


		const SPRITES = {
			coin: { src: '/img/coin.png', w: 56, h: 56, score: 1 },
	
			bomb: { src: '/img/bomb.png', w: 56, h: 56, bomb: true },
		};


		const layer = document.createElement('div');
		layer.className = 'mini-game-layer';
		main.appendChild(layer);



		const over = document.createElement('div');
		over.className = 'game-over';
		over.innerHTML = '<div>💥 Game Over<br><button id="mg-restart">Restart</button></div>';
		main.appendChild(over);
		over.addEventListener('click', (e) => {
			const btn = e.target.closest('#mg-restart');
			if (btn) {
				over.classList.remove('show');
				
			}
		});

	

		let running = false;
		let rafId = 0;
		let lastTs = 0;
		let score = 0;
		let missedObjects = 0; 
		const objects = new Set(); 
		let spawnTimer = 0;        

	
		function updateScore(delta) {
			score += delta | 0;

			
			updateGameButton();

		
			if (score >= 20) {
				handleGameWin();
			}
		}

		function updateGameButton() {
			const launchpadLink = document.querySelector('.launchpad__link');
			if (!launchpadLink) return;

			
			if (running) {
				launchpadLink.textContent = `Caught: ${score} Missed: ${missedObjects}/5`;
			}
		}

		async function handleGameWin() {
			running = false;
			cancelAnimationFrame(rafId);
		
			clearAllGameObjects();

			
			const result = await sendGameWin();
			fetchAndDisplayPoints();
		
			
			openCongrModal();

	
			await checkGameAvailability();
		}

		async function handleGameLose(reason = 'lose') {
			running = false;
			cancelAnimationFrame(rafId);
			
			clearAllGameObjects();

	
			const result = await sendGameLose();

			emoji_actual = '💥';
			let message = 'Game over';
			if (reason === 'bomb') {
				openBoomModal();
			} else if (reason === 'missed') {
				openCrapModal();
			}

			
		

	
			await checkGameAvailability();
		}

		function resolveX(x) {
			const w = main.clientWidth;
			if (typeof x === 'string' && x.endsWith('%')) {
				return Math.round(w * (parseFloat(x) / 100));
			}
			if (typeof x === 'number' && x >= 0 && x <= 1) {
				return Math.round(w * x);
			}
			return Math.max(0, Math.min(w, Math.round(Number(x) || 0)));
		}

		function clampXForWidth(x, elWidth) {
			const w = main.clientWidth;
			return Math.max(0, Math.min(w - elWidth, x));
		}

		function removeObject(el) {
			objects.delete(el);
			el.remove();
		}

		
		function clearAllGameObjects() {
			for (const el of [...objects]) {
				removeObject(el);
			}
			objects.clear();
		}

		
		

		function spawnFallingObject({ x = '50%', type = 'coin', speed = 220 } = {}) {
			const spec = SPRITES[type];
			if (!spec) return console.warn('[mini-game] Unknown type:', type);

			const el = document.createElement('div');
			el.className = 'falling';
			el.style.width = (spec.w || 56) + 'px';
			el.style.height = (spec.h || 56) + 'px';

			const img = document.createElement('img');
			img.alt = type;
			img.draggable = false;
			img.src = spec.src;
			el.appendChild(img);

		
			const w = spec.w || 56;
			const left = clampXForWidth(resolveX(x) - Math.floor(w / 2), w);
			el.style.left = left + 'px';
			el.style.top = (- (spec.h || 56)) + 'px';

		
			el.dataset.vy = String(speed); 
			el.dataset.type = type;

		
			el.addEventListener('pointerdown', (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				const t = el.dataset.type;
				const s = SPRITES[t];
				if (s?.bomb) {
				
					removeObject(el);
					handleGameLose('bomb');
					return;
				}
						
				updateScore(s?.score ?? 1);
				
				el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(0)' }], { duration: 180, easing: 'ease-out' });
				setTimeout(() => removeObject(el), 170);
			}, { passive: false });

			layer.appendChild(el);
			objects.add(el);
			return el;
		}


		function loop(ts) {
			if (!running) return;
			if (!lastTs) lastTs = ts;
			const dt = Math.min(0.05, (ts - lastTs) / 1000); 
			lastTs = ts;

		
			const mainH = main.clientHeight;
			for (const el of [...objects]) {
				const vy = parseFloat(el.dataset.vy || '200'); 
				const top = (parseFloat(el.style.top) || 0) + vy * dt;
				el.style.top = top + 'px';
				if (top > mainH) {
				
					const type = el.dataset.type;
					if (type !== 'bomb') {
						missedObjects++;

						
						updateGameButton();

						
						if (missedObjects >= 5) {
							removeObject(el);
							handleGameLose('missed');
							return;
						}
					}
					removeObject(el);
				}
			}

		
			spawnTimer += dt;
			if (spawnTimer >= 0.7) {
				spawnTimer = 0;
				const randX = Math.random(); 
				const isBomb = Math.random() < 0.18; 
				const t = isBomb ? 'bomb' : (Math.random() < 0.5 ? 'coin' : 'gem');
				const v = 180 + Math.random() * 160; 
				spawnFallingObject({ x: randX, type: t, speed: v });
			}

			rafId = requestAnimationFrame(loop);
		}

	
		async function checkGameAvailability() {
			const gameInfo = await getGameInfo();
			if (gameInfo) {
				gameState.canPlay = gameInfo.canPlayThisHour;
				gameState.timeLeft = gameInfo.timeLeft;
				updateGameUI();
						console.log(gameInfo.canPlayThisHour)
			}
		}

		function updateGameUI() {
			const launchpadLink = document.querySelector('.launchpad__link');
			if (!launchpadLink) return;

			if (gameState.canPlay) {
				launchpadLink.textContent = 'Start Farming';
				launchpadLink.style.pointerEvents = 'auto';
				launchpadLink.style.opacity = '1';
				launchpadLink.onclick = () => startGame(true);

				
				if (gameState.countdownTimer) {
					clearInterval(gameState.countdownTimer);
					gameState.countdownTimer = null;
				}
			} else {
				launchpadLink.style.pointerEvents = 'none';
				launchpadLink.style.opacity = '0.6';
				startCountdown();
			}
		}

		function startCountdown() {
			if (!gameState.timeLeft || gameState.timeLeft <= 0) return;

			const launchpadLink = document.querySelector('.launchpad__link');
			if (!launchpadLink) return;

			let remainingTime = gameState.timeLeft; 

			gameState.countdownTimer = setInterval(() => {
				if (remainingTime > 0) {
					const minutes = Math.floor(remainingTime / 60);
					const seconds = remainingTime % 60;

					
					if (minutes > 0) {
						launchpadLink.textContent = `Next game in: ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
					} else {
						launchpadLink.textContent = `Next game in: ${seconds}s`;
					}
					remainingTime--;
				} else {
				
					clearInterval(gameState.countdownTimer);
					gameState.countdownTimer = null;
					checkGameAvailability();
				}
			}, 1000);
		}

		function startGame(reset = false) {
			if (!gameState.canPlay) return;

			if (reset) {
				
				for (const el of [...objects]) removeObject(el);
				score = 0;
				missedObjects = 0;
				spawnTimer = 0;
				over.classList.remove('show');
			}
			if (running) return;
			running = true;
			lastTs = 0;

			
			updateGameButton();

			rafId = requestAnimationFrame(loop);
		}

		function stopGame() {
			running = false;
			cancelAnimationFrame(rafId);

			
			updateGameUI();
		}

		
		window.spawnFallingObject = spawnFallingObject;
		window.startMiniGame = () => startGame(true);
		window.stopMiniGame = stopGame;
		window.setMiniGameSprites = (map) => Object.assign(SPRITES, map);

	
		document.addEventListener('DOMContentLoaded', () => {
			checkGameAvailability();
		});


		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', checkGameAvailability);
		} else {
			checkGameAvailability();
		}



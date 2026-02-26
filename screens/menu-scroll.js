// ==============================================
// MENÚ LATERAL EXCLUSIVO PARA POSTS - CORREGIDO
// ==============================================
(function() {
  // Solo ejecutar en páginas de posts
  var isPostPage = document.querySelector('div.post') !== null || 
                   window.location.pathname.includes('/blog-post') ||
                   document.querySelector('body.item') !== null;
  
  if (!isPostPage) return;
  
  console.log("📄 Activando menú lateral para posts");
  
  var POST_MENU_ID = 'post-side-menu';
  var POST_OVERLAY_ID = 'post-side-menu-overlay';
  
  // Función toggle exclusiva para posts
  window.togglePostSideMenu = function(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    var sideMenu = document.getElementById(POST_MENU_ID);
    var overlay = document.getElementById(POST_OVERLAY_ID);
    
    if (!sideMenu || !overlay) return;
    
    var isOpen = sideMenu.style.right === '0px' || 
                 window.getComputedStyle(sideMenu).right === '0px';
    
    if (isOpen) {
      sideMenu.style.right = '-350px';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    } else {
      sideMenu.style.right = '0px';
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Crear overlay
  if (!document.getElementById(POST_OVERLAY_ID)) {
    var overlay = document.createElement('div');
    overlay.id = POST_OVERLAY_ID;
    overlay.addEventListener('click', function(event) {
      event.stopPropagation();
      window.togglePostSideMenu(event);
    });
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(0,0,0,0.5);z-index:2000;display:none;';
    document.body.appendChild(overlay);
  }
  
  // Crear menú lateral
  if (!document.getElementById(POST_MENU_ID)) {
    var sideMenu = document.createElement('div');
    sideMenu.id = POST_MENU_ID;
    sideMenu.style.cssText = 'position:fixed;top:0;right:-350px;width:280px;height:100vh;background:white;box-shadow:-5px 0 30px rgba(0,0,0,0.2);z-index:2001;transition:right 0.3s ease;padding:20px;display:flex;flex-direction:column;';
    
    sideMenu.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:15px;border-bottom:1px solid #eee;">
        <div style="font-size:20px;font-weight:700;color:#8B4513;">LEGADO AVÍCOLA</div>
        <button onclick="togglePostSideMenu(event)" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">✕</button>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
        <button onclick="window.location.href='/'; event.stopPropagation();" class="side-menu-item" style="display:flex;align-items:center;gap:16px;padding:14px;background:none;border:none;border-radius:8px;cursor:pointer;width:100%;text-align:left;color:#333;">
          <span style="font-size:20px;">🏠</span>
          <span style="font-weight:500;">Inicio</span>
        </button>
        <button onclick="window.location.href='/?section=rooster'; event.stopPropagation();" class="side-menu-item" style="display:flex;align-items:center;gap:16px;padding:14px;background:none;border:none;border-radius:8px;cursor:pointer;width:100%;text-align:left;color:#333;">
          <span style="font-size:20px;">🏆</span>
          <span style="font-weight:500;">Torneos</span>
        </button>
        <button onclick="window.location.href='/?section=publicaciones'; event.stopPropagation();" class="side-menu-item" style="display:flex;align-items:center;gap:16px;padding:14px;background:none;border:none;border-radius:8px;cursor:pointer;width:100%;text-align:left;color:#333;">
          <span style="font-size:20px;">📱</span>
          <span style="font-weight:500;">Publicaciones</span>
        </button>
        <button onclick="window.location.href='/?section=pedigri'; event.stopPropagation();" class="side-menu-item" style="display:flex;align-items:center;gap:16px;padding:14px;background:none;border:none;border-radius:8px;cursor:pointer;width:100%;text-align:left;color:#333;">
          <span style="font-size:20px;">🧬</span>
          <span style="font-weight:500;">Pedigrí</span>
        </button>
      </div>
    `;
    
    document.body.appendChild(sideMenu);
  }
  
  // ===== CORRECCIÓN: SELECCIONAR SOLO EL BOTÓN DEL MENÚ =====
  var navBar = document.getElementById('post-nav-bar');
  if (navBar) {
    // Buscar el último botón (el de las 3 rayitas)
    var allButtons = navBar.querySelectorAll('button');
    var menuButton = allButtons[allButtons.length - 1]; // El último botón es el menú
    
    if (menuButton) {
      console.log("✅ Botón del menú encontrado y configurado");
      menuButton.removeAttribute('onclick');
      menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        window.togglePostSideMenu(event);
      });
    }
  }
})();

// ==============================================
// BOTÓN FLOTANTE SCROLL TO TOP CON PROGRESO
// ==============================================
(function() {
  'use strict';
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollToTop);
  } else {
    initScrollToTop();
  }
  
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    const progressCircle = document.getElementById('progressCircle');
    const arrowPath = document.getElementById('arrowPath');
    
    if (!scrollBtn || !progressCircle || !arrowPath) return;
    
    let isShowing = false;
    
    // Crear el número de porcentaje
    const percentageText = document.createElement('span');
    percentageText.id = 'scroll-percentage';
    percentageText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: bold;
      color: #1976d2;
      pointer-events: none;
      z-index: 10000;
    `;
    scrollBtn.style.position = 'relative';
    scrollBtn.appendChild(percentageText);
    
    // FUNCIONALIDAD: RECARGAR AL MANTENER PRESIONADO
    let pressTimer = null;
    const PRESS_DURATION = 3000; // 3 segundos
    
    function startPressTimer() {
      if (navigator.vibrate) navigator.vibrate(50);
      
      if (pressTimer) clearTimeout(pressTimer);
      
      scrollBtn.style.transform = 'scale(0.9)';
      scrollBtn.style.transition = 'transform 0.2s';
      
      const indicator = document.createElement('div');
      indicator.id = 'press-indicator';
      indicator.style.cssText = `
        position: absolute;
        top: 50%;
        right: 100%;
        transform: translateY(-50%);
        margin-right: 15px;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        white-space: nowrap;
        animation: pulse 1s infinite;
        z-index: 10001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        pointer-events: none;
      `;
      indicator.innerHTML = `Mantén presionado<br><span style="font-weight:bold; color:#ff4444;">${PRESS_DURATION/1000} SEGUNDOS</span><br>para recargar página`;

      scrollBtn.appendChild(indicator);
      
      const progressRing = document.createElement('div');
      progressRing.id = 'press-progress';
      progressRing.style.cssText = `
        position: absolute;
        top: -3px;
        left: -3px;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
        border-radius: 50%;
        border: 5px solid transparent;
        border-top-color: #ff4444;
        border-right-color: #ff4444;
        animation: spin ${PRESS_DURATION/1000}s linear forwards;
        pointer-events: none;
        box-sizing: border-box;
      `;
      scrollBtn.appendChild(progressRing);
      
      pressTimer = setTimeout(() => {
        window.location.reload();
      }, PRESS_DURATION);
    }
    
    function cancelPressTimer() {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
        
        scrollBtn.style.transform = '';
        
        const indicator = document.getElementById('press-indicator');
        const progressRing = document.getElementById('press-progress');
        if (indicator) indicator.remove();
        if (progressRing) progressRing.remove();
      }
    }
    
    scrollBtn.addEventListener('mousedown', startPressTimer);
    scrollBtn.addEventListener('mouseup', cancelPressTimer);
    scrollBtn.addEventListener('mouseleave', cancelPressTimer);
    
    scrollBtn.addEventListener('touchstart', (e) => {
      startPressTimer();
    });
    
    scrollBtn.addEventListener('touchend', (e) => {
      cancelPressTimer();
      if (!pressTimer) {
        simulateScrollClick();
      }
    });
    
    scrollBtn.addEventListener('touchcancel', cancelPressTimer);
    
    function simulateScrollClick() {
      vibrate();
      
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const mainContent = document.getElementById('main-content');
      const container = mainContent || document.documentElement;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        container.scrollHeight
      );
      const winHeight = window.innerHeight;
      const totalScroll = docHeight - winHeight;
      
      if (totalScroll <= 0) return;
      
      const scrolled = (scrollY / totalScroll) * 100;
      const isAtBottom = scrollY >= totalScroll - 10;
      
      if (scrollY <= 10 || (!isAtBottom && scrolled <= 50)) {
        window.scrollTo({ top: docHeight, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    
    // Añadir animaciones CSS
    if (!document.getElementById('press-animations')) {
      const style = document.createElement('style');
      style.id = 'press-animations';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); border-top-color: #ff4444; }
          25% { border-right-color: #ff4444; }
          50% { border-bottom-color: #ff4444; }
          75% { border-left-color: #ff4444; }
          100% { transform: rotate(360deg); border-color: #4CAF50; }
        }
      `;
      document.head.appendChild(style);
    }
    
    function toggleButtonVisibility() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollY > window.innerHeight * 0.02 && !isShowing) {
        scrollBtn.classList.add('show');
        isShowing = true;
      }
      else if (scrollY <= 10 && isShowing) {
        scrollBtn.classList.remove('show');
        isShowing = false;
      }
    }
    
    function updateProgress() {
      const mainContent = document.getElementById('main-content');
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const winHeight = window.innerHeight;
      
      const container = mainContent || document.documentElement;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        container.scrollHeight
      );
      
      const totalScroll = docHeight - winHeight;
      
      if (totalScroll <= 0) {
        progressCircle.style.strokeDashoffset = 100;
        percentageText.textContent = '0%';
        return;
      }
      
      let scrolled = (scrollY / totalScroll) * 100;
      scrolled = Math.min(100, Math.max(0, scrolled));
      const percentage = Math.round(scrolled);
      
      const circumference = 100;
      progressCircle.style.strokeDashoffset = circumference - scrolled;
      
      percentageText.textContent = percentage + '%';
      
      if (percentage >= 80) {
        percentageText.style.color = '#4CAF50';
      } else if (percentage >= 50) {
        percentageText.style.color = '#FF9800';
      } else {
        percentageText.style.color = '#1976d2';
      }
      
      const isAtTop = scrollY <= 10;
      const isAtBottom = scrollY >= totalScroll - 10;
      
      if (isAtTop || (!isAtBottom && scrolled <= 50)) {
        arrowPath.setAttribute('d', 'M10,15 L17,22 L24,15');
        scrollBtn.setAttribute('aria-label', 'Ir al final');
      } else {
        arrowPath.setAttribute('d', 'M10,19 L17,12 L24,19');
        scrollBtn.setAttribute('aria-label', 'Ir al inicio');
      }
    }
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateProgress();
          toggleButtonVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    updateProgress();
    toggleButtonVisibility();
    
    window.updateScrollForCurrentSection = function() {
      updateProgress();
      toggleButtonVisibility();
    };
    
    function vibrate() {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
    
    scrollBtn.addEventListener('click', function() {
      vibrate();
      
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const mainContent = document.getElementById('main-content');
      const container = mainContent || document.documentElement;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        container.scrollHeight
      );
      const winHeight = window.innerHeight;
      const totalScroll = docHeight - winHeight;
      
      if (totalScroll <= 0) return;
      
      const scrolled = (scrollY / totalScroll) * 100;
      const isAtBottom = scrollY >= totalScroll - 10;
      
      if (scrollY <= 10 || (!isAtBottom && scrolled <= 50)) {
        window.scrollTo({ top: docHeight, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    
    window.addEventListener('resize', updateProgress);
  }
})();

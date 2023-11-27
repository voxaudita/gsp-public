const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

//import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  apos.util.widgetPlayers['gspHeader'] = {
    selector: '[data-gsp-header]',
    player: function (el) {
      // set constants
      const test = true;

      const main = document.querySelector('.gsp-page');
      const container = el.querySelector('.container');
      const logo = el.querySelector('.gsp-logo');
      const hamburger = el.querySelector('.hamburger');
      const navContainer = el.querySelector('.navigation');
      const navigation = el.querySelector('nav');
      const navItems = el.querySelectorAll('.nav-item');
      const introOutEvent = new CustomEvent('gspintroout', { detail: { complete: true, }});
      const introInEvent = new CustomEvent('gspintroin', { detail: { complete: true, }});
      const navBg = el.querySelector('.mobile-nav-bg');

      let w = window.innerWidth;
      let h = window.innerHeight;
      let mBounds = main.getBoundingClientRect();
      let activeLogo = logo.getAttribute('data-logo');
      let state = 'init';
      let display = 'none';
      let processedState = null;
      let scrollPos = window.scrollY;
      let totalScrollPerc = scrollPos/mBounds.height;
      let vpScrollPerc = scrollPos/h;
      let navTimer = null;
      let activeNavItem = 0;
      let logoTimer = false;
      let headerBgBack, headerBgFront, footerBgBack, footerBgFront, menuBg;
      let bgYBase = (display === 'desktop') ? 90 : 64;
      let bgYBaseAdd = (display === 'desktop') ? 24 : 16;
      let bgTranslateYStart = 50;
      let menuXPosOpen = 0;

      //const svgDiv = el.querySelector('[data-svg');
      //const svgObj = new SVG().addTo(svgDiv).size(w, 64);



      window.addEventListener('resize', resizeWindow);
      window.addEventListener('updateprimarycolor', adjustPrimaryColor);
      document.addEventListener('scroll', scrollEvents);

      apos.util.onReady(resetDisplay());

      function adjustHeaderBg() {
        //svgObj.size(w,64);
        bgYBase = (display === 'desktop') ? 90 : 64;
        bgYBaseAdd = (display === 'desktop') ? 24 : 16;
        const m = (display === 'desktop') ? 2 : 1.5;

        var p1 = `0,0`;
        var p2 = `${w},0`;
        var p3 = `${w},${bgYBase + bgYBaseAdd}`;
        var p4 = `0,${(bgYBase * m)+bgYBaseAdd}`;
        var points = ``;

        // reposition menu bg poly
        var hamburgerActive = (hamburger.classList.contains('active')) ? true : false;
        var size = (display === 'tablet') ? 250 : w;
        menuXPosOpen = w - size;
        var menuXPos = (hamburgerActive) ? menuXPosOpen : w;

        if (!menuBg) {
          //menuBg = svgObj.rect(size, h).addClass('mbg').transform({translateX: menuXPos});
        }

        //menuBg.size(size,h);
        //menuBg.transform({translateX: menuXPos});

      }
      function fadeLogo() {
        clearTimeout(logoTimer);

        const logotype = logo.getAttribute('data-logo');
        const activeLogo = logo.querySelector('[data-opacity="1"]');
        const desiredLogo = logo.querySelector(`#${logotype}`);

        if (desiredLogo) {
          if (desiredLogo !== activeLogo) {
            if (activeLogo) {
              activeLogo.setAttribute('data-opacity', 0);
            }
            desiredLogo.setAttribute('data-opacity', 1);
          }
        } else {
          if (activeLogo) {
            activeLogo.setAttribute('data-opacity', 0);
          }
        }
      }
      function enableDesktopNavigation() {
        navItems.forEach(item => {
          item.setAttribute('data-opacity', 1);
        });
      }
      function disableDesktopNavigation() {
        navItems.forEach(item => {
          item.setAttribute('data-opacity', 0);
        });
      }
      function hamburgerIn() {
        const val = hamburger.getAttribute('data-opacity');
        if (val == '0') {
          hamburger.setAttribute('data-opacity', 1);
          enableMobileClickEvents();
        }
      }
      function hamburgerOut() {
        const val = hamburger.getAttribute('data-opacity');
        if (val == '1') {
          hamburger.setAttribute('data-opacity', 0);
          disableMobileClickEvents();
        }
      }
      function enableMobileClickEvents() {
        hamburger.addEventListener('click', hamburgerClick);
      }
      function disableMobileClickEvents() {
        hamburger.removeEventListener('click', hamburgerClick);
      }
      function hamburgerClick(e) {
        const isOn = hamburger.classList.contains('active');
        navContainer.classList.toggle('active');
        hamburger.classList.toggle('active');

        if (isOn) {
          hideMobileNav();
        } else {
          if (state === 'top') {
            showMobileNav();
          }
        }
      }
      function showMobileNav() {
        navigation.classList.add('visible');
        navBg.classList.add('visible');
       //menuBg.addClass('visible').animate().transform({translateX: menuXPosOpen});
        navItems.forEach(item => {
          item.setAttribute('data-opacity', 1);
        });
      }
      function hideMobileNav() {
        navigation.classList.remove('visible');
        navBg.classList.remove('visible');
        //menuBg.removeClass('visible').animate().transform({translateX: w});
        navItems.forEach(item => {
          item.setAttribute('data-opacity', 0);
        });
      }
      function navInitFade() {
        //clearTimeout(navTimer);
        var activeItem = navItems[activeNavItem];
        var active = activeItem.classList.contains('active');
        var visible = (activeItem.getAttribute('data-opacity') == '0')? false : true;

        if (active && visible) {
          activeNavItem++;
          if (activeNavItem == navItems.length) {
            activeNavItem = 0;
          }
        }

        if (active) {
          var val = (visible) ? 0 : 1;
          activeItem.setAttribute('data-opacity', val);
        }

        if (!active) {
          activeItem.classList.add('active');
          var previousId = (activeNavItem-1 < 0) ? navItems.length - 1 : activeNavItem - 1;
          var prevActive = navItems[previousId].classList.contains('active');
          if (prevActive) {
            navItems[previousId].classList.remove('active');
          }
        }
      }
      function scrollEvents(e) {
        scrollPos = window.scrollY;
        resetDisplay();
      }

      function resizeWindow(e) {
        w = window.innerWidth;
        h = window.innerHeight;
        resetDisplay();
      }

      function resetDisplay() {
        const classActive = el.classList.contains(display);
        const previousClass = display;

        //debug(w + '-' + h);

        display = (w <= screenWidthA) ? 'mobile' : display;
        display = (w > screenWidthA) ? 'tablet' : display;
        display = (w > screenWidthC) ? 'desktop' : display;

        resetScrollPercentages();
        
        if (classActive && previousClass !== display) {
          el.classList.remove(previousClass);
          el.classList.add(display);

          logo.classList.remove(previousClass);
          logo.classList.add(display);
        }

        if (!classActive) {
          el.classList.add(display);
          logo.classList.add(display);
        }

        adjustHeader();
      }

      function adjustHeader() {
        const testState = `${display}-${state}`;
        var logoType = 'text';
        container.setAttribute('data-display', `${display}-${state}`);
        navContainer.setAttribute('data-navigation', `${display}-${state}`);
        adjustHeaderBg();

        switch(testState) {
          case 'mobile-init':
          case 'tablet-init':
          case 'desktop-init':
            if (processedState !== testState) {
              processedState = testState;
              logo.setAttribute('data-logo', logoType);
              logoTimer = setTimeout(fadeLogo, 500);
              if (navTimer) {
                clearInterval(navTimer);
                navTimer = null;
              }

              navTimer = setInterval(navInitFade, 1500);
            }
            break;
          case 'mobile-top':
            logoType = 'bug';
          case 'tablet-top':
            hamburgerIn();
          case 'desktop-top':
            if (processedState !== testState) {
              processedState = testState;
              if (testState == 'desktop-top') { enableDesktopNavigation(); }
              logo.setAttribute('data-logo', logoType);
              fadeLogo();
              window.dispatchEvent(introOutEvent);
            }
            break;
          case 'mobile-scrolling':
            logoType = 'none';
          case 'tablet-scrolling':
            hamburgerOut();
            if (hamburger.classList.contains('active')) {
                hamburgerClick(null);
            }
          case 'desktop-scrolling':
            if (processedState !== testState) {
              processedState = testState;
              if (testState == 'desktop-scrolling') { disableDesktopNavigation(); }
              clearInterval(navTimer);
              navTimer = null;
              logo.setAttribute('data-logo', logoType);
              fadeLogo();
              window.dispatchEvent(introInEvent);
            }
            break;
          default:
            break;
        }
      }

      function resetScrollPercentages() {
        mBounds = main.getBoundingClientRect();
        totalScrollPerc = scrollPos/mBounds.height;
        vpScrollPerc = scrollPos/h;

        if (state !== 'init' && vpScrollPerc < .1) { state = 'init'; }
        if (state !== 'top' && vpScrollPerc > .9) { state = 'top'; }
        if (state !== 'scrolling' && vpScrollPerc > .5 && vpScrollPerc < .9) { state = 'scrolling'; }
      }

      function adjustPrimaryColor(e) {
        const color = e.detail.color;
        //headerBgBack.animate().attr({fill: color});
        //footerBgBack.animate().attr({fill: color});
      }

      function debug(msg, type = null) {
        if (test) {
          switch (type) {
            case 'error':
            break;
            case 'debug':
              console.debug(msg);
            break;
            default:
              console.log(msg);
            break;
          }
        }
      }
    }
  }
};
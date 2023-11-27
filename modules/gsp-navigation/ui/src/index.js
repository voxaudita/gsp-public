const anime = require('animejs').default;
export default () => {
  apos.util.widgetPlayers['primaryNav'] = {
    selector: '[data-navigation]',
    player: function (el) {
      let w = window.innerWidth;
      let h = window.innerHeight;

      let navIntro = false;
      let navAtTop = false;
      let introInterval = false;
      let ticking = false;
      
      let activeItem = {};
      
      let activeNavItem = 0;
      const hamburger = el.querySelector('.hamburger');
      const navItems = el.querySelectorAll('.nav-item');

      const header = document.querySelector('header.gsp-header');
      const headerWrap = header.querySelector('.gsp-header-wrap');
      const logoText = header.querySelector('svg#text');
      const logoBug = header.querySelector('svg#bug');
      const main = document.querySelector('main');
      const mBounds = main.getBoundingClientRect();

      let scrollPos = window.scrollY;
      let totalScrollPerc = scrollPos/mBounds.height;
      let vpScrollPerc = scrollPos/h;
      /*
      header.addEventListener('animationstart', headerAnimationEvents);
      header.addEventListener('animationiteration', headerAnimationEvents);
      header.addEventListener('animationend', headerAnimationEvents);
      header.addEventListener('animationcancel', headerAnimationEvents);
      */
      document.addEventListener('scroll', scrollEvent);

      const transitionElements = document.querySelectorAll('[data-css-transition]');
      console.log(transitionElements);
      transitionElements.forEach(element => {
        element.addEventListener('transitionrun', transitionResponse);
        element.addEventListener('transitionstart', transitionResponse);
        element.addEventListener('transitionend', transitionResponse);
        
      });

      if (!navIntro && vpScrollPerc <= .25) {
        enterNavIntro();
      }
      



      if (navItems && navItems.length) {
        enableClickActions();
        enableHamburger();
      }

      function scrollEvent(e) {
        scrollPos = window.scrollY;
        totalScrollPerc = scrollPos/mBounds.height;
        vpScrollPerc = scrollPos/h;


        //var adjustNav = checkScrollResponse(.25, 'viewport', navIntro);
        
        if (navIntro && vpScrollPerc >= .25) {
          exitNavIntro();
          //window.requestAnimationFrame(checkScrollAnimation);
        }
        if (!navIntro && vpScrollPerc <= .25) {
          enterNavIntro();
        }

        if (!navAtTop && vpScrollPerc >= .9) {
          transitionLogoIntroOut();
        }
        if (navAtTop && vpScrollPerc <= .9) {
          transitionLogoIntroIn();
        }
        ticking = true;
      }

      function transitionResponse(e) {
        const property = e.propertyName;
        const eventType = e.type;
        const target = e.target;
        const styles = window.getComputedStyle(target);
        const val = styles.getPropertyValue(property);

        switch (property) {
          case 'opacity':
            if (eventType == 'transitionend') {
              console.log(val);
              e.target.style.display = (val > 0) ? 'block' : 'none';
            }
            if (eventType == 'transitionstart') {
              console.log(val);
              e.target.style.display = (val < 1) ? 'block' : 'none';
            } 
              //e.target.style.display = (eventType == 'transitionrun' || eventType == 'transitionstart') ? 'block' : 'none';
            
            break;
          default:
            break;
        }
        //console.log(e);
      }

      function transitionLogoIntroIn() {
        navAtTop = false;
        headerWrap.classList.remove('atTop');
      }

      function transitionLogoIntroOut() {
        navAtTop = true;
        headerWrap.classList.add('atTop');
      }

      function exitNavIntro() {
        navIntro = false;
        navFadeOut();
      }
      function enterNavIntro() {
        navIntro = true;
        el.classList.add('intro');
        introInterval = setTimeout(navFadeIn, 2500);
      }

      function checkScrollAnimation(step) {
        console.log(step);
        ticking = false;
      }

      function headerAnimationEvents(ev) {
        console.log(ev);
      }

      function navFadeIn() {
        clearTimeout(introInterval);
        var activeItem = navItems[activeNavItem];
        activeItem.addEventListener('transitionstart', navIntroTransition);
        //activeItem.addEventListener('transitionend', navIntroTransition);
        //activeItem.addEventListener('transitioncancel', (e) => {});
        activeItem.classList.add('active');
      }

      function navIntroTransition(e) {
        introInterval = setTimeout(navFadeOut, 4000);
        e.target.removeEventListener('transitionend', navIntroTransition);
      }

      function navFadeOut() {
        clearTimeout(introInterval);
        var activeItem = navItems[activeNavItem];
        activeItem.classList.remove('active');

        activeNavItem++;
        if (activeNavItem == navItems.length) {
          activeNavItem = 0;
        }

        if (navIntro) {
          introInterval = setTimeout(navFadeIn, 2500);
        } else {
          el.classList.remove('intro');
        }
      }

      function enableClickActions() {
        for (var i=0; i<navItems.length; i++) {
          navItems[i].addEventListener('click', navClick);
        }
      }

      function enableHamburger() {
        hamburger.addEventListener('click', hamburgerClick);
      }

      function hamburgerClick(e) {
        const button = e.target.closest('.hamburger');
        const navigation = e.target.closest('.navigation');
        navigation.classList.toggle('active');
        button.classList.toggle('active');
      }

      function navClick(e) {
        e.preventDefault();
        const anchor = e.target.closest('a');
        anchor.classList.toggle('active');
      }
    }
  }
}
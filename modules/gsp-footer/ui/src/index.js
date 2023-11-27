const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

//import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  apos.util.widgetPlayers['gspFooter'] = {
    selector: 'footer',
    player: function (el) {
      const copyright = el.querySelector('.copyright');
      const shareLinks = el.querySelector('.share-links');

      window.addEventListener('gspintroout', footerIn);
      window.addEventListener('gspintroin', footerOut);

      var header = document.querySelector('[data-gsp-header] [data-display]');
      var position = header.getAttribute('data-display');
      var activateFlowers = (position === 'mobile-top') ? true : false;
      activateFlowers = (position === 'tablet-top') ? true : activateFlowers;
      activateFlowers = (position === 'desktop-top') ? true : activateFlowers;

      if (activateFlowers) {
        footerIn(null);
      }

      function footerIn(e) {
        copyright.classList.add('visible');
      }
      function footerOut(e) {
        copyright.classList.remove('visible');
      }
    }
  }
}
const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

//import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  apos.util.widgetPlayers['gspArtist'] = {
    selector: '[data-gsp-artist-info]',
    player: function (el) {
      const imgContainer = el.querySelector('.artist-image');
      const imgs = imgContainer.querySelectorAll('img');
      const contentContainer = el.querySelector('.artist-info-content');
      const textPanels = contentContainer.querySelectorAll('.text-panel');
      const observer = new IntersectionObserver(scrollWatcher, { threshold: [.2, .4, .6, .8, 1] })
      
      document.addEventListener('artistintro', artistIntro);

      function artistIntro(e) {
        //imgs[0].setAttribute('data-opacity', 1);
        anime({
          targets: imgs[0],
          translateY: ['5%', '0%'],
          duration: 2000,
          easing: 'easeOutCubic',
          opacity: {
            value: 1,
            duration: 250,
            easing: 'linear'
          }
        });
        textPanels.forEach(textPanel => {
          observer.observe(textPanel);
        });
      }
      function scrollWatcher(entries) {
        console.log(entries);
      }
    }
  }
}
const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;
import { extractColors } from 'extract-colors';

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

export default () => {
  const colors = [];
  let syncColors = true;

  async function getColors(src) {
    let response = false;
    if (!colors.length && syncColors) {
      syncColors = false;
      const options = {
        pixels: 64000,
        distance: 0.22,
        colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
        saturationDistance: 0.2,
        lightnessDistance: 0.2,
        hueDistance: 0.083333333
      }

      const newColors = await extractColors(src, options).catch(console.error);
      if (newColors && newColors.length) {
        newColors.forEach(color => {
          colors.push(color);
        });
        syncColors = true;
      }
    }

    if (colors.length) {
      response = true;
    }
    return response;
  }

  apos.util.widgetPlayers['gspFlowers'] = {
    selector: '[data-flowers]',
    player: function (el) {
      const src = '/images/artwork/buyf/alwaysKeepItFresh.jpg';
      const svgParentContainer = el.getAttribute('data-container');
      const widthConstraint = el.getAttribute('data-constraint-w');
      const heightConstraint = el.getAttribute('data-constraint-h');
      const widthMultiplier = el.getAttribute('data-width-multiplier');
      const heightMultiplier = el.getAttribute('data-height-multiplier');
      const totalFlowers = el.getAttribute('data-flowers');
      const flowerStart = el.getAttribute('data-start');
      const visibility = el.getAttribute('data-visibility');
      const flowerPath = apos.util.assetUrl('/modules/gsp-flowers/svg/flower.svg');
      const flowers = [];

      const parent = (document.querySelector(svgParentContainer)) ? document.querySelector(svgParentContainer) : window;
      let w = 0;
      let h = 0;
      let svgObj;
      let resizer = false;
      let visible = false;

      window.addEventListener('gspintroout', showFlowers);
      window.addEventListener('gspintroin', hideFlowers);

      if (parent === window) {
        w = parent.innerWidth;
        h = parent.innerHeight; 
        window.addEventListener('resize', resizeWindow);
      } else {
        const parentBounds = parent.getBoundingClientRect();
        w = parentBounds.width;
        h = parentBounds.height;
        resizer = new ResizeObserver(resizeParentElement);
        resizer.observe(parent);
      }

      adjustFlowerPositions();

      function showFlowers(e) {
        if (flowers && totalFlowers && !visible) {
          visible = true;
          const svgH = h * heightConstraint;
          var hm = 1;
          for (var f=0; f<totalFlowers; f++) {
            var fheight = svgH * hm;
            var fy = - flowers[f].height();
            flowers[f].animate({duration: 1000, delay: 250*f, ease: '>'}).y(fy);
          }
        }
      }
      function hideFlowers() {
        if (flowers && totalFlowers && visible) {
          visible = false;
          for (var f=0; f<totalFlowers; f++) {
            var fy = 10;
            flowers[f].animate({duration: 1000, ease: '<'}).y(fy);
          }
        }
      }
      function colorFlowers() {

      }

      function adjustFlowerPositions() {
        const svgW = w * widthConstraint;
        const svgH = h * heightConstraint;

        var hm = 1;
        var wm = widthMultiplier;
        var fxa = (flowerStart === 'right') ? svgW : 0;
        var fxb = (fxa) ? 0 : svgW;
        var fy = 0;


        if (!flowers.length) {
          svgObj = new SVG().addTo(el).size(svgW, svgH);
          var colorArr = getColors(src);
          for (var f=0; f<totalFlowers; f++) {
            flowers[f] = svgObj.use('flower', flowerPath).addClass('flower');
            //var path = flowers[f].path('m27.6,68.71c1.22,0,3.47-.22,4.83-1.66,1.87-1.99,1.31-5.49,1.28-5.64l-.02-.1h-.1s-.28-.04-.71-.04c-1.22,0-3.47.22-4.83,1.66-1.87,1.99-1.31,5.49-1.28,5.64l.02.1h.1s.28.04.71.04h0Z');
          }
        }

        svgObj.size(svgW, 1);
        

        if (flowers.length == totalFlowers) {
          for (var f=0; f<totalFlowers; f++) {
            var fheight = svgH * hm;
            var fwidth = fheight * .5;//it's always .5 this is not wm
            var fxs = (f%2)? fxb : fxa;
            var fx = fxs - (fwidth * .5);
            fy = -fheight;

            if (!visible) {
              fy = 10;
            }
    
            flowers[f].move(fx, fy);
            flowers[f].size(fwidth, fheight);
            hm = hm - (hm * heightMultiplier);
            if (fxs ==  fxa) {
              fxa = (flowerStart === 'right') ? fxa - (fwidth * wm) : fxa + (fwidth * wm);
            }
    
            if (fxs == fxb) {
              fxb = (flowerStart === 'right') ? fxb + (fwidth * wm) : fxb - (fwidth * wm);
            }
          }
        }

        var header = document.querySelector('[data-gsp-header] [data-display]');
        var position = header.getAttribute('data-display');
        var activateFlowers = (position === 'mobile-top') ? true : false;
        activateFlowers = (position === 'tablet-top') ? true : activateFlowers;
        activateFlowers = (position === 'desktop-top') ? true : activateFlowers;

        if (activateFlowers) {
          showFlowers(null);
        }
      }
      function resizeWindow(e) {
        w = window.innerWidth;
        h = window.innerHeight
        adjustFlowerPositions();
      }
      function resizeParentElement(entries, observer) {
        console.log(entries);
      }
    }
  }
}
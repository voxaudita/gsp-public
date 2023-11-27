const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

//import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  apos.util.widgetPlayers['gspBorder'] = {
    selector: '[data-gsp-border]',
    player: function (el) {
      let w = window.innerWidth;
      let h = window.innerHeight;

      const borderPosition = el.getAttribute('data-gsp-border');
      const svgObj = new SVG().addTo(el).size(0, 0);
      const yStartPos = 50;
      const dropshadowspacing = 5;
      const translateYStart = 50;

      let visible = false;
      let display = 'none';
      let bgYBase = (display === 'desktop') ? 90 : 64;
      let bgYTall = bgYBase + (h * .02);
      let bgYBaseAdd = (display === 'desktop') ? 24 : 16;
      let multiplier = (display === 'desktop') ? 1.5 : 1.5;
      let svgHieghtAdjustment = 0;
      let scrollPos = window.scrollY;
      let borderBack, borderFront;
      let frameBack, frameFront;
      let scene = document.querySelector('[data-display]').getAttribute('data-display');

      let fp1 = `0,0`;
      let fp2 = `${w},0`;
      let fp3 = `${w},${bgYBase + bgYBaseAdd}`;
      let fp4 = `0,${svgHeight()}`;

      window.addEventListener('resize', resizeWindow);
      //document.addEventListener('scroll', scrollEvents);
      window.addEventListener('gspintroout', fadeBordersIn);
      window.addEventListener('gspintroin', fadeBordersOut);
      window.addEventListener('updateprimarycolor', adjustPrimaryColor);
      //window.addEventListener('newimageinframe', frameNewImage);
      //window.addEventListener('stopframing', resetFrames);
      setDisplay();


      function resetFrames(e) {
        if (frameBack) {
          if (borderPosition === 'bottom') {
            frameBack.animate().plot([[0,h-1], [w,h-1], [w,h], [0,h]]);
          } else {
            frameBack.animate().plot([[0,0], [w,0], [w,1], [0,1]]);
          }
        }

        if (frameFront) {
          if (borderPosition === 'bottom') {
            frameFront.animate().plot([[0,h-1], [w,h-1], [w,h], [0,h]]);
          } else {
            frameFront.animate().plot([[0,0], [w,0], [w,1], [0,1]]);
          }
        }
      }
      function frameNewImage(e) {
        const top = e.detail.top;
        const bottom = e.detail.bottom;
        const bounds = el.getBoundingClientRect();
        if (frameBack) {
          if (borderPosition === 'bottom') {
            frameBack.animate().plot([[0,bottom-bounds.top], [w,bottom-(bounds.top-(bgYBaseAdd*2))], [w, svgHeight()], [0, svgHeight()]]);
          } else {
            frameBack.animate().plot([[0,0], [w,0], [w, top], [0, top-(bgYBaseAdd*2)]]);
          }
        }

        if (frameFront) {
          if (borderPosition === 'bottom') {
            frameFront.animate().plot([[0,bottom-(bounds.top-bgYBaseAdd)], [w,bottom-(bounds.top-(bgYBaseAdd*3))], [w, svgHeight()], [0, svgHeight()]]);
          } else {
            frameFront.animate().plot([[0,0], [w,0], [w, top-bgYBaseAdd], [0, top-(bgYBaseAdd*3)]]);
          }
        }

      }

      function fadeBordersIn(e) {
        if (borderBack && borderFront && !visible) {
          visible = true;
          borderBack.transform({translateY: 0});
          borderFront.transform({translateY: 0});
          svgObj.addClass('depth');
        }
      }
      function fadeBordersOut(e) {
        const yPos = (borderPosition === 'bottom') ? 75 : -75;
        if (borderBack && borderFront && visible) {
          visible = false;
          borderBack.transform({translateY: yPos});
          borderFront.transform({translateY: yPos});
          svgObj.removeClass('depth');
        }
      }
      function adjustPrimaryColor(e) {
        const color = e.detail.color;
        const colors = e.detail.colors;
        borderBack.animate().attr({fill: colors[0]});
        //frameBack.animate().attr({fill: colors[2], opacity: 1});
        //frameFront.animate().attr({fill: colors[1], opacity: .75});
      }
      function screenVariationAdjustment() {
        let response = 0;
        if (w > screenWidthA) {
          if (h < screenWidthA) {
            // horizontal phone device
            response = 25;
          }
        }
        return response;
      }

      function svgHeight(add = 0) {
        const adjustment = add - screenVariationAdjustment();
        const base = (bgYBase * multiplier) + (bgYBaseAdd + adjustment);
        //console.log(bgYBase + ' - ' + multiplier + ' - ' + bgYBaseAdd + ' - ' + adjustment);
        return (borderPosition === 'bottom') ? base : base;
      }

      function getPoints(front = false, str = false) {
        let p1 = `0,0`;
        let p2 = `${w},0`;
        let p3 = `${w},${bgYBase + bgYBaseAdd}`;
        let p4 = `0,${svgHeight()}`;

        if (front) {
          let frontAdjustment = (bgYBase * multiplier) - screenVariationAdjustment();
          p3 = `${w},${bgYBase}`;
          p4 = `0,${frontAdjustment}`;
        }

        if (borderPosition === 'bottom') {
          const fBase = svgHeight(dropshadowspacing)-bgYBase;
          p1 = `${w},${h}`;
          p2 = `0,${h}`;
          p3 = `0,${svgHeight()-(bgYBase + bgYBaseAdd)}`;
          p4 = `${w},0`;
          if (front) {
            let frontAdjustment = (bgYBase * multiplier) - screenVariationAdjustment();
            p3 = `0,${svgHeight() - bgYBase}`;
            p4 = `${w},${bgYBaseAdd}`;
          }
          /*
          p1 = `0,${fBase}`;
          p2 = `${w},${dropshadowspacing}`;
          p3 = `${w},${svgHeight(dropshadowspacing)}`;
          p4 = `0,${svgHeight(dropshadowspacing)}`;
          if (front) {
            let frontAdjustment = (bgYBaseAdd + dropshadowspacing) + screenVariationAdjustment();
            p1 = `0,${fBase+bgYBaseAdd}`;
            p2 = `${w},${screenVariationAdjustment(bgYBaseAdd+dropshadowspacing)}`;
          }
          */
        }

        return (str) ? `${p1} ${p2} ${p3} ${p4}` : [[p1], [p2], [p3], [p4]];
      }

      function sizeBorders() {
        svgObj.size(w, svgHeight());
        let borderClass = '';
        let translateYval = 0;
        let sceneActive = scene.endsWith('-top');

        if (!frameBack) {
          borderClass = (borderPosition === 'bottom') ? 'frame-bottom frame-b' : 'frame-top frame-b';
          //frameBack = svgObj.polygon(getPoints(false, true)).addClass(borderClass).fill('#fff');
        }
        if (!frameFront) {
          borderClass = (borderPosition === 'bottom') ? 'frame-bottom frame-f' : 'frame-top frame-f';
          //frameFront = svgObj.polygon(getPoints(true, true)).addClass(borderClass).fill('#fff');
        }

        if (borderBack) {
          borderBack.plot(getPoints());
        }

        if (!borderBack) {
          translateYval = (borderPosition === 'bottom') ? translateYStart + bgYBaseAdd : - translateYStart - bgYBaseAdd;
          borderClass = (borderPosition === 'bottom') ? 'border-bottom border-b' : 'border-top border-b';
          borderBack = svgObj.polygon(getPoints(false, true)).addClass(borderClass).fill('#fff');
        }

        if (borderFront) {
          borderFront.plot(getPoints(true));
        }

        if (!borderFront) {
          borderClass = (borderPosition === 'bottom') ? 'border-bottom border-f' : 'border-top border-f';
          borderFront = svgObj.polygon(getPoints(true, true)).addClass(borderClass).fill('#fff');
        }

        if (sceneActive && !visible) {
            fadeBordersIn();
        }

      }

      function resizeWindow(e) {
        w = window.innerWidth;
        h = window.innerHeight;
        setDisplay();
      }
      function setDisplay() {
        //reset w/h
        display = (w <= screenWidthA) ? 'phone' : display;
        display = (w > screenWidthA) ? 'tablet' : display;
        display = (w >= screenWidthC) ? 'desktop' : display;

        //update our base math vars
        bgYBase = (display === 'desktop') ? 90 : 64;
        bgYBaseAdd = (display === 'desktop') ? 24 : 16;
        multiplier = (display === 'desktop') ? 1.5 : 1.5;

        sizeBorders();
      }

    }
  }
}
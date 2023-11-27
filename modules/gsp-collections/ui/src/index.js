const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;
//const getPixels = require("get-pixels");
import { extractColors } from 'extract-colors';
import { prominent } from 'color.js';

const screenWidthA = 501;
const screenWidthB = 1024;
const screenWidthC = 1280;

export default () => {
  let primaryColor = false;
  let w = window.innerWidth;
  let h = window.innerHeight;
  let aspectRatio = h/w;
  let touch = (w < screenWidthB) ? true : false;

  window.addEventListener('touchstart', initializeTouch);
  window.addEventListener("resize", windowResize);
  document.addEventListener('scroll', scrollEvent);

  function scrollEvent(e) {

  }

  function windowResize(e) {
    w = window.innerWidth;
    h = window.innerHeight;
  }

  function hitTest(element, coords) {
    var response = false;
    if (element) {
      var bounds = element.getBoundingClientRect();
      var middle = [(bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2];
      var size = [middle[0] - bounds.left, middle[1] - bounds.top];

      var dx = Math.abs(coords[0] - middle[0]);
      var dy = Math.abs(coords[1] - middle[1]);

      response = (dx / size[0] + dy / size[1] <= 1);
    }
    return response;
  }
  
  async function setImgColor(src, num = 1) {
    const options = {
      pixels: 64000,
      distance: 0.22,
      colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333
    }
    const colors = await extractColors(src, options).catch(console.error);

    //const colors = await prominent(src, {amount: num, format: 'hex'});
    ///primaryColor = await prominent(src, {amount: 1, format: 'hex'});
    const event = new CustomEvent('updatecolors', {
      detail: {
        color: colors[0].hex,
        colors: colors,
      }
    });
    window.dispatchEvent(event);
  }

  function initializeTouch(e) {
    touch = true;
    window.removeEventListener('touchstart', initializeTouch);
  }


  apos.util.widgetPlayers['collectionMenu'] = {
    selector: '[data-collection-menu]',
    player: function (el) {
      const hbb = document.querySelector('.hbb');
      const section = el.closest('section');
      const totalCollections = el.getAttribute('data-total-collections');
      const menus = el.querySelectorAll('.collection-menu-item');
      const menuContainer = el.querySelector('.collection-menu-container');
      const titleContainer = el.querySelector('.collection-titles');
      const seriesContainer = el.querySelector('.series-display');
      const intersectY = .75;
      const btnSize = 48;
      const mobileBackButton = section.querySelector('.collection-back-btn');


      let activeSeries = false;
      let screen = (w > screenWidthA) ? 'tablet' : 'phone'; 
      screen = (w > screenWidthC) ? 'desktop' : screen;
      let bgYBase = (screen === 'desktop') ? 90 : 64;
      let bgYBaseAdd = (screen === 'desktop') ? 24 : 16;
      const m = (screen === 'desktop') ? 2 : 1.5;
      let seriesMask, imgMask;

      let imgColor = false;
      let collectionTitleStr = 'Bring Us Your Flowers';

      window.addEventListener('updatecolors', updateColors);
      document.addEventListener('enablesection', addFunctionality);
      document.addEventListener('disablesection', removeFunctionality);

      document.addEventListener('scroll', artworkScrollEvent);
      document.addEventListener('collectionsintro', collectionMenuIntro);
      document.addEventListener('collectionsreset', collectionMenuReset);

      let imgObserver = new IntersectionObserver(imageWatcher, { threshold: [.25, .6] })
      let observer = new IntersectionObserver(observerCallback, { threshold: intersectY })
      observer.observe(el);

      if (aspectRatio < .65) {
        buildSeriesMask();
      }

      sizeMenu();

      function buildSeriesMask() {
        seriesMask = new SVG().addTo(el);
        imgMask = seriesMask.clip().attr('id', 'series-mask');
        imgMask.circle(w);
      }

      function sizeMenu() {
        //const headerBounds = hbb.getClientRects();
        if (w > screenWidthA) {
          const menuItemSize = w/totalCollections;
          anime({
            targets: menus,
            width: menuItemSize,
            duration: 500,
            easing: 'easeInOutQuad',
          });
        }
        if (w <= screenWidthA) {
          //const yPos = (bgYBase * m) + bgYBaseAdd;
        }
      }

      function updateColors(e) {
        const colors = e.detail.colors;
        const buttonBg = mobileBackButton.querySelector('span');
        anime({
          targets: [activeSeries, buttonBg],
          easing: 'easeInOutQuad',
          duration: 500,
          background: colors[0].hex,
        });
      }

      function collectionMenuReset(e) {
        if (touch) {
          menus.forEach(menu => {
            menu.style.opacity = 0;
          });
        }

        if (!touch) {
          document.removeEventListener('pointermove', menuHoverAction);
        }
      }

      function addFunctionality(e) {
        const s = e.detail.section;
        if (s === section) {
          document.addEventListener('click', menuClickAction);
        }
      }
      function removeFunctionality(e) {
        const s = e.detail.section;
        if (s === section) {
          document.removeEventListener('click', menuClickAction);
        }
      }

      function collectionMenuIntro(e) {
        console.log('called');
        //el.classList.add('sticky');
        if (touch) {
          //console.log('added');
          //document.addEventListener('click', menuClickAction);
          anime({
            targets: menus,
            opacity: 1,
            duration: 500,
            delay: anime.stagger(100),
            easing: 'easeInOutQuad',
            complete: function(anim) {
              const event = new CustomEvent('gsptransitioncomplete');
              window.dispatchEvent(event);
            }
          });
        }

        if (!touch) {
          console.log('called');
          document.addEventListener('pointermove', menuHoverAction);
        }
      }

      function backToCollectionList(e) {
        console.log(e);
      }

      function collectionMenuExit() {
        //el.classList.remove('sticky');
        //console.log('exit');
      }

      function menuClickAction(e) {
        const coords = [e.clientX, e.clientY];
        let hit = false;
        if (!activeSeries) {
          var breakout = false;
          menus.forEach(menu => {
            const active = menu.classList.contains('active');
            const id = menu.getAttribute('data-collection-id');
            const title = titleContainer.querySelector('[data-collection-id="'+id+'"]');
            hit = (hitTest(menu, coords)) ? true : hitTest(title, coords);

            if (hit && !active && !breakout) {
              activeSeries = seriesContainer.querySelector('[data-collection-id="'+ id +'"');
              const scroll = new CustomEvent('setscrollposition', {detail: {section: section, locksections: true}});
              window.dispatchEvent(scroll);
              menu.classList.add('active');
              showSeries(id);
              breakout = true;
            }
          });
        }

        
        if (mobileBackButton.getAttribute('data-opacity') == '1') {
          if (hitTest(mobileBackButton, coords)) {
            hideSeries();
          }
        }
        
      }

      function hideSeries() {
        console.log('called');
        const unlock = new CustomEvent('unlocksections');
        const activeMenu = menuContainer.querySelector('.active');
        activeMenu.classList.remove('active');
        activeSeries.classList.remove('active');
        mobileBackButton.setAttribute('data-opacity', 0);
        anime({
          targets: mobileBackButton,
          delay: 1000,
          duration: 100,
          top: h,
          left: w,
        }); 
        activeSeries = false;
        imgObserver.disconnect();
        
        window.dispatchEvent(unlock);

        //var event = new CustomEvent('stopframing', { detail: { disable: true }});
        //window.dispatchEvent(event);
      }

      function showSeries(id) {
        activeSeries = seriesContainer.querySelector('[data-collection-id="'+ id +'"]');
        activeSeries.classList.add('active');

        //const event = new CustomEvent('gsptransitionsactive');
        //window.dispatchEvent(event);
          
        const sImages = activeSeries.querySelectorAll('img');
        let containerWidth = 0;
        sImages.forEach(image => {
          const bounds = image.getBoundingClientRect();
          const iWidth = bounds.width;
          containerWidth += iWidth;
        });

        const totalImages = sImages.length;
        containerWidth = totalImages * w;
        const sectionWidth = containerWidth;
          
        //section.style.height = sectionHeight + 'px';
        activeSeries.style.width = sectionWidth + 'px';

        sImages.forEach(image => {
          imgObserver.observe(image);
        });

        let opacitySetting = mobileBackButton
        if (mobileBackButton.getAttribute('data-opacity') == '0') {
          var hamburger = document.querySelector('.hamburger');
          var hrect = hamburger.getBoundingClientRect();
          mobileBackButton.style.left = hrect.x + 'px';
          mobileBackButton.style.top = hrect.y + 'px';
          mobileBackButton.setAttribute('data-opacity', 1);
        }
      }

      function imageWatcher(entries) {
        if (entries.length) {
          entries.forEach(entry => {
            if (entry.intersectionRatio > .6) {
              //console.log(entry);
              var bounds = entry.target.getBoundingClientRect();
              var src = entry.target.getAttribute('src');
              setImgColor(src, 3);
              var event = new CustomEvent('newimageinframe', { detail: { top: bounds.top, bottom: bounds.bottom }});
              window.dispatchEvent(event);
            }
          });
        }
      }

      function artworkScrollEvent(e) {
        if (activeSeries) {
          const bounds = activeSeries.getBoundingClientRect();
          //console.log(bounds);
        }
      }

      function menuHoverAction(e) {
        const coords = [e.clientX, e.clientY];
        console.log(e);
        menus.forEach(menu => {
          const hover = menu.classList.contains('hover');
          const id = menu.getAttribute('data-collection-id');
          const title = titleContainer.querySelector('[data-collection-id="'+id+'"]');
          const hit = hitTest(menu, coords);
          if (hit && !hover) {
            menu.classList.add('hover');
            title.classList.add('hover');

            var src = menu.querySelector('img').getAttribute('src');
            setImgColor(src);
            const expandedSize = (w/totalCollections)*3;
            anime({
              targets: menu,
              width: expandedSize,
              x: 0,
              duration: 500,
              easing: 'easeInOutQuad'
            });
          }

          if (!hit && hover) {
            menu.classList.remove('hover');
            title.classList.remove('hover');
            const collapsedSize = w/totalCollections;
            anime({
              targets: menu,
              width: collapsedSize,
              x: 0,
              duration: 500,
              easing: 'easeInOutQuad'
            });
          }
        });
      }

      function observerCallback(entries) {
        if (entries.length) {
          const section = entries[0];
          if (section.intersectionRatio >= intersectY && section.isIntersecting ) {
            //collectionMenuIntro();
          }
          if (section.intersectionRatio <= intersectY && !section.isIntersecting) {
            //collectionMenuExit();
          }
        }
      }
    }
  },
  apos.util.widgetPlayers['collections'] = {
    selector: '[data-all-collections]',
    player: function (el) {

    }
  }
}
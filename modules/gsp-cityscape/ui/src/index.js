const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;

const screenWidthA = 500;
const screenWidthB = 1024;
const screenWidthC = 1280;

//import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let yTop = 0;
  let yBtm = 0;
  let ready = false;
  const minDocWidth = screenWidthB
  const minAspect = .75;
  let minimumWidth = (w >= minDocWidth) ? true : false;
  let minimumAspect = (h/w > minAspect) ? true : false;
  let visibility = (minimumWidth && minimumAspect) ? true : false;
  const borderTop = document.querySelector('[data-gsp-border="top"]');
  const borderBtm = document.querySelector('[data-gsp-border="bottom"]');
  const cityIntro = new CustomEvent('cityintro', { detail: { complete: true, }});
  const cityOutro = new CustomEvent('cityoutro', { detail: { complete: true, }});

  window.addEventListener('resize', resizeWindow);
  window.addEventListener('scroll', scrollCallback);
  window.addEventListener('gspintroout', triggerIntro);
  window.addEventListener('gspintroin', triggerOutro);

  function triggerIntro(e) {
    ready = true;
    if (minimumWidth) { document.dispatchEvent(cityIntro); }
  }
  function triggerOutro(e) {
    ready = false;
    if (minimumWidth) { document.dispatchEvent(cityOutro); }
  }

  function resizeWindow(e) {
    w = window.innerWidth;
    h = window.innerHeight;
    minimumWidth = (w >= minDocWidth) ? true : false;
    minimumAspect = (h/w > .65) ? true : false;
    visibility = (minimumWidth && minimumAspect) ? true : false;
    const resizeEvent = new CustomEvent('cityresize', { detail: { enable: visibility, }});
    document.dispatchEvent(resizeEvent);
  }
  function scrollCallback(e) {
    //const bounds = document.querySelector('body').getBoundingClientRect();
    //console.log('ScrollY: ' + window.scrollY + ' - Total Height: ' + bounds.height + ' - Perc %: ' + window.scrollY/bounds.height); 
    //console.log(bounds);
  }

  function getY(btop = true, bback = true, slong = true) {
    let response = 0;
    const border = (btop) ? borderTop : borderBtm;
    const frame = (bback) ? border.querySelector('.border-b') : border.querySelector('.border-f');
    const bounds = frame.getBoundingClientRect();

    response = (slong && btop) ? bounds.height : frame.getAttribute('points').split(",");
    
    if (Array.isArray(response)) {
      console.log(response);
      //let keyVal = response[2].split(",");//it's always the third key (2) for the short side regarless of top/btm.
      let keyVal = response[4];
      
      //console.log(response);
      //console.log(bounds);
      //console.log(h);
      response = (btop) ? Number(keyVal) : bounds.y + Number(keyVal);
      console.log(response);
    }

    return response;
  }
  apos.util.widgetPlayers['gspCity'] = {
    selector: '[data-gsp-city]',
    player: function(el) {
      document.addEventListener('cityresize', resizeMe);
      if (ready && visibility) { 
        enableMe();
      }

      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { enableMe(); } else { disableMe(); }
      }

      function enableMe() {
        el.setAttribute('data-gsp-city-active', true);
      }
      function disableMe() {
        el.setAttribute('data-gsp-city-active', false);
      }
    }
  },
  apos.util.widgetPlayers['gspCityBackdrop'] = {
    selector: '[data-gspcity-0]',
    player: function (el) {
      const backgroundA = el.querySelector('[data-gspcity-bga');
      const backgroundB = el.querySelector('[data-gspcity-bgb');
      const backgrounds = el.querySelectorAll('.city-layer');
      document.addEventListener('cityresize', resizeMe);

      if (ready && visibility) { enableMe(); }

      function enableMe() {
        document.addEventListener('cityintro', showBuildings);
        document.addEventListener('cityoutro', hideBuildings);
        if (ready && visibility) {
          showBuildings(null);
        }
      }
      function disableMe() {
        hideBuildings(null);
        document.removeEventListener('cityintro', showBuildings);
        document.removeEventListener('cityoutro', hideBuildings);
      }
      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { enableMe(); } else { disableMe(); }
      }

      function showBuildings(e) {
        backgrounds.forEach(background => {
          background.setAttribute('data-opacity', 1);
        });
      }
      function hideBuildings(e) {
        backgrounds.forEach(background => {
          background.setAttribute('data-opacity', 0);
        });
      }
    }
  },
  apos.util.widgetPlayers['gspCityFront'] = {
    selector: '[data-gspcity-front]',
    player: function (el) {
      document.addEventListener('cityresize', resizeMe);
      if (ready && visibility) { enableMe(); }

      function enableMe() {
        document.addEventListener('cityintro', showBuildings);
        document.addEventListener('cityoutro', hideBuildings);
        if (ready && visibility) {
          showBuildings(null);
        }
      }
      function disableMe() {
        hideBuildings(null);
        document.removeEventListener('cityintro', showBuildings);
        document.removeEventListener('cityoutro', hideBuildings);
      }
      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { enableMe(); } else { disableMe(); }
      }

      function showBuildings(e) {
        el.classList.add('visible');
      }
      function hideBuildings(e) {
        el.classList.remove('visible');
      }
    }
  },
  apos.util.widgetPlayers['gspCityClouds'] = {
    selector: '[data-gspcity-clouds]',
    player: function (el) {
      let cloudAnimation = [];
      const cloudsPerLat = el.getAttribute('data-max-clouds-per-lat');
      const totalLat = el.getAttribute('data-total-lat');
      const cloudPath = apos.util.assetUrl('/modules/gsp-cityscape/svg/cloud.svg');
      const cloudLines = [];

      document.addEventListener('cityresize', resizeMe);
      if (ready && visibility) { enableMe(); }

      function enableMe() {
        document.addEventListener('cityintro', showClouds);
        document.addEventListener('cityoutro', hideClouds);
        if (ready && visibility) {
          showClouds(null);
        }
      }
      function disableMe() {
        hideClouds(null);
        document.removeEventListener('cityintro', showClouds);
        document.removeEventListener('cityoutro', hideClouds);
      }
      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { 
          enableMe();
          adjustCloudPositions(e);
        } else { 
          disableMe(); }
      }

      function adjustCloudPositions(e) {
        if (cloudLines.length) {
          cloudAnimation.forEach(cloudObj => {
            cloudObj.animation.pause();
            cloudObj.animation.remove(cloudObj.target);
          });
          cloudAnimation = [];
          generateClouds();
          animateClouds();
        }
      }

      function animateClouds(){
        if (!cloudAnimation.length) {
          const cloudSvgs = el.querySelectorAll('svg');
          const totalcs = cloudSvgs.length;
          const durationInc = 10000;
          //const delayInc = 500;
          let cDuration = 120000 + (durationInc * totalcs);
          //let cDelay = 0;
          cloudSvgs.forEach(cloudSet =>{
            cloudAnimation.push(
              {
                animation: anime({
                  targets: cloudSet,
                  left: [-w, w],
                  loop: true,
                  duration: cDuration,
                  delay: 0,
                  easing: 'linear'
                }),
                target: cloudSet,
              }
            );

            cDuration -= durationInc;
            //cDelay += delayInc;
          });
        } else {
          cloudAnimation.forEach(cloudObj => {
            cloudObj.animation.play();
          });
        }
      }

      function showClouds(e) {
        //console.log(e);
        el.setAttribute('data-opacity', 1);
        el.classList.add('visible');

        if (!cloudLines.length) {
          generateClouds();
        }
        animateClouds();
      }
      function hideClouds(e) {
        if (cloudLines.length) {
          el.setAttribute('data-opacity', 0);
          el.classList.remove('visible');
          if (cloudAnimation.length) {
            cloudAnimation.forEach(cloudObj => {
              cloudObj.animation.pause();
            });
          }
        }
      }

      function generateClouds() {
        const create = (cloudLines.length != totalLat) ? true : false;
        const cloudMaxW = w*.11;
        const cloudMaxH = h*.11;
        const cmwinc = cloudMaxW/totalLat;
        const cmhinc = cloudMaxH/totalLat;
        var cw = cmwinc;
        var ch = cmhinc;
        var ypn = 0;
        var ypp = 0;
        var yinc = h*.05;
        for (var l=0; l<totalLat; l++) {
          const oe = (l%2) ? 'even' : 'odd';
          ypn = (oe === 'odd')? ypn - yinc : ypn;
          ypp = (oe === 'even')? ypp + yinc : ypp;
          const yp = (oe === 'odd') ? ypn : ypp;
          const multiplier = (l+1) * Math.random();
          const latSvg = (create) ? new SVG().addTo(el).size(w, 1).move(0, yp).addClass('cloud-line cloud-' + oe) : cloudLines[l];
          latSvg.clear();
          let clouds = [];
            
          const totalClouds = Math.floor(Math.random() * (cloudsPerLat - 1) + 1);
          const cloudDiv = w/totalClouds;
          var xp = w * Math.random(0, w-cw);
          for (var c=0; c<totalClouds; c++) {
            const xmin = cloudDiv * c;
            const xmax = xmin + cloudDiv;
            const xp = Math.random() * (xmax - xmin) + xmin;
            clouds[c] = latSvg.use('cloud', cloudPath).size(cw, ch).center(xp, yp).addClass('cloud foreground horizon-' + l);
          }

          cw += cmwinc;
          ch += cmhinc;
          cloudLines[l] = latSvg;
        }
      }
    }
  },
  apos.util.widgetPlayers['gspCityTrees'] = {
    selector: '[data-gspcity-trees]',
    player: function (el) {
      document.addEventListener('cityresize', resizeMe);
      if (ready && visibility) { enableMe(); }

      function enableMe() {
        document.addEventListener('cityintro', showTrees);
        document.addEventListener('cityoutro', hideTrees);
        if (ready && visibility) {
          showTrees(null);
        }
      }
      function disableMe() {
        hideTrees(null);
        document.removeEventListener('cityintro', showTrees);
        document.removeEventListener('cityoutro', hideTrees);
      }
      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { enableMe(); } else { disableMe(); }
      }

      function showTrees(e) {
        el.classList.add('visible');
      }
      function hideTrees(e) {
        el.classList.remove('visible');
      }
    }
  },
  apos.util.widgetPlayers['gspCityBuildings'] = {
    selector: '[data-gspcity-buildings]',
    player: function (el) {
      const cityId = el.getAttribute('data-building-layer');
      const filename = 'city-' + cityId;
      document.addEventListener('cityresize', resizeMe);
      if (ready && visibility) { enableMe(); }

      function enableMe() {
        document.addEventListener('cityintro', showMe);
        document.addEventListener('cityoutro', hideMe);
        if (ready && visibility) {
          showMe(null);
        }
      }
      function disableMe() {
        hideMe(null);
        document.removeEventListener('cityintro', showMe);
        document.removeEventListener('cityoutro', hideMe);
      }
      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { enableMe(); } else { disableMe(); }
      }

      function showMe(e) {
        el.classList.add('visible');
      }
      function hideMe(e) {
        el.classList.remove('visible');
      }


    }
  },
  apos.util.widgetPlayers['gspCityBridges'] = {
    selector: '[data-gspcity-bridges]',
    player: function (el) {
      const bridgePath = apos.util.assetUrl('/modules/gsp-cityscape/svg/bridge-left.svg');
      const svgObj = new SVG().addTo(el).size(w, h*.25);
      var bridge = svgObj.use('bridge', bridgePath).addClass('bridge');
      bridge.move(250,520);
      bridge.transform({
        scale: .25,
        rotate: -2,
      });
    }
  },
  apos.util.widgetPlayers['gspCityStatue'] = {
    selector: '[data-gspcity-statue]',
    player: function (el) {
      document.addEventListener('cityresize', resizeMe);
      if (ready && visibility) { enableMe(); }

      function enableMe() {
        document.addEventListener('cityintro', showMe);
        document.addEventListener('cityoutro', hideMe);
        if (ready && visibility) {
          showMe(null);
        }
      }
      function disableMe() {
        hideMe(null);
        document.removeEventListener('cityintro', showMe);
        document.removeEventListener('cityoutro', hideMe);
      }
      function resizeMe(e) {
        const enableDisplay = e.detail.enable;
        if (enableDisplay) { enableMe(); } else { disableMe(); }
      }

      function showMe(e) {
        el.setAttribute('data-opacity', 1);
        el.classList.add('visible');
      }
      function hideMe(e) {
        el.setAttribute('data-opacity', 0);
        el.classList.remove('visible');
      }
    }
  }
}
const SVG = require('@svgdotjs/svg.js').SVG;
const anime = require('animejs').default;

export default function gspBackgroundPlayer(el) {
  const debug = true;
  var w = window.innerWidth;
  var h = window.innerHeight;
  //console.log('gspBackgroundPlayer initialized for element:', el);
  const scroller = document.querySelector('.placeholder-scroller');
  const svgBg = new SVG().addTo(el).size(w,h);

  //var top = svgBg.polygon(`0,0 ${w/2},0 ${w/2},${h} 0,${h}`);
  var top = svgBg.polygon(`0,0 0,0 0,0 0,0`).fill('#000');
  top.addClass('bgTop');
/*
  anime({
    targets: '.bgTop',
    points: [
      { value: `${(w * .5)-1},${h*0} ${w/2},${h*0} ${w/2},${h*0} ${(w/2)-1},${h*0}` },
      { value: `${(w * .5)-1},${h*0} ${w/2},${h*0} ${w/2},${h} ${(w * .5)-1},${h}` },
    ],
    duration: 5000,
    easing: 'easeOutElastic',
  });
  */
  }
  
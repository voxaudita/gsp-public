const anime = require('animejs').default;
const SVG = require('@svgdotjs/svg.js').SVG;

import gspBackgroundPlayer from './lib/gspBackground.js';

export default () => {
  apos.util.widgetPlayers['gspBackground'] = {
    selector: '[data-gspbackground]',
    player: gspBackgroundPlayer,
  }
};
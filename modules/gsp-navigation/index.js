const { DateTime } = require('luxon');
const anime = require('animejs').default;

module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Navigation',
    alias: 'gspnav',
  },
  init(self) {
  },
  components(self) {
    return {
      async primaryNav(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
const { DateTime } = require('luxon');
const anime = require('animejs').default;

module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Press',
    alias: 'gsppress',
  },
  init(self) {
  },
  components(self) {
    return {
      async gspPressDisplay(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
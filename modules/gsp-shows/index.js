const { DateTime } = require('luxon');
const anime = require('animejs').default;

module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Shows',
    alias: 'gspshows',
  },
  init(self) {
  },
  components(self) {
    return {
      async gspShows(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
const { DateTime } = require('luxon');
const anime = require('animejs').default;

module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Artist',
    alias: 'artist',
  },
  init(self) {
  },
  components(self) {
    return {
      async artistInfoDisplay(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Background',
    alias: 'gspbg',
  },
  init(self) {
  },
  components(self) {
    return {
      async gspBackground(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
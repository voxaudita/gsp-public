module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Footer',
    alias: 'gspfooter',
  },
  init(self) {
  },
  components(self) {
    return {
      async gspFooter(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
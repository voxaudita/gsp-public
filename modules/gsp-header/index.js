module.exports = {
  extend: '@apostrophecms/module',
  options: {
    label: 'Header',
    alias: 'gspheader',
  },
  init(self) {
  },
  components(self) {
    return {
      async gspHeader(req, data) {
        const output = {};
        return output;
      }
    }
  },
}
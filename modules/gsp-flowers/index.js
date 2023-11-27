module.exports = {
    extend: '@apostrophecms/module',
    options: {
      label: 'Flowers',
      alias: 'gspflowers',
    },
    init(self) {
    },
    components(self) {
      return {
        async gspFlowers(req, data) {
          const output = {};
          return output;
        }
      }
    },
  }
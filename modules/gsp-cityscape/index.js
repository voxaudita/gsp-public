module.exports = {
    extend: '@apostrophecms/module',
    options: {
      label: 'CityScape',
      alias: 'gspcity',
    },
    init(self) {
    },
    components(self) {
      return {
        async gspCityBackdrop(req, data) {
          const output = {};
          return output;
        },
        async gspCityFront(req, data) {
          const output = {};
          return output;
        },
        async gspCityClouds(req, data) {
          const output = {};
          return output;
        },
        async gspCityBuildings(req, data) {
          const output = {};
          return output;
        },
        async gspCityBridges(req, data) {
          const output = {};
          return output;
        },
        async gspCityStatue(req, data) {
          const output = {};
          return output;
        }
      }
    },
  }
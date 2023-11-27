// modules/pl2023-content/index.js
module.exports = {
    extend: '@apostrophecms/piece-type',
    options: {
      alias: 'gsp-collection',
      label: 'Artwork',
      pluralLabel: 'Artworks',
      shortcut: 'c,a',
      slugPrefix: 'art-',
      // disable seo and og fields.
      //seoFields: false,
      //openGraph: false
    },
    fields: {
      add: {
        content: {
          type: 'string',
          label: 'FPO'
        }  
      },
      remove: ['slug', 'visibility'],
      group: {
        utility: {
        lable: 'Utility',
          fields: ['visibility'],
        }
      }
    },
    components(self) {
      return {
        async collectionMenu(req, data) {
          const collectionData = [
            {
              name: 'Bring Us Your Flowers',
              cover: '/images/artwork/buyf/alwaysKeepItFresh.jpg'
            },
            {
              name: 'New York I Love You',
              cover: '/images/artwork/nyily/ny-rangers.jpg',
            }, 
            {
              name: 'Come Fly With Me',
              cover: '/images/artwork/cfwm/cfwm04.jpg',
            },
            {
              name: 'No Comment',
              cover: '/images/artwork/nc/workNoComment01.jpg',
            },
            {
              name: 'Game Series',
              cover: '/images/artwork/game/workGame73.jpg',
            },
            {
              name: 'Untitled Series',
              cover: '/images/artwork/untitled/untitled05.jpg',
            },
          ];

          const collectionMenu = {
            collections: collectionData,
          }

          return collectionMenu;
        },
        async allCollectionsDisplay(req, data) {
          const output = {
            collections: [
              { name: 'name 1', direction: 'forward' },
              { name: 'name 2', direction: 'reverse' },
              { name: 'name 3', direction: 'forward' },
              { name: 'name 4', direction: 'reverse' },
              { name: 'name 5', direction: 'forward' },
            ]
          };
          return output;
        },
        async collectionList(req, data) {
          const output = {
            direction: data.direction,
            collection: [
              {item: 'item 1', src: '/images/artwork/buyf/alwaysKeepItFresh.jpg'},
              {item: 'item 2', src: '/images/artwork/cfwm/cfwm01.jpg'},
              {item: 'item 3', src: '/images/artwork/cfwm/cfwm02.jpg'},
              {item: 'item 4', src: '/images/artwork/game/workGame02.jpg'},
              {item: 'item 5', src: '/images/artwork/game/workGame07.jpg'},
              {item: 'item 1', src: '/images/artwork/game/workGame11.jpg'},
              {item: 'item 2', src: '/images/artwork/nc/workNoComment01.jpg'},
              {item: 'item 3', src: '/images/artwork/nyily/ny-rangers.jpg'},
              {item: 'item 4', src: '/images/artwork/untitled/untitled01.jpg'},
              {item: 'item 5', src: '/images/artwork/untitled/untitled05.jpg'},
            ]
          };
          return output;
        },
        async collectionItem(req, data) {
          const output = {
            src: data.img.src,
          };
          return output;
        },
        async artwork(req, data) {
          const output = {};
          return output;
        }
      }
    },
  }
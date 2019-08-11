var DATA_URL = 'https://jsonstorage.net/api/items/aa5ea59c-da25-4c76-a8ad-c8f2cd825b27';

var app = new Vue({
    el: '#app',
    data: {
        jsonData: []
    },
    created: function () {
        // nacitame json data z API
        fetch(DATA_URL)
          .then(r => r.json())
          .then(json => {
            this.jsonData = json;
          });
      }
});


var DATA_URL = 'https://jsonstorage.net/api/items/aa5ea59c-da25-4c76-a8ad-c8f2cd825b27';
var CURRENCY_TABLE = {
    'EUR': '€'
};

var app = new Vue({
    el: '#app',
    data: {
        jsonData: [],
        cart: 0
    },
    created: function () {
        // nacitame json data z API
        fetch(DATA_URL)
          .then(r => r.json())
          .then(json => {
            this.jsonData = json;
          });
    },
    computed: {
        price() {
            return getPrice(this.jsonData.Price, this.jsonData.CurrencyCode);
        },
        oldPrice() {
            return getPrice(this.jsonData.OldPrice, this.jsonData.CurrencyCode);
        },
        discount() {
            return getDiscount(this.jsonData.Discount);
        },
        inStock() {
            return this.cart < this.jsonData.Quantity;
        }

    }
});

/**
 * Funckcia vrati formatovanu cenu
 * @param {Number} priceValue hodnota ceny
 * @param {String} currencyCode kod meny
 */
function getPrice(priceValue, currencyCode) {
    if (priceValue == null && currencyCode == null) {
        return '';
    }

    var currency = CURRENCY_TABLE[currencyCode];
    if (!currency) {
        currency = currencyCode;
    }

    return priceValue + currency;
}

/**
 * Funkcia vrati formatovanu zlavu
 * @param {String} discount hodnota zlavy
 */
function getDiscount(discount) {
    if (discount == null) {
        return '';
    }

    return discount + ' zľava';
}

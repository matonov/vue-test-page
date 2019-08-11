Vue.component('star-rating', VueStarRating.default);

var DATA_PRODUCT_URL = 'https://jsonstorage.net/api/items/4734fe5e-895c-4fc4-8fec-477a12de982b';
var DATA_RATINGS_URL = 'https://jsonstorage.net/api/items/48f299c3-1a59-4ebb-9cd4-0a25aa6c2ffa';
var CURRENCY_TABLE = {
    'EUR': '€'
};

var app = new Vue({
    el: '#app',
    data: {
        product: {},
        ratings: [],
        cart: 0
    },
    created: function () {
        // nacitame product data z API
        fetch(DATA_PRODUCT_URL)
          .then(res => res.json())
          .then(data => {
            this.product = data;
          })
          .catch(err => console.log(err));
        // nacitame rating data z API
        fetch(DATA_RATINGS_URL)
          .then(res => res.json())
          .then(data => {
            this.ratings = data;
          })
          .catch(err => console.log(err));
    },
    computed: {
        price() {
            return getPrice(this.product.Price, this.product.CurrencyCode);
        },
        oldPrice() {
            return getPrice(this.product.OldPrice, this.product.CurrencyCode);
        },
        discount() {
            return getDiscount(this.product.Discount);
        },
        inStock() {
            return this.cart < this.product.Quantity;
        },
        rating() {
            var averageRating = getAverageRating(this.ratings, this.product.ProductId);
            if (averageRating) {
                return averageRating;
            }
            return 0;
        },
        ratingCount() {
            var suffix = 'hodnotení';
            var count = this.ratings.length;
            if (count === 1) {
                suffix = 'hodnotenie';
            } else {
                if (count >= 2 && count <= 4) {
                    suffix = 'hodnotenia';
                }
            }
            return count + ' ' + suffix;
        }
    },
    methods: {
        // ulozenie hodnotenia podla id produktu
        setRating: function (newRating) {
            this.ratings.push({
                ProductId: this.product.ProductId,
                Rating: newRating
            });

            fetch(DATA_RATINGS_URL, {
                method: 'put',
                body: JSON.stringify(this.ratings),
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => res.json())
                .catch(err => console.log(err));
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

/**
 * Vypočíta arimetický priemer hodnotení podľa produktu
 * @param {Array} ratings pole hodnotení
 * @param {Number} productId id produktu
 */
function getAverageRating(ratings, productId) {
    if (ratings == null || ratings.length === 0 || productId == null) {
        return null;
    }

    var filteredRatingsByProductId = [];
    for (var i = 0; i < ratings.length; i++) {
        if (ratings[i].ProductId === productId) {
            filteredRatingsByProductId.push(ratings[i].Rating);
        }
    }


    return (filteredRatingsByProductId.reduce(function(a,b) { return a + b}, 0) / filteredRatingsByProductId.length);
}

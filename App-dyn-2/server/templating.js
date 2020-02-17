var links = {}

function createLink (link) {
    var id = Object.keys(links).length
    links[id] = link
}

var ingredientsReuben = [ '2 slices rye bread or pumpernickel.',
    '2 teaspoons butter, at room temperature.',
    '1/4 cup well-drained, fresh-style sauerkraut.',
    '2 tablespoons Reubens Russian Dressing.',
    '2 ounces thinly sliced Gruyère or Switzerland Swiss cheese.',
    '1/4 pound thinly sliced corned beef.'
]
var ingredientsBlt = [ 'Bacon', 'Lettuce', 'Tomatoes', 'Bread' ]

var ingredientsBigMac = [ 'beef patties',
    'special sauce',
    'iceberg lettuce',
    'American cheese',
    'pickles',
    'onions',
    'three-part sesame seed bun.']

createLink({
    title: 'Reuben Sandwich',
    imageURL: 'http://static1.squarespace.com/static/522565bee4b0c3db86935016/52e55ae3e4b09ec1399163d4/56e9b1c1d210b80e07c58bdc/1515692937101/Classic-Reuben-Sandwich.jpg?format=1500w',
    calories: '942',
    rating: '5 ⭐',
    url: '/reuben',
    ingredients: ingredientsReuben
})

createLink({
    title: 'BLT Sandwich',
    imageURL: 'https://img.sndimg.com/food/image/upload/w_555,h_416,c_fit,fl_progressive,q_95/v1/img/recipes/12/96/15/RCNa1fLaTS2U0FY3yOUq_BLT%205%20-%20final_6.jpg',
    calories: '500',
    rating: '4 ⭐',
    url: '/blt',
    ingredients: ingredientsBlt
})

createLink({
    title: 'Big Mac',
    calories: '650',
    rating: '3 ⭐',
    imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Big_Mac_hamburger.jpg/1200px-Big_Mac_hamburger.jpg',
    url: '/bigmac',
    ingredients: ingredientsBigMac
})

module.exports = {
    links: links
};
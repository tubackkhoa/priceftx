const axios = require('axios');
axios({
  method: 'get',
  url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  headers: {'X-CMC_PRO_API_KEY': '29ee66ef-e4f3-485f-8b92-094b6b7ec284'},
  params: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  }
})
  .then(function (response) {
    let data = {};
    for (let value of response.data.data) {
      data[value.symbol] = value.slug;
    }
    var fs = require('fs');
    fs.writeFile('./src/mapping.json', JSON.stringify(data), 'utf8', (response) => {
      console.log(response);
    });
  });
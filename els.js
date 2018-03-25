var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '192.168.1.225:9200',
    log: 'info'
});

client.search({
    q: 'red'
}).then(function (body) {
    var hits = body.hits.hits;
    console.log(hits);
}, function (error) {
    console.trace(error.message);
});
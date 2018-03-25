var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '192.168.1.225:9200',
    log: 'info'
});
require('http');

client.index({
    index: 'habage',
    type: 'test',
    body: {
        title: '甲骨文正式宣布将 Java EE 移交给 Eclipse 基金会',
        content: '结语。',
        tags: ['habage', 'test'],
        published: true,
    }
}, function (error, response) {
    console.log(error);
    console.log(response);
});
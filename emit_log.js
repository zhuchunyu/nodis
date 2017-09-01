var amqp = require('amqplib/callback_api');

amqp.connect('amqp://172.19.3.162', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'logs';
        var msg = 'Hello World!';
        
        ch.assertExchange(ex, 'fanout', {durable: false});
        ch.publish(ex, '', new Buffer(msg));
        console.log(" [x] Sent %s", msg);
    });
    
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
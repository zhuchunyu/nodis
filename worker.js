var amqp = require('amqplib/callback_api');

amqp.connect('amqp://172.19.3.162', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'task_queue';
    
        ch.consume(q, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;
        
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
            }, secs * 1000);
        }, {noAck: true});
    });
});

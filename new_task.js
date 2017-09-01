var amqp = require('amqplib/callback_api');

amqp.connect('amqp://172.19.3.162', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'task_queue';
        var msg = "Hello Queue!";
    
        ch.assertQueue(q, {durable: true});
        ch.sendToQueue(q, new Buffer(msg), {persistent: true});
        console.log(" [x] Sent '%s'", msg);
    });
    
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

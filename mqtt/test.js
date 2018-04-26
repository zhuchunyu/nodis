const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67:1883', { username: '1001', password: '123456', clientId:'c1001' })

client.on('connect', function () {
  client.subscribe('x/g/z')
  setTimeout(function () {
    client.publish('x/g/z', 'Hello mqtt')
  }, 100)
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

client.on('error', function (err) {
  console.log(err.stack)
  process.exit()
});

//publish_acl: [{pattern: 'a/b/c'}, {pattern: 'a/+/d'}], subscribe_acl: [{pattern: 'a/b/c'}]
//publish_acl: [{pattern: 'x/y/z'}, {pattern: 'x/+/z'}], subscribe_acl: [{pattern: 'x/#'}]
//db.auth_users.insert({"username" : "test01", "password" : "123456", "expired_at" : 1524647200561, "client_id" : "1001", publish_acl: [{pattern: 'a/b/c'}, {pattern: 'a/+/d'}], subscribe_acl: [{pattern: 'a/b/c'}]})
//db.auth_users.insert({"username" : "1001", "password" : "123456", "expired_at" : 1524647200561, "client_id" : "c1001", publish_acl: [{pattern: 'x/y/z'}, {pattern: 'x/+/z'}], subscribe_acl: [{pattern: 'x/y/z'}]})

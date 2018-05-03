const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67:1883', { username: 'virtual_device', password: '22d44917-f621-412d-8403-0f4bd7c8dc28', clientId:'19084' })

client.on('connect', function () {
  client.subscribe('client/products/19084/devices/+/command')
  setTimeout(function () {
    client.publish('client/products/19084/devices/+/command', 'Hello mqtt')
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

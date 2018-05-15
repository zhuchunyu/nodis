const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67:1883', { username: 'test03', password: '22d44917-f621-412d-8403-0f4bd7c8dc28', clientId:'1003' })

client.on('connect', function () {
  client.subscribe('client/products/19084/devices/+/command')
  setTimeout(function () {
    const data = {
      task_id: '123',
      'function': 234,
      type: 'STRING',
      value: 'Hello Mqtt'
    }
    client.publish('client/products/19084/devices/123/command', JSON.stringify(data))
  }, 200)
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
//db.vmq_acl_auths.insert({"username" : "virtual_device_1", "password" : "22d44917-f621-412d-8403-0f4bd7c8dc28", "expired_at" : 1624647200561, "client_id" : "1001", publish_acl: [{pattern: 'client/products/19084/devices/+/command'}, {pattern: 'client/products/19084/devices/+/command'}], subscribe_acl: [{pattern: 'client/products/19084/devices/+/command'}]})
//db.vmq_acl_auths.insert({"username" : "1001", "password" : "123456", "expired_at" : 1624647200561, "client_id" : "c1001", publish_acl: [{pattern: 'x/y/z'}, {pattern: 'x/+/z'}], subscribe_acl: [{pattern: 'x/y/z'}]})

//db.vmq_acl_auths.insert({"username" : "test01", "password" : "123456", "expired_at" : 1624647200561, "client_id" : "1001", publish_acl: [{pattern: 'a/b/c'}, {pattern: 'a/+/z'}], subscribe_acl: [{pattern: 'a/b/c'}]})
//db.vmq_acl_auths.insert({"username" : "test02", "password" : "22d44917-f621-412d-8403-0f4bd7c8dc28", "expired_at" : 1624647200561, "client_id" : "1002", publish_acl: [{pattern: 'a/b/c'}, {pattern: 'a/+/z'}], subscribe_acl: [{pattern: 'a/b/c'}]})
//db.vmq_acl_auths.insert({"username" : "test03", "password" : "22d44917-f621-412d-8403-0f4bd7c8dc28", "expired_at" : 1624647200561, "client_id" : "1003", publish_acl: [{pattern: 'client/products/19084/devices/+/command'}, {pattern: 'client/products/19084/devices/+/command'}], subscribe_acl: [{pattern: 'client/products/19084/devices/+/command'}]})
//db.vmq_acl_auths.insert({"username" : "test04", "password" : "22d44917-f621-412d-8403-0f4bd7c8dc28", "expired_at" : 1624647200561, "client_id" : "1004", publish_acl: [{pattern: 'client/products/19085/devices/+/command'}, {pattern: 'client/products/19086/devices/+/command'}], subscribe_acl: [{pattern: 'device/products/19085/devices/+/command'}]})
//db.vmq_acl_auths.insert({"username" : "test05", "password" : "22d44917-f621-412d-8403-0f4bd7c8dc28", "expired_at" : 1624647200561, "client_id" : "1005", publish_acl: [{pattern: 'client/products/19085/devices/+/command'}, {pattern: 'client/products/19086/devices/+/command'}], subscribe_acl: [{pattern: 'client/products/+/devices/+/command'}]})
//db.vmq_acl_auths.insert({"username" : "test06", "password" : "22d44917-f621-412d-8403-0f4bd7c8dc28", "expired_at" : 1624647200561, "client_id" : "1006", publish_acl: [{pattern: 'client/products/19085/devices/+/command'}, {pattern: 'client/products/19086/devices/+/command'}], subscribe_acl: [{pattern: 'client/products/+/devices/+/command'}]})


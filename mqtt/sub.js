const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.69:1883', { username: 'test05', password: '22d44917-f621-412d-8403-0f4bd7c8dc28', clientId:'1005' })

client.on('connect', function () {
  client.subscribe('client/products/19085/devices/123/command')
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
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.3.186:26003', { username: 'test03', password: '22d44917-f621-412d-8403-0f4bd7c8dc28', clientId:'1003' })

client.on('connect', function () {
  client.subscribe('$sys/19084/123/creq/123')
  console.log('ok')
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
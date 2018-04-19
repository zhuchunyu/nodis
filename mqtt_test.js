const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67')

client.on('connect', function () {
  console.log('ok')
  client.subscribe('presence')
  setTimeout(function () {
    client.publish('presence', 'Hello mqtt')
  }, 100)
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

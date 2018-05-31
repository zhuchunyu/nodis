const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.3.186:26003', { username: 'virtual_debug', password: '5b0e12031ba508002b2fa481', clientId:'h5_5b05036xxxx' })

client.on('connect', function (data) {
  console.log(data)
  client.subscribe('client/products/123/devices/321/connection')
  setTimeout(function () {
    const data = {
      task_id: '123',
      'function': 234,
      type: 'STRING',
      value: 'Hello Mqtt'
    }
    console.time('publish')
    client.publish('client/products/222/devices/333/command', JSON.stringify(data))
  }, 200)
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.timeEnd('publish')
  console.log(message.toString())
  client.end()
})

client.on('error', function (err) {
  console.log(err.stack)
  process.exit()
});

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67:26003', { username: '5b0cbe171d27b12698b1335b', password: '5af655340c9fc7002b667ea4', clientId:'h5_5b05036xx' })

client.on('connect', function (data) {
  console.log(data)
  client.subscribe('server/products/22482/devices/SN0001/exception')
  setTimeout(function () {
    const data = {
      task_id: '123',
      'function': 234,
      type: 'STRING',
      value: 'Hello Mqtt'
    }
    console.time('publish')
    client.publish('client/products/22482/devices/SN0001/command', JSON.stringify(data))
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

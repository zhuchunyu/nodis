const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67:26003', { username: 'qmyn', password: '5afa4f03a3b3ab002c94c4e9', clientId:'app_5afa4f03a3b3ab002c94c4e9' })

client.on('connect', function (data) {
  console.log(data)
  client.subscribe('client/connections/qmyn/devices')
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

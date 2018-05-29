const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://172.19.16.67:26003', { username: 'virtual_device_22358', password: 'ognwiookfjgykhcp', clientId:'virtual_5b05036230ec10002b1bb651' })

client.on('connect', function (data) {
  console.log(data)
  client.subscribe('device/products/22358/devices/+/command')
  setTimeout(function () {
    const data = {
      task_id: '123',
      'function': 234,
      type: 'STRING',
      value: 'Hello Mqtt'
    }
    console.time('publish')
    client.publish('client/products/22358/devices/1234/command_resp', JSON.stringify(data))
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

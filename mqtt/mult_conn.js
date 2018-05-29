const mqtt = require('mqtt')
const Promise = require('bluebird')

let count = 0
let fail = 0

const list = []
for (let i=1; i<=20000; i++) {
  list.push(i)
}

Promise.map(list, function (i) {
  return new Promise(function (resolve) {
    const client = mqtt.connect('mqtts://172.19.16.69:28883', { username: '5b061e6fdc12a0154475a867', password: '5af655340c9fc7002b667ea4', clientId:'h5_5b05036cd'+i, rejectUnauthorized:false })
  
    client.on('connect', function (data) {
      if (data.cmd === 'connack') {
        count++
      } else {
        fail++
      }
      console.log(count, fail, data.returnCode)
      client.subscribe('server/products/22358/devices/SN0013/exception')
  
      resolve()
    })
  
    client.on('error', function (err) {
      console.log(err.stack)
      process.exit()
    });
  })
}, { concurrency: 100 })

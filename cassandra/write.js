const dse = require('dse-driver')
const Promise = require('bluebird')
const client = new dse.Client({ contactPoints: ['172.19.16.67'], keyspace: 'mycas' });

client.on('error', function (err) {
  console.log(err)
})

const query = 'select id,user_name from user where id=?';
client.execute(query, [ 1 ], { prepare : true }, function (err, result) {
  if (err) {
    console.log(err)
    return;
  }
  console.log('id', result.rows)
  
  const count = 1000000;
  
  const l = []
  for (let i=1; i<=count; i++) {
    l.push(i)
  }
  
  const start = new Date().getTime()
  
  Promise.map(l, function (i) {
    return new Promise(function (resolve) {
      client.execute('INSERT INTO user (id,user_name) VALUES (?, ?)', [ i, `name_${i}` ], { prepare : true }, function (err, result) {
        if (err) {
          console.log(err)
        }
  
        if (i%20000 === 0) {
          console.log(i)
        }
  
        resolve()
      });
    })
  }, { concurrency: 2000 }).then(function () {
    const end = new Date().getTime()
    console.log('qps:', count/((end-start)/1000))
    client.shutdown()
  })
});

const dse = require('dse-driver')
const client = new dse.Client({ contactPoints: ['172.19.16.67'], keyspace: 'mycas' });

//const cassandra = require('cassandra-driver');
//const client = new cassandra.Client({ contactPoints: ['172.19.16.67'], keyspace: 'mycas' });

client.on('error', function (err) {
  console.log(err)
})

const query = 'select id,user_name from user where id=?';
client.execute(query, [ 1 ], { prepare : true }, function (err, result) {
  if (err) {
    console.log(err)
    return;
  }
  console.log('User with user_name1 %s', result.rows[0].user_name);
});

client.execute('select id,user_name from user where user_name=?', [ 'zhangsan' ], function (err, result) {
  if (err) {
    console.log(err)
    return;
  }
  console.log('User with user_name %s', result.rows[0].user_name);
});

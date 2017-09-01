var thrift = require('thrift');
//var ttransport = require('thrift/lib/thrift/transport');
var Nodis = require('./gen-nodejs/Nodis.js');
var NodisTypes = require('./gen-nodejs/nodis_types.js');
var zkUtils = require('./zk.js');
var index = function(user, fn){
    console.log(user);
    fn('ok');
};
var remove = function(username, fn){
    console.log(username);
    fn('ok');
};
var server_framed = thrift.createServer(Nodis, {
    index : index,
    remove : remove,
});
server_framed.listen(9998);
console.log('NodisServer is running now...');
zkUtils.registerService('/thrift_services/nodis', '172.19.3.162:9998');//在zookeeper上注册server服务
//add shutdown hook: remove service from zookeeper
process.on('SIGTERM', function () {
  console.log('Got SIGTERM.  Removing Zookeeper Registry.');
  zkUtils.removeServiceThenExit('/thrift_services/nodis', '172.19.3.162:9998', function(){
      //zkUtils.close();
      process.exit();//put this in 'close' callback later, now unsupported by node-zookeeper
  });
});
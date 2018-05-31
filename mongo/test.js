const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://172.19.16.67:27057/hewu');

const H5Schama = new Schema({
  mountpoint: String,
  client_id: String,
  username: String,
  password: String,
  expired_at: Number,
  publish_acl: Array,
  subscribe_acl: Array,
  ref: { type: Schema.Types.ObjectId }
}, Object.assign({ collection: 'vmq_acl_auth_h5' }))

const H5Model = mongoose.model('H5Model', H5Schama);

H5Model.findOne({ username: 'virtual_debug', password: '5b0e12031ba508002b2fa481' }).then(function () {
  console.time('query')
  
  H5Model.findOne({ username: 'virtual_debug2', password: '5b0e12031ba508002b2fa481' }).then(function (h5) {
    
    console.log(h5)
    
    console.timeEnd('query')
    mongoose.disconnect()
  })
})

db.vmq_acl_auth_h5.ensureIndex({ username:1 }, { unique: true })
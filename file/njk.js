const nunjucks = require('nunjucks')
const fs = require('fs')
const archiver = require('archiver')

nunjucks.configure({
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});

const typeMap = {
  STRING: 'STRING',
  INTEGER: 'INT',
  FLOAT: 'FLOAT',
  ENUM: 'ENUM',
  EXCEPTION: 'ERROR',
  BOOLEAN: 'BOOL',
  BYTES: 'BINARY',
}

const shtml = nunjucks.render('index.nunjucks', {
  product_id: '2213',
  functions: [
    { index: 0, name: 'string', type: 'STRING', up:true, down:true },
    { index: 1, name: 'int', type: 'INT', up:true, down:true },
    { index: 2, name: 'float', type: 'FLOAT', up:true, down:true },
    { index: 3, name: 'enum', type: 'ENUM', enum: [1, 2, 3, 4], up:true, down:true },
    { index: 4, name: 'error', type: 'ERROR', exception: [1, 2, 3], up:true, down:true },
    { index: 5, name: 'bool', type: 'BOOL', up:true, down:true },
    { index: 6, name: 'binary', type: 'BINARY', up:true, down:true }
  ]
});

console.log(shtml)

// create a file to stream archive data to.
const output = fs.createWriteStream(__dirname + '/mcu-sdk.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
  console.log('Data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

// append a file from buffer
const buffer3 = Buffer.from(shtml);
archive.append(buffer3, { name: 'file3.h' });

archive.finalize();

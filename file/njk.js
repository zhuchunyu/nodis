const nunjucks = require('nunjucks')

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

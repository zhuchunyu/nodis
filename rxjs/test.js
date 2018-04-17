const Rx = require('rxjs/Rx');

const l = Rx.Observable.of(1,2,3).map(x => x + '!!!');

console.log(l)
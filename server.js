var thrift = require("thrift");
var Calculator = require("./gen-nodejs/Calculator");
var ttypes = require("./gen-nodejs/tutorial_types");
var SharedStruct = require("./gen-nodejs/shared_types").SharedStruct;

var data = {};

var server = thrift.createServer(Calculator, {
    ping: function(result) {
        console.log("ping()");
        result(null);
    },
    
    add: function(n1, n2, result) {
        console.log("add(", n1, ",", n2, ")");
        result(null, n1 + n2);
    },
    
    calculate: function(logid, work, result) {
        console.log("calculate(", logid, ",", work, ")");
        
        var val = 0;
        if (work.op == ttypes.Operation.ADD) {
            val = work.num1 + work.num2;
        } else if (work.op === ttypes.Operation.SUBTRACT) {
            val = work.num1 - work.num2;
        } else if (work.op === ttypes.Operation.MULTIPLY) {
            val = work.num1 * work.num2;
        } else if (work.op === ttypes.Operation.DIVIDE) {
            if (work.num2 === 0) {
                var x = new ttypes.InvalidOperation();
                x.whatOp = work.op;
                x.why = 'Cannot divide by 0';
                result(x);
                return;
            }
            val = work.num1 / work.num2;
        } else {
            var x = new ttypes.InvalidOperation();
            x.whatOp = work.op;
            x.why = 'Invalid operation';
            result(x);
            return;
        }
        
        var entry = new SharedStruct();
        entry.key = logid;
        entry.value = ""+val;
        data[logid] = entry;
        
        result(null, val);
    },
    
    calculate_test: function(logid, work, result) {
        console.log("calculate(", logid, ",", work, ")");
        
        var val = 0;
        if (work.op == ttypes.Operation.ADD) {
            val = work.num1 + work.num2;
        } else if (work.op === ttypes.Operation.SUBTRACT) {
            val = work.num1 - work.num2;
        } else if (work.op === ttypes.Operation.MULTIPLY) {
            val = work.num1 * work.num2;
        } else if (work.op === ttypes.Operation.DIVIDE) {
            if (work.num2 === 0) {
                var x = new ttypes.InvalidOperation();
                x.whatOp = work.op;
                x.why = 'Cannot divide by 0';
                result(x);
                return;
            }
            val = work.num1 / work.num2;
        } else {
            var x = new ttypes.InvalidOperation();
            x.whatOp = work.op;
            x.why = 'Invalid operation';
            result(x);
            return;
        }
        
        var entry = new SharedStruct();
        entry.key = logid;
        entry.value = ""+val;
        data[logid] = entry;
        
        result(null, work);
    },
    
    say: function(name, result) {
        //console.log("say(", name, ")");
        result(null, name);
    },
    
    getCat: function(name, result) {
        console.log("getCat(", name, ")");
        var cat = new ttypes.Cat({name:name, food:'One food', common:new ttypes.Animal({age:2, weight:13}), curl:true});
        result(null, cat);
    },
    
    getStruct: function(key, result) {
        console.log("getStruct(", key, ")");
        result(null, data[key]);
    },
    
    map_test: function(para, result) {
        console.log("map_test(", para, ")");
        result(null, para);
    },
    
    zip: function() {
        console.log("zip()");
        result(null);
    }
    
});

server.on('error', function (err) {
    console.log('error:');
    console.log(err);
});

server.listen(9090);
console.log('Listening on 9090');
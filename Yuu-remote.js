// Options
// TODO Parse from the command line
var SERVER_PORT = 988;
var VERBOSITY = 20;
var AUTH_KEY = "yuu";

var log = function(m, l) {
    if (VERBOSITY >= l) {
        console.log(m);
    }
};

// Libraries
var sio = require("socket.io")();
var rjs = require("robotjs");

// Setup robotjs
rjs.setMouseDelay(2);
rjs.setKeyboardDelay(2);

// Setup socket.io
sio.on("connection", function(socket) {
    var sid = socket.id;
    log("conn:    " + sid, 10);
    
    socket.on("disconnect", function() {
        log("dis: " + sid, 10);
    });
    
    socket.on("auth", function(key) {
        if (key === AUTH_KEY) {
            socket.emit("auth", true);
            log("auth : " + sid, 10);
            
            // Now attach listeners
            socket.on("msm", function(action) {
                
            });
            
            socket.on("kbd", function(key) {
                log("kbd : " + sid + " : " + key, 30);
                rjs.keyToggle(key, "down");
            });
            
            socket.on("kbu", function(key) {
                log("kbu : " + sid + " : " + key, 30);
                rjs.keyToggle(key, "up");
            });
        }
    });
});

sio.listen(988);

console.log("Listening on 988");

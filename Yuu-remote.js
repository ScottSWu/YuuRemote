// Packages
var sio = require("socket.io")();
var rjs = require("robotjs");
var argv = require("minimist")(process.argv.slice(2));

// Options
var HTTP_SERVER_PORT = argv["http-port"] || 3000;
var HTTP_SERVER_ENABLED = argv["http-server"] || false;
var WEBSOCKET_SERVER_PORT = argv["ws-port"] || 988;
var VERBOSITY = argv["v"] || argv["verbosity"] || 20;
var AUTH_KEY = argv["key"] || "yuu";

var log = function(m, l) {
    if (VERBOSITY >= l) {
        console.log(m);
    }
};

// Setup robotjs
rjs.setMouseDelay(0);
rjs.setKeyboardDelay(0);

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
            
            // Mouse Absolute
            socket.on("msa", function(coords) {
                log("msa : " + sid + " : " + coords, 40);
                rjs.moveMouse(coords.x, coords.y);
            });
            
            // Mouse Relative
            socket.on("msr", function(coords) {
                
            });
            
            // Keyboard down
            socket.on("kbd", function(key) {
                log("kbd : " + sid + " : " + key, 30);
                rjs.keyToggle(key, "down");
            });
            
            // Keyboard up
            socket.on("kbu", function(key) {
                log("kbu : " + sid + " : " + key, 30);
                rjs.keyToggle(key, "up");
            });
            
            // Keyboard type
            socket.on("kbt", function(key) {
                log("kbt : " + sid + " : " + key, 30);
                rjs.keyTap(key);
            });
            
            // Keyboard raw (supports modifiers)
            socket.on("kbr", function(args) {
                rjs.keyToggle.call(rjs, args);
            });
            
            // Screen size
            socket.on("ss", function() {
                socket.emit("ss", rjs.getScreenSize());
            });
        }
    });
});

sio.listen(WEBSOCKET_SERVER_PORT);

log("Listening on " + WEBSOCKET_SERVER_PORT, 5);

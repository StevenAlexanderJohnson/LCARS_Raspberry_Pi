const express = require('express');
const gpio = require('onoff').Gpio;
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const PORT = 8000;

// Define the pins that can be used as output pins.
let gpioPins = [2, 3, 4, 17, 27, 22, 10, 9, 11, 5, 6, 13, 19, 26, 14, 15, 18, 23, 24, 25, 8, 7, 12, 16, 20, 21];
// Initialize the pins to be used later
let outputPins = [];

for(var i = 0; i < gpioPins.length; i++)
{
    console.log(gpioPins[i]);
    outputPins.push(new gpio(gpioPins[i], 'out'));
}

for(var i = 0; i < 1000; i++)
{
    if(Math.floor(Math.random() * 9) > 8)
    {
        console.log("Hit");
    }
}

// Send the HTML
app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, "public", "lcars-classic.html"));
});

app.post("/TogglePin", function(request, response) {
    // Get the pin to toggle
    var pin = request.body["pinIndex"];
    // XOR the current value with 1 to toggle
    outputPins[pin].writeSync(outputPins[pin].readSync() ^ 1);
    console.log("Pin " + gpioPins[pin] + " is turned " + (outputPins[pin].readSync() == 1 ? "on" : "off"));
    response.sendStatus(200);
});

var timeoutTime = 5;
var timeoutList = [];
app.post("/TimeoutPin", function(request, response) {
    var pin = request.body["pinIndex"];
    if(outputPins[pin].readSync() == 1)
    {
        for(var i = 0; i < timeoutList.length; i++) {
            if(timeoutList[i][1] == pin) {
                response.end(JSON.stringify({ pinRunning: true, timeLeft: getTimeLeft(timeoutList[i][0]) }));
                return;
            }
        }
        return;
    }
    console.log("Pin " + gpioPins[pin] + " has been turned on");
    outputPins[pin].writeSync(1);
    timeoutList.push([setTimeout(() => {
        console.log("Pin " + gpioPins[pin] + " has been turned off");
        outputPins[pin].writeSync(0);
        for(var i = 0; i < timeoutList.length; i++) {
            if(timeoutList[i][1] == pin) {
                timeoutList.splice(i, 1);
                break;
            }
        }
    }, timeoutTime * 1000), pin]);
    console.log(timeoutList);
    response.end(JSON.stringify({ pinRunning: true, timeLeft: timeoutTime }));
});

app.post('/SetTimeout', function(request, response) {
    try {
        timeoutTime = request.body['timeoutValue'];
        response.sendStatus(200);
    }
    catch(error) {
        response.sendStatus(400);
        console.log(error.message);
    }
    
});  

app.post("/TurnPinOn", function(request, response) {
    var pin = request.body["pinIndex"];
    // check to see if it is in the list of active pins
    for(var i = 0; i < timeoutList.length; i++) {
        if(timeoutList[i] == pin) {
            response.sendStatus(500);
            return;
        }
    }
    outputPins[pin].writeSync(1);
    console.log(gpioPins[pin] + " has been turned on");
    timeoutList.push(pin);
    response.sendStatus(200);
});

app.post("/TurnPinOff", function(request, response) {
    var pin = request.body["pinIndex"];
    outputPins[pin].writeSync(0);
    console.log(gpioPins[pin] + " has been turned off");
    // Remove pin from active pins
    for(var i = 0; i < timeoutList.length; i++) {
        if(timeoutList[i] == pin) {
            timeoutList.splice(i, 1);
            break;
        }
    }
    console.log(timeoutList);
    response.sendStatus(200);
});

// Listen to the port on the local host
app.listen(PORT, function() {
    console.log(`Listening on http://localhost:${PORT}`);
});

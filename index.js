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
// for(var i = 0; i < gpioPins.length; i++)
// {
//     outputPins.push(new gpio(gpioPins[i], 'out'));
// }

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
    var pin = request.body["pinNumber"];
    // XOR the current value with 1 to toggle
    outputPins[pin].writeSync(outputPins[pin].readSync() ^ 1);
    response.sendStatus(200);
});

// Listen to the port on the local host
app.listen(PORT, function() {
    console.log(`Listening on http://localhost:${PORT}`);
});
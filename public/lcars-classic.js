let computerSounds = [
    './sounds/computerbeep_10.mp3',
    './sounds/computerbeep_11.mp3',
    './sounds/computerbeep_14.mp3',
    './sounds/computerbeep_15.mp3',
    './sounds/computerbeep_16.mp3',
    './sounds/computerbeep_18.mp3',
    './sounds/computerbeep_19.mp3',
    './sounds/computerbeep_41.mp3',
];

let timeoutValues = [5, 10, 15, 20, 30, 40, 60];
let timeoutIndex = 0;

function PlaySound() {
    let soundClip = computerSounds[Math.floor(Math.random() * 9)];
    var sound = new Audio(soundClip);
    sound.currentTime = 0;
    sound.play();
}

async function TogglePin(pinIndex) {
    PlaySound();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinIndex: pinIndex })
    };
    await fetch('/TogglePin', requestOptions)
        .then((response) => {
            if(response.ok) {
                return;
            } else {
                alert("Error");
            }
        });
}

async function TimeoutPin(element, pinIndex) {
    PlaySound();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinIndex: pinIndex })
    };
    var breakValue = false;
    await fetch('/TurnPinOn', requestOptions)
        .then((response) => {
            if(!response.ok) {
                breakValue = true;
                return;
            }
        });
    if(breakValue == true)
    {
        return;
    }
    var timeToWait = timeoutValues[timeoutIndex];
    for(var i = 0; i < timeToWait; i++)
    {
        element.children[0].innerHTML = '-' + (timeToWait - i) + 'M';
        await new Promise(r => setTimeout(r, 60000));
    }
    element.children[0].innerHTML = '';
    await fetch('/TurnPinOff', requestOptions)
        .then((response) => {
            if(!response.ok) {
                alert("error");
                return;
            }
        });
}

async function CycleTimeout() {
    timeoutIndex = (timeoutIndex + 1) % 7;
    document.getElementById("TimeoutValue").innerHTML = timeoutValues[timeoutIndex];
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeoutValue: timeoutValues[timeoutIndex] })
    };
    await fetch('/SetTimeout', requestOptions)
    .then((response) => {
        if(!response.ok) {
            throw new Error("Error");
        }
    })
    .catch((error) => {
        console.log("Error");
    });
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("TimeoutValue").innerHTML = timeoutValues[timeoutIndex];
});

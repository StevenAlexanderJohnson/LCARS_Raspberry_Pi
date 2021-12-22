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

function PlaySound() {
    let soundClip = computerSounds[Math.floor(Math.random() * 9)];
    var sound = new Audio(soundClip);
    sound.currentTime = 0;
    sound.play();
}
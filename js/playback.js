function rewind(){
    playState = -1;
    animateAlgorithm();
    var pp = document.getElementById('play_pause_button');
    if(pp.className == "fa fa-play") pp.className = "fa fa-pause";
}

function playPause(){
    var pp = document.getElementById('play_pause_button');
    playState = togglePlayPause(pp);
    animateAlgorithm();
}

function stepForward(){
    playState = 2;
    executeAnimationStep();
    step++;
}

function stepBackward(){
    playState = -2;
    executeAnimationStep();
    step--;
}

function togglePlayPause(current){
    if(current.className == "fa fa-play"){
        current.className = "fa fa-pause";
        return 1;
    } else {
        current.className = "fa fa-play";
        return 0;
    }
}
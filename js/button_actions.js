function loadDefaultGraph(){
    defaultGraphData();
    setNewGraph();
}

function generateRandomGraph(){
    generateGraphData();
    setNewGraph();
}

function rewind(){
    playState = -1;
    animateAlgorithm();
    var pp = document.getElementById('play_pause_button');
    if(pp.className == "fa fa-play waves-effect btn-flat btn-secondary") pp.className = "fa fa-pause waves-effect btn-flat btn-secondary";
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
    if(current.className == "fa fa-play waves-effect btn-flat btn-secondary"){
        current.className = "fa fa-pause waves-effect btn-flat btn-secondary";
        return 1;
    } else {
        current.className = "fa fa-play waves-effect btn-flat btn-secondary";
        return 0;
    }
}
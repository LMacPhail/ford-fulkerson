function loadDefaultGraph(){
    GenerateDefaultGraph();
    setNewGraph();
}

function loadRandomGraph(){
    generateRandomGraphData();
    setNewGraph();
}

function rewind(){
    playState = -1;
    animateAlgorithm();
    var state = document.getElementById('play_pause_button').innerHTML;
    if(state == "play_arrow") document.getElementById('play_pause_button').innerHTML = "pause";
}

function playPause(){
    playState = togglePlayPause();
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

function togglePlayPause(){
    var state = document.getElementById('play_pause_button').innerHTML;
    if(state == "play_arrow"){
        document.getElementById('play_pause_button').innerHTML = "pause";
        return 1;
    } else {
        document.getElementById('play_pause_button').innerHTML = "play_arrow";
        return 0;
    }
}

function toggleDisableDrawBtns(){
    var drawBtnClass = document.getElementById('drawNew').className;
    if(drawBtnClass == "waves-effect btn") {
        document.getElementById('drawNew').className = drawBtnClass + " disabled";
        document.getElementById('saveGraph').className = drawBtnClass;
    } else {
        document.getElementById('drawNew').className = "waves-effect btn";
        document.getElementById('saveGraph').className = "waves-effect btn disabled";
    }
}
function loadDefaultGraph(){
    toggleDisableDrawBtns();
    generateDefaultGraph();
    setNewGraph();
}

function loadRandomGraph(){
    toggleDisableDrawBtns();
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
    var playbackBtnClass = document.getElementById('rewind_button').className;
    if(drawBtnClass == "waves-effect btn") {
        document.getElementById('drawNew').className = drawBtnClass + " disabled";
        document.getElementById('saveGraph').className = drawBtnClass;
        
        document.getElementById('rewind_button').className = playbackBtnClass + " disabled";
        document.getElementById('step_back_button').className = playbackBtnClass + " disabled";
        document.getElementById('play_button').className = playbackBtnClass + " disabled";
        document.getElementById('step_forward_button').className = playbackBtnClass + " disabled";

        options.manipulation.enabled = true;
        topGraph.setOptions(options);
    } else {
        playbackBtnClass = "waves-effect btn-flat";
        drawBtnClass = "waves-effect btn";
        document.getElementById('drawNew').className = drawBtnClass;
        document.getElementById('saveGraph').className = drawBtnClass + " disabled";

        document.getElementById('rewind_button').className = playbackBtnClass;
        document.getElementById('step_back_button').className = playbackBtnClass;
        document.getElementById('play_button').className = playbackBtnClass;
        document.getElementById('step_forward_button').className = playbackBtnClass;

        options.manipulation.enabled = false;
        topGraph.setOptions(options);
    }
}
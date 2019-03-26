/*****************************************************************************

  All functions handling interaction from the user.

  Functions:

    ()  rewind()
    ()  playPause()
    ()  stepForward()
    ()  stepBackward()
    ()  togglePlayPause()

    ()  toggleDrawingButtonsActive(activate)
    ()  enableDrawingMode()
    ()  disableDrawingMode()

    ()  resetFlowCounter()
    ()  resetTraceback()

    ()  on file upload

******************************************************************************/

/*
  When the rewind button is clicked.
  Sets playState to -1 (REWIND), and changes the play/pause button to pause
*/
function rewind(){
    playState = -1;
    animateAlgorithm();
    var state = document.getElementById('play_pause_button').innerHTML;
    if(state == "play_arrow") document.getElementById('play_pause_button').innerHTML = "pause";
}

/*
  When play/pause button is pressed. If the play button is currently
      a "play" icon, the animation runs. If it is "pause", it stops.
*/
function playPause(){
    playState = togglePlayPause();
    animateAlgorithm();
}

/*
  When the step forward button is clicked. Executes the next step in the animation.
*/
function stepForward(){
    playState = 2;
    executeAnimationStep();
}

/*
  When the step forward button is clicked. Restores the previous step in the animation.
*/
function stepBackward(){
    playState = -2;
    executeAnimationStep();
}

/*
  Toggles between play and pause. Returns a value for the playState of 0 or 1 (PAUSE or PLAY).
*/
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

/*
  When drawing mode is enabled, the user may not run the animation. The playback buttons
      are deactivated, and the "save" button is activated.
  Drawing mode is disabled by pressing save or generating a new graph in another way.
      Then the playback buttons are reactivated and the "save" button deactivated.
*/
function toggleDrawingButtonsActive(activate){
    var drawBtnClass = document.getElementById('drawNew').className;
    var playbackBtnClass = document.getElementById('rewind_button').className;
    if(!activate) {
      playbackBtnClass = "waves-effect waves-orange btn-flat";
      drawBtnClass = "waves-effect btn cyan disabled";
    } else if (activate) {
      playbackBtnClass = "waves-effect waves-orange btn-flat disabled";
      drawBtnClass = "waves-effect btn cyan";
    }
    document.getElementById('saveGraph').className = drawBtnClass;
    document.getElementById('rewind_button').className = playbackBtnClass;
    document.getElementById('step_back_button').className = playbackBtnClass;
    document.getElementById('play_button').className = playbackBtnClass;
    document.getElementById('step_forward_button').className = playbackBtnClass;
}

/*
  Disables the playback buttons, then allows manipulation of the graph by changing
      the graph options.
*/
function enableDrawingMode() {
    toggleDrawingButtonsActive(true);
    options.manipulation = {
        enabled: true,
        initiallyActive: true,
        addNode: function (data, callback) {
            drawAddNode(data, callback);
        },
        addEdge: function (data, callback) {
            if (!(data.from == data.to)){
                do {
                    var capacity = prompt("Please enter capacity of new edge (whole number)", 4);
                    if((!Number.isInteger(parseInt(capacity))) || (capacity % 1 != 0)){  
                        alert("Must be a whole number!");
                    } else if (capacity < 0) {
                        alert("Capacity must be above 0");
                    }
                } while((!Number.isInteger(parseInt(capacity))) || (capacity % 1 != 0) || (capacity < 0));
                drawAddEdge(data, capacity, callback);
            } else {
                alert("Cannot connect node to itself!");
            }
        },
        deleteNode: function (data, callback) {
            var nodeIds = data.nodes;
            if((nodeIds[0] == 0) || (nodeIds[0] == -1)) {
                alert("cannot delete source or sink!");
                callback(null);
            } else {
                drawDeleteNode(data, callback);
            }
        },
        deleteEdge: function (data, callback) {
            drawDeleteEdge(data);
            callback(data);
        }
    };
    topGraph.setOptions(options);
}

/*
  Enables the playback buttons, and disables the manipulation of the graph.
*/
function disableDrawingMode() {
    toggleDrawingButtonsActive(false);
    options.manipulation.enabled = false;
    topGraph.setOptions(options);
}

/*
  Sets the value in the flow counter to 0
*/
function resetFlowCounter(){
    document.getElementById("flow_counter").innerHTML = "Current flow: 0";
}

/*
  Empties the execution trace panel except for "Press play to begin.".
*/
function resetTraceback(){
    document.getElementById("traceback").innerHTML = '<p class="caption traceback_line">press play to begin.</p>';
}

/*
  Executes when "Upload graph" is clicked. Checks that the file is valid and correctly
      formatted, then creates the graph from the file.
*/
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, options);
});

(function(){
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }
    function onReaderLoad(event) {
        try {
            var data = JSON.parse(event.target.result);
        } catch(err) {
            alert("Parsing error: " + err);
            document.getElementById("uploadFile").val = '';
            return;
        }
        var validGraph = checkValidGraph(data.nodes, data.edges);
        if (validGraph) loadNewGraph(createGraphFromUpload, data.nodes, data.edges); else document.getElementById("uploadFile").val = '';
    }
    document.getElementById("uploadFile").addEventListener('change', onChange);
}());

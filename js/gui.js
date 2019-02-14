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
}

function stepBackward(){
    playState = -2;
    executeAnimationStep();
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

function toggleDrawingButtonsActive(activate){
    var drawBtnClass = document.getElementById('drawNew').className;
    var playbackBtnClass = document.getElementById('rewind_button').className;
    if(activate) {
      playbackBtnClass = "waves-effect waves-orange btn-flat";
      drawBtnClass = "waves-effect btn cyan disabled";
    } else if (!activate) {
      console.log("deactivate");
      playbackBtnClass = "waves-effect waves-orange btn-flat disabled";
      drawBtnClass = "waves-effect btn cyan";
    }
    document.getElementById('saveGraph').className = drawBtnClass;
    document.getElementById('rewind_button').className = playbackBtnClass;
    document.getElementById('step_back_button').className = playbackBtnClass;
    document.getElementById('play_button').className = playbackBtnClass;
    document.getElementById('step_forward_button').className = playbackBtnClass;
}

function enableDrawingMode() {
    toggleDrawingButtonsActive(false);
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
                    if((!Number.isInteger(parseInt(capacity))) || (capacity % 1 != 0))  alert("Must be a whole number!");
                } while((!Number.isInteger(parseInt(capacity))) || (capacity % 1 != 0));
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

function disableDrawingMode() {
    toggleDrawingButtonsActive(true);
    options.manipulation.enabled = false;
    topGraph.setOptions(options);
}

function resetFlowCounter(){
    document.getElementById("flow_counter").innerHTML = "Current flow: 0";
}

function resetTraceback(){
    document.getElementById("traceback").innerHTML = '<p class="caption traceback_line">press play to begin.</p>';
}

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

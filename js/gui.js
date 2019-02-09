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

function enableDrawingMode() {
    var drawBtnClass = document.getElementById('drawNew').className;
    var playbackBtnClass = document.getElementById('rewind_button').className;
    if(drawBtnClass == "waves-effect btn cyan") {
        document.getElementById('drawNew').className = drawBtnClass + " disabled";
        document.getElementById('saveGraph').className = drawBtnClass;
        
        document.getElementById('rewind_button').className = playbackBtnClass + " disabled";
        document.getElementById('step_back_button').className = playbackBtnClass + " disabled";
        document.getElementById('play_button').className = playbackBtnClass + " disabled";
        document.getElementById('step_forward_button').className = playbackBtnClass + " disabled";

        options.manipulation = {
            enabled: true,
            initiallyActive: true,
            addNode: function (data, callback) {
                data.id = newNodeID;
                data.label = "n" + newNodeID;
                data.physics = false;
                data.color = {
                    background: '#00BCD4',
                    border: '#00BCD4',
                    highlight: {
                        background :'#757575',
                        border: '#212121',
                    },
                    hover: {
                        background :'#757575',
                        border: '#212121',
                    }
                };
                data.font = { color: '#ffffff'};
                callback(data);
                nodes = addNode(nodes, newNodeID, data.label, data.x, data.y);
                newNodeID++;
            },
            addEdge: function (data, callback) {
                data.id = newEdgeID;
                data.arrows = {to: {enabled: true}};
                data.font = {strokeWidth: 5};
                data.width = 3;
                data.arrowStrikethrough = false;
                if (!(data.from == data.to)){
                    do {
                        var capacity = prompt("Please enter capacity of new edge (whole number)", 4);
                        if((!Number.isInteger(parseInt(capacity))) || (capacity % 1 != 0)){
                            alert("Must be a whole number!");
                        } 
                    } while((!Number.isInteger(parseInt(capacity))) || (capacity % 1 != 0));
                    data.label = 0 + '/' + capacity;
                    callback(data);
                    edges = addEdge(edges, newEdgeID, data.from, data.to, capacity);
                } else {
                    alert("Cannot connect node to itself!");
                }
                newEdgeID++;
            },
            deleteNode: function (data, callback) {
                var nodeIds = data.nodes, i;
                nodes.splice(nodeIds[0] + 1, 1);
                for(i = nodeIds[0] + 1; i < nodes.length; i++){
                    nodes[i].id = i - 1;
                    nodes[i].label = "n" + (i-1);
                    topNodes.remove(i);
                }
                newNodeID--;
                topNodes.update(nodes);
                callback(data);
            },
            deleteEdge: function (data, callback) {
                var  edgeIds = data.edges, i;
                for(i = edgeIds[0] + 1; i < edges.length; i++){
                    edges[i].id = i - 1;
                    topEdges.remove(i);
                }
                edges.splice(edgeIds[0], 1);
                topEdges.update(edges);
                newEdgeID--;
                console.log(data);
                callback(data);
            }
        };
        topGraph.setOptions(options);
    }

}

function disableDrawingMode() {
    var drawBtnClass = document.getElementById('drawNew').className;
    var playbackBtnClass = document.getElementById('rewind_button').className;
    if(drawBtnClass == "waves-effect btn cyan disabled") {
        playbackBtnClass = "waves-effect waves-orange btn-flat";
        drawBtnClass = "waves-effect btn cyan";
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
        if (validGraph){ 
            loadNewGraph(createGraphFromUpload, data.nodes, data.edges);
        } else {
            document.getElementById("uploadFile").val = '';
        }
    }

    document.getElementById("uploadFile").addEventListener('change', onChange);

}());
/*****************************************************************************

  File for running and controlling the animation of the algorithm.

  Functions:

    (20)  animateGraph(steps)

    (70)  highlightAugmentingPath(path)

******************************************************************************/

var animationSteps = [];
var playState = PLAY;
step = 0;

var PLAY = 1,
    REWIND = -1,
    STEP_FOWARD = 2,
    STEP_BACKWARD = -2,
    PAUSE = 0;

/*
  Function: animateGraph(steps)

  Purpose:  When given an array of animation steps, iterates through each with
            a given interval, and updates the graphs on the page

*/
function animateAlgorithm(){
  var slider = document.getElementById("pb_slider");
  
  var id = setInterval(frame, (500 * (50/slider.value)));
//   console.log(animationSteps.length);
  function frame() {
    if(((step == animationSteps.length - 1) && (playState == PLAY)) || (playState == PAUSE)){
        clearInterval(id);
    } else if ((playState == PLAY) || (playState == REWIND)) {
        executeAnimationStep();
    }

  }
}

function selectNetwork(network){
    if(network == RES) { 
        return resEdges;
    } else if (network == TOP) { 
        return topEdges;
    } else if (network == null) {
        return null;
    }
}

function executeAnimationStep(){
    if ((playState == REWIND) || (playState == STEP_BACKWARD)){
        if (step > 0){
            step--;
        } else {
            playState = togglePlayPause();
        }
    } 
    
    var currentStep = animationSteps[step];
    var edgeID = currentStep.edgeID,
        network = currentStep.network,
        pStep = currentStep.pStep,
        outputID = currentStep.outputID,
        outputData = currentStep.outputData,
        edges;
    
    if(outputID != null) printTraceback(constructTracebackLine(outputID, outputData));
        
    if(network != null) {
        edges = selectNetwork(network);
    } else {
        if(playState > 0) {
            step++;
        }
        return;
    }

    

    switch(animationSteps[step].action){
        case("remove"):
            executeRemoveEdgeStep(edges, edgeID, currentStep);
            break;
        
        case("highlight"):
            executeHighlightEdgeStep(edges, edgeID, currentStep);
            break;
        
        case("label"):
            executeLabelEdgeStep(edges, edgeID, currentStep);
            break;
        
        case("add"):
            executeAddEdgeStep(edges, edgeID, currentStep);
            break;
        
        case("updateFlow"):
            updateFlowCounter(currentStep);
            pStep = animationSteps[step - 1].pStep;
            break;
        default:
            console.log("Error: invalid animation step");
            return;
    }

    highlightPseudocode(pStep);

    if(playState > 0) step++;

}

function executeRemoveEdgeStep(edges, edgeID, currentStep){
    // console.log("removing edge");
    if(playState > 0){
        currentStep.prevData = edges.get(edgeID);
        edges.remove(edgeID);
    } else if (playState < 0){
        edges.add(currentStep.prevData);
    }
}

function executeHighlightEdgeStep(edges, edgeID, currentStep){
    // console.log("highlighting edge");
    var edge_color;
    if(playState > 0){
        edge_color = currentStep.color;
        currentStep.prevData = edges.get(edgeID);
    } else if (playState < 0){
        var prevData = currentStep.prevData;
        edge_color = prevData.color;      
    }
    edges.update([{id: edgeID, color: edge_color}]);
}

function executeLabelEdgeStep(edges, edgeID, currentStep){
    // console.log("labeling edge");
    var label;
    if(playState > 0){
        currentStep.prevData = edges.get(edgeID);
        label = currentStep.label;
    } else if (playState < 0){
        var prevData = currentStep.prevData;
        label = prevData.label;
    }
    edges.update([{id: edgeID, label: label}]);
}

function executeAddEdgeStep(edges, edgeID, currentStep){
    // console.log("adding edge");
    if(playState > 0){
        var label = currentStep.label,
            from = currentStep.from,
            to = currentStep.to;
        edges.add({ 
            id: edgeID, label: label,
            color: {color: 'blue'}, width: 3,
            from: from, to: to,
            font: {strokeWidth: 5},
            arrows: {to: {enabled: true}},
            arrowStrikethrough: false
        });
    } else if (playState < 0){
        edges.remove(edgeID);
    }
}

function updateFlowCounter(currentStep){
    if(playState > 0) {
        currentStep.prevData = (document.getElementById("flow_counter").innerHTML).split(' ').pop();
        console.log(currentStep.prevData);
        document.getElementById("flow_counter").innerHTML = "Current flow: " + currentStep.m;
    } else if(playState < 0) {
        var prevData = currentStep.prevData;
        document.getElementById("flow_counter").innerHTML = "Current flow: " + prevData;
    }
}

function highlightPseudocode(pStep){
    var pseudocode = document.getElementsByClassName("pseudocode_step");
    for(var i = 0; i < pseudocode.length; i++) {
        pseudocode[i].style.color = "#212121";
        pseudocode[i].style.fontWeight = "normal";
    }
    pseudocode[pStep].style.color = "#FF9800";
    pseudocode[pStep].style.fontWeight = "900";
    if(pStep == 3) document.getElementById("flow_counter").innerHTML.replace("Current", "Maximum");
}
  
function addAnimationStep(network, action, edgeID, pStep, color, label, from, to, outputID, outputData){
    animationSteps.push({
        network, action, edgeID, pStep, color: {color:color},
        label, from, to, prevData: null,
        outputID, outputData
    });
}

function createHighlightAnimation(network, edgeID, pStep, color, outputID, outputData){
    if(outputID != null){
        addAnimationStep(network, "highlight", edgeID, pStep, color, null, null, null, outputID, outputData);
    } else {
        addAnimationStep(network, "highlight", edgeID, pStep, color);
    }
}

function createLabelEdgeAnimation(network, edgeID, pStep, label, outputID, outputData){
    addAnimationStep(network, "label", edgeID, pStep, null, label, null, null, outputID, outputData);
}

function createAddEdgeAnimation(network, edgeID, pStep, label, from, to, outputID, outputData){
    addAnimationStep(network, "add", edgeID, pStep, null, label, from, to, outputID, outputData);
}

function createRemoveEdgeAnimation(network, edgeID, pStep, outputID, outputData){
    addAnimationStep(network, "remove", edgeID, pStep, null, null, null, null, outputID, outputData);
}

function prepareOutputLine(outputID, outputData){
    addAnimationStep(null, null, null, null, null, null, null, null, outputID, outputData);
}

function printTraceback(line){
    var currentTB = document.getElementById('traceback').innerHTML;
    document.getElementById('traceback').innerHTML = currentTB + '<p class="caption traceback_line">' + line + '</p>';
    document.getElementById('traceback').scrollTop = document.getElementById('traceback').scrollHeight;
}

/*
  Function: highlightAugmentingPath(path)

  Purpose:  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path){
    var edgeID, edgeData;

    for(i = 1; i < path.length; i++){
        edgeData = findEdgeID(RES, path[i-1], path[i]);
        edgeID = edgeData.id;
        createHighlightAnimation(RES, edgeID, 1, 'red'/*, 8, [path[i-1], path[i]]*/);

            // edgeData = findEdgeID(TOP, path[i-1], path[i]);
            // edgeID = edgeData.id;
        // createHighlightAnimation(TOP, edgeID, 1, 'red');
    }
    addAnimationStep(null);
}

function constructTracebackLine(index, data){
    var txt;
    // console.log("index: " + index);
    switch(true){
        case(index == 0):
        txt = traceback[index].split("$");
        return txt[0] + data + txt[1] + data;

        case((1 <= index) && (index <= 3)):
        txt = traceback[index].split("$");
        return txt[0] + data;

        case((4 <= index) && (index <= 7)):
        return traceback[index];

        case((8 <= index) && (index <= 10)):
        txt = traceback[index].split("$");
        var from, to;
        if(data[0] == 0){
            from = "S";
        } else if(data[0] == T){
            from = "T";
        } else {
            from = data[0];
        }
        if(data[1] == 0){ 
            to = "S";
        } else if(data[1] == T){
            to = "T";
        } else {
            to = data[1];
        }
        return txt[0] + from + txt[1] + to;
        default:
        console.log("Error: traceback index out of bounds: " + index);
    }
}
  
var traceback = [
    "capacity - flow = $, adding forwards edge of value $",

    "flow > 0, adding backwards edge of value $",
    "adding forwards edge of value $",
    "augmenting path found: $",

    "searching for augmenting path...",
    "no augmenting path found",
    "Building residual graph...",
    "Updating residual graph...",

    "augmenting edge between nodes $ and $",
    "augmenting forwards edge between nodes $ and $",
    "decrementing backwards edge between nodes $ and $",
];
  


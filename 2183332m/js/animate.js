/*****************************************************************************

  File for running and controlling the animation of the algorithm.

  Functions:

    (55)  animateAlgorithm(steps)

    (75)  selectNetworkEdges(networkID)
    (90)  executeAnimationStep()
    (155 - 260)  step execution functions

    (275 - 370)  step creation/preparation functions

******************************************************************************/
var animationSteps = [];
var playState = PLAY;
step = 0;
var PLAY = 1,
    REWIND = -1,
    STEP_FORWARD = 2,
    STEP_BACKWARD = -2,
    PAUSE = 0;

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

/*
  When given an array of animation steps, iterates and executes each
            step with a specified time interval between
*/
function animateAlgorithm(){
  var slider = document.getElementById("pb_slider");
  var id = setInterval(frame, (500 * (50/slider.value)));
  function frame() {
    if(((step == animationSteps.length - 1) && (playState == PLAY)) || (playState == PAUSE)){
        clearInterval(id);
    } else if ((playState == PLAY) || (playState == REWIND)) {
        executeAnimationStep();
    }
  }
}

/*
    Given a networkID (TOP or RES), returns topEdges or resEdges for
            manipulation. If networkID is null the edges aren't being manipulated
            at this stage, so returns null.
*/
function selectNetworkEdges(networkID){
    if(networkID == RES) {
        return resEdges;
    } else if (networkID == TOP) {
        return topEdges;
    } else if (networkID == null) {
        return null;
    }
}

/*
    Extracts data from the current animation step, and executes the action
                for that step. Increments or decrements the animationSteps index, depending
                on playState.
*/
function executeAnimationStep(){
    if ((playState == REWIND) || (playState == STEP_BACKWARD)){
        if (step > 0) step--; else playState = togglePlayPause();
    }
    var currentStep = animationSteps[step];
    var edgeID = currentStep.edgeID,
        network = currentStep.network,
        pStep = currentStep.pStep,
        outputID = currentStep.outputID,
        outputData = currentStep.outputData,
        edges;

    if(outputID != null) printTraceback(constructTracebackLine(outputID, outputData));

    if(network != null) edges = selectNetworkEdges(network);
    else {
        if((playState == PLAY) || (playState == STEP_FORWARD)) step++;
        return;
    }

    switch(animationSteps[step].action){
        case("reveal"):
            if((playState == PLAY) || (playState == STEP_FORWARD)) {
                revealResidualGraph();
            } else if ((playState == REWIND) || (playState == STEP_BACKWARD)) {
                resetCanvas();
            }
            break;

        case("remove"):
            executeRemoveEdgeStep(edges, edgeID, currentStep);
            break;

        case("highlight"):
            executeHighlightEdgeStep(edges, edgeID, currentStep);
            break;

        case("dash"):
            executeDashEdgeStep(edges, edgeID, currentStep);
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
    if((playState == PLAY) || (playState == STEP_FORWARD)) step++;

}

/**
 * ========================================================================================
 *  Execution functions: One for each action an animation step may contain, as well as
 *                       two for highlighting the relevant line of pseudocode and printing
 *                       a line for the execution trace.
 */
function executeRemoveEdgeStep(edges, edgeID, currentStep){
    if((playState == PLAY) || (playState == STEP_FORWARD)){
        currentStep.prevData = edges.get(edgeID);
        edges.remove(edgeID);
    } else if ((playState == REWIND) || (playState == STEP_BACKWARD)){
        edges.add(currentStep.prevData);
    }
}

function executeHighlightEdgeStep(edges, edgeID, currentStep){
    var edge_color, dashBool;
    if((playState == PLAY) || (playState == STEP_FORWARD)){
        edge_color = currentStep.color;
        dashBool = false;
        currentStep.prevData = edges.get(edgeID);
    } else if ((playState == REWIND) || (playState == STEP_BACKWARD)){
        var prevData = currentStep.prevData;
        edge_color = prevData.color;
        dashBool = prevData.dashes;
    }
    edges.update([{id: edgeID, color: edge_color, dashes: dashBool}]);
}

function executeDashEdgeStep(edges, edgeID, currentStep){
    var dashBool;
    if((playState == PLAY) || (playState == STEP_FORWARD)){
      dashBool = currentStep.dash;
      currentStep.prevData = !dashBool;
    } else if ((playState == REWIND) || (playState == STEP_BACKWARD)) {
      dashBool = currentStep.prevData;
    }
    edges.update([{id: edgeID, dashes: dashBool}]);
}

function executeLabelEdgeStep(edges, edgeID, currentStep){
    var label;
    if((playState == PLAY) || (playState == STEP_FORWARD)){
        currentStep.prevData = edges.get(edgeID);
        label = currentStep.label;
    } else if ((playState == REWIND) || (playState == STEP_BACKWARD)){
        var prevData = currentStep.prevData;
        label = prevData.label;
    }
    edges.update([{id: edgeID, label: label}]);
}

function executeAddEdgeStep(edges, edgeID, currentStep){
    if((playState == PLAY) || (playState == STEP_FORWARD)){
        var label = currentStep.label,
            from = currentStep.from,
            to = currentStep.to;
        edges.add({
            id: edgeID, label: label,
            color: {color: '#0097A7'}, width: 3,
            from: from, to: to,
            font: {strokeWidth: 5},
            arrows: {to: {enabled: true}},
            arrowStrikethrough: false
        });
    } else if ((playState == REWIND) || (playState == STEP_BACKWARD)){
        edges.remove(edgeID);
    }
}

function updateFlowCounter(currentStep){
    if((playState == PLAY) || (playState == STEP_FORWARD)) {
        currentStep.prevData = (document.getElementById("flow_counter").innerHTML).split(' ').pop();
        document.getElementById("flow_counter").innerHTML = "Current flow: " + currentStep.m;
    } else if((playState == REWIND) || (playState == STEP_BACKWARD)) {
        var prevData = currentStep.prevData;
        document.getElementById("flow_counter").innerHTML = "Current flow: " + prevData;
    }
}

function revealResidualGraph(){
    var top_graph = document.getElementById("top_graph"), res_graph = document.getElementById("res_graph");
    top_graph.style.height = '50%';
    res_graph.style.height = '50%';

    resGraph = new vis.Network(resContainer, resData, options);
    topGraph = new vis.Network(mainContainer, topData, options);
    topGraph.fit();
    resGraph.fit();
    addDragListener();
    step++;
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

function printTraceback(line){
    var currentTB = document.getElementById('traceback').innerHTML;
    document.getElementById('traceback').innerHTML = currentTB + '<p class="caption traceback_line">' + line + '</p>';
    document.getElementById('traceback').scrollTop = document.getElementById('traceback').scrollHeight;
}

/*
    End of execution functions
    ==============================================================================================

    Step creation functions:    All individual functions format their arguments to call
                                addAnimationStep, which pushes the arguments to the animationSteps
                                array as an object.

                                highlightAugmentingPath(), leavePathHighlighted(), and
                                constructTracebackLine() use the individual functions to push
                                larger groups of steps to the array.

*/

function addAnimationStep(network, action, edgeID, pStep, color, label, from, to, dash, outputID, outputData){
    animationSteps.push({
        network, action, edgeID, pStep, color: {color:color}, label, from, to, prevData: null, dash, outputID, outputData
    });
}

function createHighlightAnimation(network, edgeID, pStep, color, outputID, outputData){
    addAnimationStep(network, "highlight", edgeID, pStep, color, null, null, null, null,outputID, outputData);
}

function createDashEdgeAnimation(network, edgeID, pStep, dash, outputID, outputData){
    addAnimationStep(network, "dash", edgeID, pStep, null, null, null, null, dash, outputID, outputData);
}

function createLabelEdgeAnimation(network, edgeID, pStep, label, outputID, outputData){
    addAnimationStep(network, "label", edgeID, pStep, null, label, null, null, null, outputID, outputData);
}

function createAddEdgeAnimation(network, edgeID, pStep, label, from, to, outputID, outputData){
    addAnimationStep(network, "add", edgeID, pStep, null, label, from, to, null, outputID, outputData);
}

function createRemoveEdgeAnimation(network, edgeID, pStep, outputID, outputData){
    addAnimationStep(network, "remove", edgeID, pStep, null, null, null, null, null, outputID, outputData);
}

function prepareOutputLine(outputID, outputData){
    addAnimationStep(null, null, null, null, null, null, null, null, null, outputID, outputData);
}

/*
  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path){
    var edgeID, edgeData;
    for(i = 1; i < path.length; i++){
        // edgeData = getEdgeData(RES, path[i-1], path[i]);
        edgeID = resAdjMatrix[path[i-1]][path[i]]; //changed from edgeData.id;
        createHighlightAnimation(RES, edgeID, 3, '#FF9800');
    }
    addAnimationStep(null);
}

function leavePathHighlighted(path){
    var pathEdges = [];
    for(var i = 1; i < path.length; i++){
        pathEdges.push(resAdjMatrix[path[i-1]][path[i]]);
    }
    var resEdgeIDs = algResEdges.getIds();
    for(i = 0; i < resEdgeIDs.length; i++ ){
        var isInPath = false;
        for(var j=0; j < pathEdges.length; j++){
            if(resEdgeIDs[i] == pathEdges[j]) isInPath = true;
        }
        if(!isInPath) createHighlightAnimation(RES, resEdgeIDs[i], 3, '#0097A7');
    }
}

function constructTracebackLine(index, data){
    var txt;
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

/**
 *  End of step creation functions
 *  ===============================================================================================
 */

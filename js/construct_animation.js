function addAnimationStep(network, action, edgeID, pStep, color, label, from, to, outputID, outputData){
    animationSteps.push({
        network, action, edgeID, pStep, color: {color:color},
        label, from, to, orig_edge: null,
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

/*
  Function: highlightAugmentingPath(path)

  Purpose:  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path){
    var edgeID, edgeData;

    prepareOutputLine(4);
    for(i = 1; i < path.length; i++){
        edgeData = findEdgeID(RES, path[i-1], path[i]);
        edgeID = resAdjMatrix[path[i-1]][path[i]];
        createHighlightAnimation(RES, edgeID, 1, 'red', 8, [path[i-1], path[i]]);

        edgeData = findEdgeID(TOP, path[i-1], path[i]);
        edgeID = topAdjMatrix[path[i-1]][path[i]];
        createHighlightAnimation(TOP, edgeID, 1, 'red');
    }
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
]
  
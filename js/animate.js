/*****************************************************************************

  File for running and controlling the animation of the algorithm.

  Functions:

    (20)  animateGraph(steps)

    (70)  highlightAugmentingPath(path)

******************************************************************************/

var animationSteps = [];
var play = 1;
step = 0;

/*
  Function: animateGraph(steps)

  Purpose:  When given an array of animation steps, iterates through each with
            a given interval, and updates the graphs on the page

*/
function animateAlgorithm(){
  var slider = document.getElementById("pb_slider");
  slider.oninput = function() {
    play = 0;
    play = 1;
  }
  var id = setInterval(frame, (1000 * (10/slider.value)));
  function frame() {
    if(((step == animationSteps.length)&&(play == 1)) || play == 0){
      clearInterval(id);
    } else {
      if(play == 1){
        animateStep();
      } else if (play == -1){
        backwardStep();
      }
    }

  }
}

function indicateGraph(graph){
  if(graph == "top") {
    document.getElementById("res_ind").style.backgroundColor = "white";
    document.getElementById("main_ind").style.backgroundColor = "#e03c4c";
  } else if (graph == "res"){
    document.getElementById("main_ind").style.backgroundColor = "white";
    document.getElementById("res_ind").style.backgroundColor = "#e03c4c";
  } else {
    document.getElementById("main_ind").style.backgroundColor = "white";
    document.getElementById("res_ind").style.backgroundColor = "white";
  }

}

function animateStep(){
  var edgeID = animationSteps[step].edgeID,
      network = animationSteps[step].network,
      pStep = animationSteps[step].pStep,
      tracebackID = animationSteps[step].tracebackID,
      tracebackData = animationSteps[step].tracebackData,
      edges;
  if(network == "res") { 
    edges = resEdges;
  } else if (network == "top") { 
    edges = topEdges;
  }
  if(tracebackID != null) console.log(constructTracebackLine(tracebackID, tracebackData));

  if(edgeID == null) {
    step++;
    return;
  }

  switch(animationSteps[step].action){
    case("remove"):
      // console.log("remove");
      animationSteps[step].orig_edge = edges.get(edgeID);
      edges.remove(edgeID);
      break;

    case("highlight"):
      // console.log("highlight");
      var edge_color = animationSteps[step].colour;
      animationSteps[step].orig_edge = edges.get(edgeID);
      edges.update([{id:edgeID, color:edge_color}]);
      break;

    case("label"):
      // console.log("label");
      var label = animationSteps[step].label;
      animationSteps[step].orig_edge = edges.get(edgeID);
      edges.update([{id: edgeID, label: label}]);
      break;

    case("add"):
      // console.log("add");
      var label = animationSteps[step].label,
          from = animationSteps[step].from,
          to = animationSteps[step].to;
      resEdges.add({
        id: edgeID, label: label,
        color: {color: 'blue'},
        from: from, to: to,
        arrows: {to: {enabled: true}}
      });
      break;
    case("updateFlow"):
      pStep = animationSteps[step -1].pStep;
      document.getElementById("flow_counter").innerHTML = "Current flow: " + animationSteps[step].m;

    case("finish"):
      // indicateGraph("neither");
      break;
    default:
      console.log("Error: Invalid animation step");
      clearInterval(id);
  }
  highlightPseudocode(pStep);
  step++;
}

function backwardStep(){
  if(step > 0) {
    step--;
    var currentStep = animationSteps[step];
    var edgeID = currentStep.edgeID,
        network = currentStep.network,
        orig_edge = currentStep.orig_edge,
        pStep = animationSteps[step].pStep,
        edges;
    if(network == "res") edges = resEdges; else if (network == "top") edges = topEdges;
    if(edgeID == null) {
      step--;
      return;
    }
    switch(currentStep.action){
      case("remove"):
        edges.add(orig_edge);
        break;

      case("highlight"):
        var edge_color = orig_edge.color;
        edges.update([{id:edgeID, color:edge_color}]);
        break;

      case("label"):
        var label = orig_edge.label;
        edges.update([{id: edgeID, label: label}]);
        break;

      case("add"):
        edges.remove(edgeID);
        break;

      case("updateFlow"):
        pStep = animationSteps[step -1].pStep;
        document.getElementById("flow_counter").innerHTML = "Current flow: " + animationSteps[step].m;
        break;

      case("finish"):
        break;
      default:
        console.log("Error: Invalid animation step: " + currentStep.action);
        clearInterval(id);
    }
    highlightPseudocode(pStep);
  } else {
    play = 0;
  }

}

function highlightPseudocode(pStep){
  var pseudocode = document.getElementsByClassName("pseudocode_step");
  for(var i = 0; i < pseudocode.length; i++) pseudocode[i].style.color = "black";
  pseudocode[pStep].style.color = "#c0d6ba";
  if(pStep == 3) document.getElementById("flow_counter").innerHTML.replace("Current", "Maximum");
}

function addAnimationStep(network, action, edgeID, pStep, colour, label, from, to, tracebackID, tracebackData){
  animationSteps.push({
    network, action, edgeID, pStep, colour: {color:colour},
    label, from, to, orig_edge: null,
    tracebackID, tracebackData
  });
}

function createHighlightAnimation(network, edgeID, pStep, colour, tracebackID, tracebackData){
  if(tracebackID != null){
    addAnimationStep(network, "highlight", edgeID, pStep, colour, null, null, null, tracebackID, tracebackData);
  } else {
    addAnimationStep(network, "highlight", edgeID, pStep, colour);
  }
}

function createLabelEdgeAnimation(network, edgeID, pStep, label, tracebackID, tracebackData){
  addAnimationStep(network, "label", edgeID, pStep, null, label, null, null, tracebackID, tracebackData);
}

function createAddEdgeAnimation(network, edgeID, pStep, label, from, to, tracebackID, tracebackData){
  addAnimationStep(network, "add", edgeID, pStep, null, label, from, to, tracebackID, tracebackData);
}

function createRemoveEdgeAnimation(network, edgeID, pStep, tracebackID, tracebackData){
  addAnimationStep(network, "remove", edgeID, pStep, null, null, null, null, tracebackID, tracebackData);
}

function printTracebackLine(tracebackID, tracebackData){
  addAnimationStep(null, null, null, null, null, null, null, null, tracebackID, tracebackData);
}



/*
  Function: highlightAugmentingPath(path)

  Purpose:  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path){
  var edgeID, edgeData;

  for(i = 1; i < path.length; i++){
    edgeData = findEdgeID("res", path[i-1], path[i]);
    edgeID = edgeData.id;
    createHighlightAnimation("res", edgeID, 1, 'red', 8, [path[i-1], path[i]]);

    edgeData = findEdgeID("top", path[i-1], path[i]);
    edgeID = edgeData.id;
    createHighlightAnimation("top", edgeID, 1, 'red');
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

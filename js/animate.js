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
  console.log("animating...");
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

function animateStep(){
  var edgeID = animationSteps[step].edgeID,
      network = animationSteps[step].network,
      pStep = animationSteps[step].pStep,
      edges;
  if(network == "res") edges = resEdges; else if (network == "top") edges = topEdges;
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
        edges;
    if(network == "res") edges = resEdges; else if (network == "top") edges = topEdges;
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

      default:
        console.log("Error: Invalid animation step");
        clearInterval(id);
    }
  } else {
    play = 0;
  }

}

function highlightPseudocode(pStep){
  var pseudocode = document.getElementsByClassName("pseudocode_step");
  for(var i = 0; i < pseudocode.length; i++) pseudocode[i].style.color = "black";
  pseudocode[pStep].style.color = "#c0d6ba";
}

function addAnimationStep(network, action, edgeID, pStep, colour, label, from, to){
  animationSteps.push({
    network, action, edgeID, pStep, colour: {color:colour},
    label, from, to, orig_edge: null
  });
}

/*
  Function: highlightAugmentingPath(path)

  Purpose:  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path, colour){
  var edgeID;

  for(i = 1; i < path.length; i++){
    var edgeData = findEdgeID("res", path[i-1], path[i]);
    edgeID = edgeData.id;
    addAnimationStep("res", "highlight", edgeID, 1, colour, null, null, null);
  }
}

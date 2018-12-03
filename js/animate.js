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
function animateGraph(){
  console.log("animating...");
  var slider = document.getElementById("pb_slider");
  var id = setInterval(frame, (1000 * (10/slider.value)));
  function frame() {
    if(step == animationSteps.length || play == 0){
      clearInterval(id);
    } else {
      var edgeID = animationSteps[step].edgeID,
          network = animationSteps[step].network,
          pStep = animationSteps[step].pStep;
      var pseudocode = document.getElementsByClassName("pseudocode_step");

      switch(animationSteps[step].action){
        case("remove"):
          resEdges.remove(edgeID);
          if(pStep == 0) {
            pseudocode[2].style.color = "black";
          } else {
            pseudocode[pStep - 1].style.color = "black";
          }
          pseudocode[pStep].style.color = "#c0d6ba";
          break;

        case("highlight"):
          var edge_color = animationSteps[step].colour;
          if(network == "top"){
            topEdges.update([{id:edgeID, color:edge_color}]);
          } else if (network == "res"){
            resEdges.update([{id:edgeID, color:edge_color}]);
          }
          if(pStep == 0) {
            pseudocode[2].style.color = "black";
          } else {
            pseudocode[pStep - 1].style.color = "black";
          }
          pseudocode[pStep].style.color = "#c0d6ba";
          break;

        case("label"):
          var label = animationSteps[step].label;
          if(network == "top"){
            topEdges.update([{id: edgeID, label: label}]);
          } else if (network == "res"){
            resEdges.update([{id: edgeID, label: label}]);
          }
          if(pStep == 0) {
            pseudocode[2].style.color = "black";
          } else {
            pseudocode[pStep - 1].style.color = "black";
          }
          pseudocode[pStep].style.color = "#c0d6ba";
          break;

        case("add"):
          var label = animationSteps[step].label,
              from = animationSteps[step].from,
              to = animationSteps[step].to;
          resEdges.add([{
            id: edgeID,
            label: label,
            from: from,
            to: to,
            arrows: {
              to: {enabled: true}
            }
          }]);
          if(pStep == 0) {
            pseudocode[2].style.color = "black";
          } else {
            pseudocode[pStep - 1].style.color = "black";
          }
          pseudocode[pStep].style.color = "#c0d6ba";
          break;

        default:
          console.log("Error: Invalid animation step");
          clearInterval(id);
      }
      step++;
    }

  }
  console.log("Finished");
}

// function backStep(){
//   if (step != 1){
//     var aStep = animationSteps[step];
//     var edgeID = aStep.edgeID,
//         network = aStep.network;
//
//     switch(aStep.action){
//       case("destroyRes"):
//         resEdges.update(aStep.old_edges);
//         break;
//
//       case("highlight"):
//         var edge_color = aSteps.orig_colour;
//         if(network == "topGraph"){
//           topEdges.update([{id:edgeID, color:edge_color}]);
//         } else if (network == "residualGraph"){
//           resEdges.update([{id:edgeID, color:edge_color}]);
//         }
//         document.getElementById("step3").style.color = "black";
//         document.getElementById("step2").style.color = "#c0d6ba";
//         break;
//
//       case("label"):
//         var label = animationSteps[step].orig_label;
//         topEdges.update([{id: edgeID, label: label}]);
//         break;
//
//       case("add"):
//         resEdges.remove(edgeID);
//         document.getElementById("step2").style.color = "black";
//         document.getElementById("step3").style.color = "#c0d6ba";
//         break;
//     }
//     step--;
//   }
// }


function animateHighlightEdge(network, edgeID, pStep, colour){
  animationSteps.push({
    network: network,
    action: "highlight",
    edgeID: edgeID,
    pStep: pStep,
    colour: {color:colour}
  });
}
function animateLabelEdge(network, edgeID, pStep, label){
  animationSteps.push({
      network: network,
      action: "label",
      label: label,
      pStep: pStep,
      edgeID: edgeID
  });
}
function animateRemoveEdge(network, edgeID, pStep){
  animationSteps.push({
      network: network,
      action: "remove",
      pStep: pStep,
      edgeID: edgeID
  });
}
function animateAddEdge(network, edgeID, pStep, label, from, to){
  animationSteps.push({
    network: network,
    action: "add",
    label: label,
    edgeID: edgeID,
    pStep: pStep,
    from: from,
    to: to
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
    var edgeData = findEdgeID(0, path[i-1], path[i]);
    edgeID = edgeData.id;
    animateHighlightEdge("res", edgeID, 1, colour);
  }
}

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
function animateGraph(steps){
  console.log("animating...");
  var id = setInterval(frame, 1000);
  function frame() {
    if(step == steps.length || play == 0){
      clearInterval(id);
    } else {
      var edge_id = steps[step].edge_id,
          network = steps[step].network;

      switch(steps[step].action){
        case("destroyRes"):
          resEdges.clear();
          break;

        case("highlight"):
          var edge_color = steps[step].colour;
          if(network == "topGraph"){
            topEdges.update([{id:edge_id, color:edge_color}]);
          } else if (network == "residualGraph"){
            resEdges.update([{id:edge_id, color:edge_color}]);
          }
          document.getElementById("step3").style.color = "black";
          document.getElementById("step2").style.color = "#c0d6ba";
          break;

        case("label"):
          var label = steps[step].label;
          topEdges.update([{id: edge_id, label: label}]);
          break;

        case("add"):
          var label = steps[step].label,
              from = steps[step].from,
              to = steps[step].to;
          resEdges.add([{
            id: edge_id,
            label: label,
            from: from,
            to: to,
            arrows: {
              to: {enabled: true}
            }
          }]);
          document.getElementById("step2").style.color = "black";
          document.getElementById("step3").style.color = "#c0d6ba";
          break;

        default:
          console.log("Error: Invalid animation step");
          clearInterval(id);
      }
      step++;
    }
  }
}


/*
  Function: highlightAugmentingPath(path)

  Purpose:  Given an array of nodes which form the augmenting path, pushes a
            new animation step to highlight the edges between the nodes

*/
function highlightAugmentingPath(path){
  var edge_id, colour;

  for(i = 1; i < path.length; i++){
    var edgeData = findEdgeID(algResData, path[i-1], path[i]);
    edge_id = edgeData.id;
    // if(edgeData.direction == 1){
    //   colour = {color:'red'};
    // }

    // if(edgeData.direction == 0){
    //   colour = {color:'green'};
    // }

    animationSteps.push({
      network: "residualGraph",
      action: "highlight",
      edge_id: edge_id,
      colour: {color:'red'},
      pStep: "step4",
    });
  }
}

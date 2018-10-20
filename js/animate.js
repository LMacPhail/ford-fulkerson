
function animate(steps){
  console.log("I'm in animate");

  var i = 0, id = setInterval(frame, 2000);
  function frame() {
    if(i == steps.length){
      clearInterval(id);
    } else {
      var changingNetwork = steps[i].network;
      if(changingNetwork == "network"){
        network.setData(steps[i].data);
      } else if (changingNetwork == "residualGraph"){
        residualGraph.setData(steps[i].data);
      }
      i++;
    }
  }
}

var test = true;

var options = {
  layout: {
    improvedLayout:true,
    hierarchical: { enabled: false, nodeSpacing: 300}
  },
  interaction: { hover: true },
  manipulation: { enabled: false },
  physics: { stabilization: { fit: true }}
};

// for(N = 30; N < 40; N++){
//   $('body').append('<p>With '+ N + ' nodes:</p>');
//   testFF(100);
// }
N = 30;
testFF(7000);


function testFF(iter){
  // N = 26;
  var FFMaxFlow, cutMaxFlow, cut = [], incorrect = 0, i;
  var notBroken = true;
  var topEdgeText, resEdgeText;
  for(i = 0; i < iter; i++){
    generateRandomGraph();
    FFMaxFlow = fordFulkerson();
    cut = findMinimumCut();
    // $('body').append('<p>Ford Fulkerson maximum flow = ' + FFMaxFlow + '</p>');
    // $('body').append('<p>Minimum cut found = ' + cut + '</p>');
    cutMaxFlow = removeEdgesInCut(cut);
    // $('body').append('<p>Minimum cut flow = ' + cutMaxFlow + '</p>');
    if(!(cutMaxFlow == FFMaxFlow)) {
      $('body').append('<p>Minimum cut flow = ' + cutMaxFlow + '</p>');
      $('body').append('<p>Ford Fulkerson maximum flow = ' + FFMaxFlow + '</p>');

      console.log(algTopEdges);
      console.log(algResEdges);
      console.log(resAdjMatrix);
      // notBroken = false;
      incorrect++;
    }
    // notBroken = false;
  }
  $('body').append('<p>Percentage incorrect = ' + (incorrect / iter)*100 + '</p>');
}

function removeEdgesInCut(cut) {
  var cutFlow = 0;
  for(var i = 0; i < cut.length; i++) {
    var edge = algTopEdges.get(cut[i]);
    cutFlow += parseInt(getCapacity(edge.label));
    // algTopEdges.remove(cut[i]);
  }
  return cutFlow;
}
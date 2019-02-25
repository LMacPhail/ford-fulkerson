function testFF(iter){
  // N = 26;
  var FFMaxFlow, cutMaxFlow, cut = [], incorrect = 0;
  for(var i = 0; i < iter; i++){
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
      // $('body').append('<p>Minimum cut weight == maximum flow</p>');
      // $('body').append('<p>Ford Fulkerson algorithm has failed</p>');
      incorrect++;
    }
  }
  $('body').append('<p>Percentage incorrect = ' + (incorrect / iter)*100 + '</p>');
}

function removeEdgesInCut(cut) {
  var cutFlow = 0;
  for(var i = 0; i < cut.length; i++) {
    var edge = algTopEdges.get(cut[i]);
    cutFlow += parseInt(getCapacity(edge.label));
    algTopEdges.remove(cut[i]);
  }
  return cutFlow;
}

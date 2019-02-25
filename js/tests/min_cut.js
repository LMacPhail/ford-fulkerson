function testFF(iter){
  N = 30;
  for(var i = 0; i < iter; i++){
    generateRandomGraph();
    console.log(fordFulkerson());
    console.log(findMinimumCut());
  }
}



var uploadModal = document.getElementById('uploadModal');


window.onclick = function(event) {
    if( event.target == uploadModal) {
        uploadModal.style.display = "none";
    }
}


function downloadGraphAsTxt(filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(createTxtFileFromGraph()));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function createTxtFileFromGraph(){
    var node, edge, i;
    var text = "{\n\"nodes\" : ["
    for (i = 0; i < topNodes.length; i++){
        node = topNodes.get(i);
        text += "\n{ \"id\": " + i + ", \"x\": " + node.x + ", \"y\": " + node.y + "}";
        if(i < topNodes.length-1) text += ",";
    }
    text += "\n],\n\"edges\" : [";
    for (i = 0; i < topEdges.length; i++) {
        edge = topEdges.get(i);
        text += "\n{ \"from\": " + edge.from + ", \"to\": " + edge.to + ", \"capacity\": " + getCapacity(edge.label) + "}";
        if(i < topEdges.length-1) text += ",";
    }
    text += "\n]\n}"
    console.log(text);
    return text;
}

(function(){
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event) {
        console.log(event.target.result);
        var data = JSON.parse(event.target.result);
        createGraphFromUpload(data.nodes, data.edges);
    }

    function createGraphFromUpload(fileNodes, fileEdges){
        initialiseMatrices();
        nodes = [], edges = [];
        var node, edge, i, label;
        N = fileNodes.length;
        T = N -1;
        E = fileEdges.length;
        for(i = 0; i < N; i++){
            node = fileNodes[i];
            if(i == 0) {
                label = 'S'
            } else if (i == T) {
                label = 'T'
            } else {
                label = 'n' + i
            }
            nodes = addNode(nodes, i, label, node.x, node.y);
        }
        for(i = 0; i < E; i++){
            edge = fileEdges[i];
            edges = addEdge(edges, i, edge.from, edge.to, edge.capacity);
        }
        console.log(nodes);
        console.log(edges);
        initialiseDataSets(nodes, edges);
        topGraph.setData(topData);
        resGraph.setData(resData);
        animationSteps = [];
        fordFulkerson();
        step = 0;

    }

    document.getElementById("uploadFile").addEventListener('change', onChange);

}());

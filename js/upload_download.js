

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
        text += "\n{ \"from\": " + edge.from + ", \"to\": " 
                + edge.to + ", \"capacity\": " + getCapacity(edge.label) + "}";
        if(i < topEdges.length-1) text += ",";
    }
    text += "\n]\n}"
    return text;
}

(function(){
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event) {
        try {
            var data = JSON.parse(event.target.result);
        } catch(err) {
            alert("Parsing error: " + err);
            document.getElementById("uploadFile").val = '';
            return;
        }
        // var validData = checkValidData(data);
        var validGraph = checkValidGraph(data.nodes, data.edges);
        if (validGraph){ 
            createGraphFromUpload(data.nodes, data.edges);
        } else {
            document.getElementById("uploadFile").val = '';
        }
    }

    function createGraphFromUpload(fileNodes, fileEdges){
        disableDrawingMode();
        nodes = [], edges = [];
        var node, edge, i, label;
        N = fileNodes.length;
        T = N -1;
        E = fileEdges.length;
        
        initialiseMatrices();
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
        initialiseDataSets(nodes, edges);
        setNewGraph();
    }
    document.getElementById("uploadFile").addEventListener('change', onChange);

}());

function isBetween(comp, lower, upper){
    if((comp >= lower) && (comp < upper)) return true; else return false;
}

function checkValidGraph(fileNodes, fileEdges){
    var nl = fileNodes.length, el = fileEdges.length;

    if(!checkNodesAndEdgesExist(nl, el)) return false;
    if(!checkNodeIdsConsecutive(fileNodes)) return false;
    
    var edge, invalidEdges = [], i;
    
    var testMatrix = [];
    for(var y = 0; y < nl; y++){
        testMatrix[y] = [];
        for(var x = 0; x < nl; x++){
          testMatrix[y][x] = null;
        }
    }
    
    for(i = 0; i < el; i++) {
        edge = fileEdges[i];
        if(!(isBetween(edge.to, 0, nl)) || !(isBetween(edge.from, 0, nl))) {
            invalidEdges.push({id:i, problem: " is going to or from a node that doesn't exist!"});
        }
        if(edge.to == edge.from) invalidEdges.push({id:i, problem: " is going to and from the same node!"});
        if(edge.capacity <= 0) invalidEdges.push({id: i, problem: " must have a capacity greater than 0!"});
        
        if(findDuplicateEdges(testMatrix, edge.from, edge.to) == 1) {
            invalidEdges.push({id: i, problem: " is a duplicate edge!"});
        }
        testMatrix[edge.from][edge.to] = i;
    }
    if(invalidEdges.length > 0) {
        var errorMsg = "Invalid edges!\n";
        for (i in invalidEdges){
            errorMsg += "edge " + (invalidEdges[i].id + 1).toString() + invalidEdges[i].problem + "\n";
        }
        alert(errorMsg);
        return false;
    }
    return true;
}

function checkNodesAndEdgesExist(n, e){
    if((n == 0) && (e == 0)) {
        alert("no nodes or edges in file!");
        return false;
    } else if (e == 0) {
        alert("no edges in file!");
        return false;
    } else if (n == 0) {
        alert("no nodes in file!");
        return false;
    } else {
        return true;
    }
}

function checkNodeIdsConsecutive(nodes){
    for(var i = 0; i < nodes.length; i++) if (nodes[i].id != i) return false;
    return true;
}
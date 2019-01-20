var drawingEnabled = true;
var nodeID;

function draw(){
    destroy();

    nodeID = 1;
    nodes = [];
    addNode(nodes, 0, 'S', -300, 0);
    addNode(nodes, -1, 'T', 300, 0);

    edges = [];

    // TODO change this to use initialiseDataSets when it works
    initialiseDataSets(nodes, edges);
    console.log(topData);
    var mainContainer = document.getElementById('top_graph');
    var options = {
        
        manipulation: {
            addNode: function (data, callback) {
                data.id = nodeID;
                data.label = "n" + nodeID.toString();
                nodeID++;
                callback(data);
                // document.getElementById('saveNodeButton').onclick = saveData.bind(this, data, callback);
                // document.getElementById('cancelButton').onclick = clearPopUp.bind();
            },
            addEdge: function (data, callback) {
                document.getElementById('saveEdgeButton').onclick = saveEdgeData.bind(this, data, callback);
                // console.log(data.id);
                
            }
        }
    };
    topGraph = new vis.Network(mainContainer, topData, options);


}

function destroy() {
    if (topGraph !== null) {
      topGraph.destroy();
      topGraph = null;
    }
}
function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveEdgeData(data, callback) {
    data.id = nodeID;
    data.arrows = {to: {enabled: true}};
    data.label = 0 + '/' + document.getElementById('newEdgeCapacity').value;
    if (data.from == data.to) {
        var r = confirm("Do you want to connect the node to itself?");
        if (r == true) {
            callback(data);
        }
    } else {
        callback(data);
    }
}

function saveData(data,callback) {
    data.id = nodeID;
    data.label = "n" + nodeID.toString();
    nodeID++;
    callback(data);
}

function init() {
    setDefaultLocale();
    draw();
}
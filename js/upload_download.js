

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
    var text = "nodes = ["
    for (i = 0; i < topNodes.length; i++){
        node = topNodes.get(i);
        text += "\n{ id: " + i + ", x: " + node.x + ", y: " + node.y + "},";
    }
    text += "\n]\nedges = [";
    for (i = 0; i < topEdges.length; i++) {
        edge = topEdges.get(i);
        text += "\n{ from: " + edge.from + ", to: " + edge.to + ", capacity: " + getCapacity(edge.label) + "},";
    }
    text += "\n]"
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
    }

    document.getElementById("uploadFile").addEventListener('change', onChange);



}());

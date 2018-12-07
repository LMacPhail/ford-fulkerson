

var uploadModal = document.getElementById('uploadModal');
var openUpload = document.getElementById("upload_graph");
var span = document.getElementsByClassName("close")[0];

openUpload.onclick = function() {
    uploadModal.style.display = "block";
}

span.onclick = function() {
    uploadModal.style.display = "none";
}

window.onclick = function(event) {
    if( event.target == uploadModal) {
        uploadModal.style.display = "none";
    }
}


function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


var uploadModal = document.getElementById('uploadModal');
var openUpload = document.getElementById("upload_graph");
var span = document.getElementsByClassName("close")[0];

openUpload.onclick = function() {
    uploadModal.style.display = "block";
}

// span.onclick = function() {
//     uploadModal.style.display = "none";
// }

// window.onclick = function(event) {
//     if( event.target == uploadModal) {
//         uploadModal.style.display = "none";
//     }
// }
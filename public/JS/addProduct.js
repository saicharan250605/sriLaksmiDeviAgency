let imageFile = document.querySelector("#productImage");
let preview = document.querySelector("#preview");
imageFile.addEventListener("change",displayImage);
function displayImage(){
    if((imageFile.value.endsWith(".jpg") || imageFile.value.endsWith(".jpeg") || imageFile.value.endsWith(".png") || imageFile.value.endsWith(".webp"))){
        preview.style.display="block";
        preview.src=URL.createObjectURL(imageFile.files[0]);
    }
    else{
        preview.style.display="none";
    }
}
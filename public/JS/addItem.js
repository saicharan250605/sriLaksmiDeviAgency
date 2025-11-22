let itemAddForm = document.querySelector("#itemAddForm");
let addItemBtn = document.querySelector("#additemBtn");
let navbar = document.querySelector("#navbar");
let itemsOuterDivContainer = document.querySelector("#itemsOuterDivContainer");
let xmark_addItem = document.querySelector(".xmark_addItem");
let itemsInnerDiv2 = document.querySelector("#itemsInnerDiv2");
let itemInput = document.querySelector("#itemInput");

addItemBtn.addEventListener("click",handler1);
itemAddForm.addEventListener("submit",handler2);
xmark_addItem.addEventListener("click",handler3);
function handler1(){
    itemAddForm.style.display="flex";
    itemsOuterDivContainer.style.pointerEvents="none";
    itemsInnerDiv2.style.opacity='0';
    navbar.style.pointerEvents="none";
    itemInput.value="";
}
function handler2(event){
    if(allItems_of_allProducts.some(obj => obj.name.toLowerCase().trim() === itemInput.value.toLowerCase().trim())){
        event.preventDefault();
        itemAddForm.children[2].style.display="block";
    }else{
        itemAddForm.style.display="none";
        itemsOuterDivContainer.style.pointerEvents="all";
        itemsInnerDiv2.style.opacity='1';
        navbar.style.pointerEvents="all";
        itemAddForm.submit();
    }
}
function handler3(){
    itemAddForm.style.display="none";
    itemsOuterDivContainer.style.pointerEvents="all";
    itemsInnerDiv2.style.opacity='1';
    navbar.style.pointerEvents="all";
}

//////////////////////////////////////////////// ITEM DELETE HANDLING //////////////////////////////////////////////
const deleteConfirmation_div_item = document.querySelector("#deleteConfirmation_div_item");
const xmark_del_item = document.querySelector(".xmark_del_item");
const deleteConfirm_btn_item = document.querySelector("#deleteConfirm_btn_item");
const itemDeleteForm = document.querySelectorAll(".itemDeleteForm");
for(let i of itemDeleteForm){
    i.children[0].addEventListener("click",itemDeleteHandler);
}
xmark_del_item.addEventListener("click",handler16);
function itemDeleteHandler(event){
    itemsOuterDivContainer.style.pointerEvents="none";
    itemsOuterDivContainer.style.opacity='0';
    navbar.style.pointerEvents="none";
    deleteConfirmation_div_item.style.display="flex";
    deleteConfirmation_div_item.children[1].innerText = `Are you sure, you want to delete sub product "${event.target.parentElement.previousElementSibling.innerText}"`;
    deleteConfirm_btn_item.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}
function handler16(){
    itemsOuterDivContainer.style.pointerEvents="all";
    itemsOuterDivContainer.style.opacity='1';
    navbar.style.pointerEvents="all";
    deleteConfirmation_div_item.style.display="none";
}
const allInvoices_outerContainer = document.querySelector("#allInvoices_outerContainer");
const navbar = document.querySelector("#navbar")
///////////////////////////////////////////////////// DELETE IMPORT ///////////////////////////////////////////////////
const importForms = document.querySelectorAll(".importForms");
const deleteConfirmation_div_import = document.querySelector("#deleteConfirmation_div_import");
const xmark_del_import = document.querySelector(".xmark_del_import");
const deleteConfirm_btn_import = document.querySelector("#deleteConfirm_btn_import");
for(let i of importForms){
    i.children[0].addEventListener('click',importDelete_handler);
}
xmark_del_import.addEventListener("click",()=>{
    allInvoices_outerContainer.style.display="flex";
    deleteConfirmation_div_import.style.display="none";
    navbar.style.pointerEvents="all";
});
function importDelete_handler(event){
    navbar.style.pointerEvents="none";
    allInvoices_outerContainer.style.display="none";
    deleteConfirmation_div_import.style.display="flex";
    deleteConfirmation_div_import.children[1].innerText=`Are you sure, you want to delete this import invoice dated on ${event.target.parentElement.parentElement.parentElement.children[0].innerText}?`;
    deleteConfirm_btn_import.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}

///////////////////////////////////////////////////// DELETE EXPORT ///////////////////////////////////////////////////
const exportForms = document.querySelectorAll(".exportForms");
const deleteConfirmation_div_export = document.querySelector("#deleteConfirmation_div_export");
const xmark_del_export = document.querySelector(".xmark_del_export");
const deleteConfirm_btn_export = document.querySelector("#deleteConfirm_btn_export");
for(let i of exportForms){
    i.children[0].addEventListener('click',exportDelete_handler);
}
xmark_del_export.addEventListener("click",()=>{
    allInvoices_outerContainer.style.display="flex";
    deleteConfirmation_div_export.style.display="none";
    navbar.style.pointerEvents="all";
});
function exportDelete_handler(event){
    navbar.style.pointerEvents="none";
    allInvoices_outerContainer.style.display="none";
    deleteConfirmation_div_export.style.display="flex";
    deleteConfirmation_div_export.children[1].innerText=`Are you sure, you want to delete this export invoice dated on ${event.target.parentElement.parentElement.parentElement.children[0].innerText}?`;
    deleteConfirm_btn_export.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}
///////////////////////////////////////////////////// DELETE IND SALES ///////////////////////////////////////////////////
const indSalesForms = document.querySelectorAll(".indSalesForms");
const deleteConfirmation_div_indSales = document.querySelector("#deleteConfirmation_div_indSales");
const xmark_del_indSales = document.querySelector(".xmark_del_indSales");
const deleteConfirm_btn_indSales = document.querySelector("#deleteConfirm_btn_indSales");
for(let i of indSalesForms){
    i.children[0].addEventListener('click',indSalesDelete_handler);
}
xmark_del_indSales.addEventListener("click",()=>{
    allInvoices_outerContainer.style.display="flex";
    deleteConfirmation_div_indSales.style.display="none";
    navbar.style.pointerEvents="all";
});
function indSalesDelete_handler(event){
    navbar.style.pointerEvents="none";
    allInvoices_outerContainer.style.display="none";
    deleteConfirmation_div_indSales.style.display="flex";
    deleteConfirmation_div_indSales.children[1].innerText=`Are you sure, you want to delete this individual sales invoice dated on ${event.target.parentElement.parentElement.parentElement.children[0].innerText}?`;
    deleteConfirm_btn_indSales.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}

//////////////////////////////////////////////////////// THE END ////////////////////////////////////////////////////////
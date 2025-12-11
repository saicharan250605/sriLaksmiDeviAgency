const allDownloadBtns = document.querySelectorAll(".fa-download");
for(let i of allDownloadBtns){
    i.addEventListener("click",invoiceDownloadHandler);
}

function invoiceDownloadHandler(event){
    if( event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id") === "imports_table"){
        importInvoiceDownload(event.target.parentElement.parentElement);
    }
    else if( event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id") === "exports_table"){
        exportInvoiceDownload(event.target.parentElement.parentElement);
    }
    else if( event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id") === "indSales_table"){
        indSalesInvoiceDownload(event.target.parentElement.parentElement);
    }
    else if( event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id") === "indDealer_exports_table"){
        exportInvoice_indDealer_download();
    }else if(event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("id") === "indCompany_imports_table"){
        importInvoice_indCompany_download();
    }
}
function importInvoiceDownload(invoiceRow){
    console.log("import");
}
function exportInvoiceDownload(invoiceRow){
    console.log(dealersList);   
}
function indSalesInvoiceDownload(invoiceRow){
    console.log("indsales");
}
function exportInvoice_indDealer_download(){
    console.log(currDealerInfo);
}
function importInvoice_indCompany_download(){
    console.log("import invoice download");
}
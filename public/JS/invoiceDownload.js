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

/////////////////////////////////////////////////////////// ADDING PAYMENTS OF DEALERS ////////////////////////////////////////////////////
let addPayment_dealer = document.querySelector("#addPayment_dealer");
let addPayment_dealerForm_holder_div = document.querySelector("#addPayment_dealerForm_holder_div");
let xmark_addPayment_dealer = document.querySelector(".xmark_addPayment_dealer");
let indDealer_exports_table = document.querySelector("#indDealer_exports_table");
let indDealer_payments_table = document.querySelector("#indDealer_payments_table");
addPayment_dealer.addEventListener("click",addPaymentFormFetch);

function addPaymentFormFetch(){
    addPayment_dealerForm_holder_div.style.display="block";
    xmark_addPayment_dealer.addEventListener("click",wrongButton_addPayment_dealer);
    indDealer_invoicesHolder.style.display="none";
    navbar.style.pointerEvents="none";
}
function wrongButton_addPayment_dealer(){
    addPayment_dealerForm_holder_div.style.display="none";
    indDealer_invoicesHolder.style.display="flex";
    navbar.style.pointerEvents="all";
    xmark_addPayment_dealer.removeEventListener("click",wrongButton_addPayment_dealer);
}

/////////////////////////////////////////////////////////  DELETE EXPORTs HANDLER ///////////////////////////////////////////////////////////
const deleteDealer_invoiceForm = document.querySelectorAll(".deleteDealer_invoiceForm");
const deleteConfirmation_div_dealer_invoice = document.querySelector("#deleteConfirmation_div_dealer_invoice");
const xmark_del_dealer_invoice = document.querySelector(".xmark_del_dealer_invoice");
const deleteConfirm_btn_dealer_invoice = document.querySelector("#deleteConfirm_btn_dealer_invoice");
const indDealer_invoicesHolder = document.querySelector("#indDealer_invoicesHolder");
const navbar = document.querySelector("#navbar");

for(let i of deleteDealer_invoiceForm){
    i.children[0].addEventListener('click',dealerDelete_handler);
}
xmark_del_dealer_invoice.addEventListener("click",()=>{
    indDealer_invoicesHolder.style.display="flex";
    deleteConfirmation_div_dealer_invoice.style.display="none";
    navbar.style.pointerEvents="all";
});
function dealerDelete_handler(event){
    navbar.style.pointerEvents="none";
    indDealer_invoicesHolder.style.display="none";
    deleteConfirmation_div_dealer_invoice.style.display="flex";
    deleteConfirmation_div_dealer_invoice.children[1].innerText=`Are you sure, you want to delete invoice dated on ${event.target.parentElement.parentElement.parentElement.children[0].innerText}?`;
    deleteConfirm_btn_dealer_invoice.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}

///////////////////////////////////////////////////////// DELETE PAYMENTs HANDLER ///////////////////////////////////////////////////////////
const delete_payment_dealer = document.querySelectorAll(".delete_payment_dealer");
const deleteConfirmation_div_dealer_payment = document.querySelector("#deleteConfirmation_div_dealer_payment");
const xmark_del_dealer_payment = document.querySelector(".xmark_del_dealer_payment");
const deleteConfirm_btn_dealer_payment = document.querySelector("#deleteConfirm_btn_dealer_payment");

for(let i of delete_payment_dealer){
    i.children[0].addEventListener('click',dealer_paymentDelete_handler);
}
xmark_del_dealer_payment.addEventListener("click",()=>{
    navbar.style.pointerEvents="all";
    indDealer_invoicesHolder.style.display="flex";
    deleteConfirmation_div_dealer_payment.style.display="none";
});
function dealer_paymentDelete_handler(event){
    navbar.style.pointerEvents="none";
    indDealer_invoicesHolder.style.display="none";
    deleteConfirmation_div_dealer_payment.style.display="flex";
    deleteConfirmation_div_dealer_payment.children[1].innerText=`Are you sure, you want to delete this payment dated on ${event.target.parentElement.parentElement.parentElement.children[0].innerText}?`;
    deleteConfirm_btn_dealer_payment.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}

//////////////////////////////////////////////////////////// TOTAL NET OUTSTANDING AMOUNT CALCULATION ///////////////////////////////////////////////////////////

let payable_amount = document.querySelector("#payable_amount");
let receivable_amount = document.querySelector("#receivable_amount");
let totalExportAmount = 0;
let totalPaymentAmount = 0;
for(let i of exportsAmount){
    totalExportAmount += i.totalReceivable;
}
for(let i of paymentAmount){
    if(i.amountType === "RECEIVED"){
        totalPaymentAmount -= i.money;
    }else if(i.amountType === "PAID"){
        totalPaymentAmount += i.money;
    }
}
if(totalExportAmount + totalPaymentAmount >=0){
    receivable_amount.innerText = Math.abs(totalExportAmount + totalPaymentAmount).toLocaleString("en-IN");
    payable_amount.innerText = 0;
}else if(totalExportAmount + totalPaymentAmount < 0){
    receivable_amount.innerText = 0;
    payable_amount.innerText = Math.abs(totalExportAmount + totalPaymentAmount).toLocaleString("en-IN");
}
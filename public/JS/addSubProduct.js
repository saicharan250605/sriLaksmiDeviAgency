
//***************************************************** ALL SUBPRODUCTS AND INVOICES RELATED CODE ***************************************************//

let navbar = document.querySelector("#navbar");
let subProductsOuterDivContainer = document.querySelector("#subProductsOuterDivContainer");
let subProductsInnerDiv1 = document.querySelector("#subProductsInnerDiv1");
let subProductsInnerDiv2 = document.querySelector("#subProductsInnerDiv2");

//***************************************************** ADDING SUB PRODUCT IN A PRODUCT --> CODE ***************************************************//

let subProductAddForm = document.querySelector("#subProductAddForm");
let addSubProductBtn = document.querySelector("#addSubProductBtn");
let xmark_addSubProduct = document.querySelector(".xmark_addSubProduct");
let subProductInput = document.querySelector("#subProductInput");

addSubProductBtn.addEventListener("click",handler1);
subProductAddForm.addEventListener("submit",handler2);
xmark_addSubProduct.addEventListener("click",handler3);

function handler1(){
    subProductAddForm.style.display="flex";
    subProductsOuterDivContainer.style.pointerEvents="none";
    subProductsInnerDiv2.style.opacity='0';
    navbar.style.pointerEvents="none";
    subProductInput.value="";
}
function handler2(event){
    if(allsubProducts_of_allProducts.some(obj => obj.name.toLowerCase().trim() === subProductInput.value.toLowerCase().trim())){
        event.preventDefault();
        subProductAddForm.children[2].style.display="block";
    }else{
        subProductAddForm.style.display="none";
        subProductsOuterDivContainer.style.pointerEvents="all";
        subProductsInnerDiv2.style.opacity='1';
        navbar.style.pointerEvents="all";
        subProductAddForm.submit();
    }
}
function handler3(){
    subProductAddForm.style.display="none";
    subProductsOuterDivContainer.style.pointerEvents="all";
    subProductsInnerDiv2.style.opacity='1';
    navbar.style.pointerEvents="all";
}

//***************************************************** ELEMENTS AND FUNCTIONS REQUIRED FOR ALL INVOICES --> CODE***************************************************//

let invoiceAddDiv = document.querySelector("#invoiceAddDiv");
let xmark_addInvoice = document.querySelector(".xmark_addInvoice");
let addInvoiceBtn = document.querySelector("#addInvoiceBtn");
let importInvoice_formFetchBtn = document.querySelector("#importInvoice_formFetchBtn");
let exportInvoice_formFetchBtn = document.querySelector("#exportInvoice_formFetchBtn");
let indSalesInvoice_formFetchBtn = document.querySelector("#indSalesInvoice_formFetchBtn");

addInvoiceBtn.addEventListener("click",handler4);
xmark_addInvoice.addEventListener("click",handler5);
importInvoice_formFetchBtn.addEventListener("click",handler6);
exportInvoice_formFetchBtn.addEventListener("click",handler7);
indSalesInvoice_formFetchBtn.addEventListener("click",handler8);

function handler4(){
    invoiceAddDiv.style.display="flex";
    subProductsOuterDivContainer.style.pointerEvents="none";
    subProductsInnerDiv2.style.opacity='0';
    navbar.style.pointerEvents="none";
}
function handler5(){
    invoiceAddDiv.style.display="none";
    subProductsOuterDivContainer.style.pointerEvents="all";
    subProductsInnerDiv2.style.opacity='1';
    navbar.style.pointerEvents="all";
}
function handler6(){
    importInvoice_form.style.display="block";
    disabling_commonOfAllInvoices();
}
function handler7(){
    exportInvoice_form.style.display="block";
    disabling_commonOfAllInvoices();
}
function handler8(){
    indSalesInvoice_form.style.display = "block";   
    disabling_commonOfAllInvoices();
}
function disabling_commonOfAllInvoices(){
    subProductsInnerDiv1.style.opacity='0';
    subProductsInnerDiv2.style.opacity='0';
    subProductsInnerDiv1.style.pointerEvents='none';
    subProductsInnerDiv2.style.pointerEvents='none';
    invoiceAddDiv.style.display="none";
}
function adding_selectElements_function(minidiv,type){
    //add subproducts for selecting
    let selectElement = document.createElement("select");
    let option_for_select = document.createElement("option");
    selectElement.setAttribute("required",true);
    option_for_select.innerText = "Select a subproduct";
    option_for_select.setAttribute("hidden",true);
    option_for_select.setAttribute("value","");
    selectElement.append(option_for_select);
    for(i of allSubProducts){
        option_for_select = document.createElement("option");
        option_for_select.innerText = i["name"];
        option_for_select.setAttribute("value", i["name"]);
        option_for_select.setAttribute("id",i._id);
        selectElement.append(option_for_select);
    }
    selectElement.addEventListener("change",enablingSelectingItems);
    minidiv.append(selectElement);

    //creating item select (options not included), options added in enablingSelectingItems function
    let selectElement2 = document.createElement("select");
    selectElement2.setAttribute("required",true);
    if(type.includes("export")){
        selectElement2.setAttribute("name",`exporting[productSold][${productSold_count_export}][itemName]`);
    }else if(type.includes("import")){
        selectElement2.setAttribute("name",`importing[productsBought][${productSold_count_import}][itemName]`);
    }else if(type.includes("indSales")){
        selectElement2.setAttribute("name",`indSales[productSold][${productSold_count_indSales}][itemName]`);
    }
    let option_for_select2 = document.createElement("option");
    option_for_select2.innerText = "Select an item in subproduct";
    option_for_select2.setAttribute("hidden",true);
    option_for_select2.setAttribute("value","");
    selectElement2.append(option_for_select2);
    minidiv.append(selectElement2);
}
function enablingSelectingItems(event){
    let options_for_select;
    while(event.target.nextElementSibling.children.length > 1) {
        event.target.nextElementSibling.children[1].remove();
    }
    for(i of allItems[event.target.value]){
        options_for_select = document.createElement("option");
        options_for_select.innerText = i.name;
        options_for_select.setAttribute("value", i.name);
        options_for_select.setAttribute("id", i._id+"_-_"+i.available);
        event.target.nextElementSibling.append(options_for_select);
    }
}

//***************************************************** IMPORT FORM CODE ***************************************************//

let importInvoice_form = document.querySelector("#importInvoice_form");
let add_subproduct_select_btn_import = document.querySelector("#add_subproduct_select_btn_import");
let container_of_dynamicAddedEle_import = document.querySelector("#selectingProduct_import");
let balance_importamount = document.querySelector("#balance_importamount");
const cgst_import = document.querySelector("#cgst_import");
const sgst_import = document.querySelector("#sgst_import");
let xmark_import = document.querySelector(".xmark_import");
let productSold_count_import = 0;

add_subproduct_select_btn_import.addEventListener("click",handler10);
importInvoice_form.addEventListener("submit",importFormSubmit);
xmark_import.addEventListener("click",handler12);
cgst_import.value = 0;
sgst_import.value = 0;
cgst_import.addEventListener("input",changeAmount2);
sgst_import.addEventListener("input",changeAmount2);

function handler10(){
    importInvoice_form.style.setProperty("height","600px");
    let minidiv = document.createElement("div");
    minidiv.setAttribute("class","minidiv");
    adding_selectElements_function(minidiv, "import");
    input1_importInvoice_form(minidiv); //adding input element 1 for number of items
    input2_importInvoice_form(minidiv); //adding input element 2 for mrp of item
    input3_importInvoice_form(minidiv); //adding input element 3 for available price of item
    input4_importInvoice_form(minidiv); //adding input element 4 for storing sub product id
    input5_importInvoice_form(minidiv); //adding input element 5 for storing item id
    container_of_dynamicAddedEle_import.append(minidiv); //adding final minidiv to form on webpage
    add_subproduct_select_btn_import.nextElementSibling.style.display="none";
    productSold_count_import+=1;
}
function input1_importInvoice_form(minidiv){
    let minidiv4 = document.createElement("div");
    let input1 = document.createElement("input");
    let input1_label = document.createElement("label");
    minidiv4.setAttribute("class","mindiv4");
    input1_label.innerText="Number of items";
    input1.setAttribute("placeholder","Enter number of items");
    input1.setAttribute("type","Number");
    input1.setAttribute("required",true);
    input1.setAttribute("class","allitems_theirCount2"); // assigning class, so that later they can be obtained to dynamically change amount in changeAmount2 function
    input1.setAttribute("name",`importing[productsBought][${productSold_count_import}][number]`);
    input1.addEventListener("input",changeAmount2);  // Dynamically changing the amount when items and their prices are entered
    minidiv4.append(input1_label);
    minidiv4.append(input1);
    minidiv.append(minidiv4);
}
function input2_importInvoice_form(minidiv){
    let minidiv2 = document.createElement("div");
    let input2 = document.createElement("input");
    let input2_label = document.createElement("label");
    minidiv2.setAttribute("class","mindiv2");
    input2_label.innerText="MRP of item";
    input2.setAttribute("placeholder","Enter MRP of item");
    input2.setAttribute("type","Number");
    input2.setAttribute("required",true);
    input2.setAttribute("name",`importing[productsBought][${productSold_count_import}][mrp]`);
    minidiv2.append(input2_label);
    minidiv2.append(input2);
    minidiv.append(minidiv2);
}
function input3_importInvoice_form(minidiv){
    let minidiv2 = document.createElement("div");
    let input3 = document.createElement("input");
    let input3_label = document.createElement("label");
    minidiv2.setAttribute("class","mindiv2");
    input3_label.innerText="Available price of one item";
    input3.setAttribute("placeholder","Enter available price of item");
    input3.setAttribute("type","Number");
    input3.setAttribute("required",true);
    input3.setAttribute("class","allitems_theirPrice2"); // assigning class, so that later they can be obtained to dynamically change amount in changeAmount2 function
    input3.setAttribute("name",`importing[productsBought][${productSold_count_import}][amount]`);
    input3.addEventListener("input",changeAmount2);
    minidiv2.append(input3_label);
    minidiv2.append(input3);
    minidiv.append(minidiv2);
}
function input4_importInvoice_form(minidiv){
    let input4 = document.createElement("input");
    input4.setAttribute("name",`allIds[${productSold_count_import}]`);
    input4.setAttribute("class","subproductId_inInput");
    input4.style.display="none";
    minidiv.append(input4);
}
function input5_importInvoice_form(minidiv){
    let input5 = document.createElement("input");
    input5.setAttribute("name",`allItemIds[${productSold_count_import}]`);
    input5.setAttribute("class","itemId_inInput");
    input5.style.display="none";
    minidiv.append(input5);    
}
function handler12(){
    subProductsInnerDiv1.style.opacity='1';
    subProductsInnerDiv2.style.opacity='1';
    subProductsInnerDiv1.style.pointerEvents='all';
    subProductsInnerDiv2.style.pointerEvents='all';
    navbar.style.pointerEvents="all";
    importInvoice_form.style.display="none";
    importInvoice_form.reset();
}
function changeAmount2(){
    let itemNumbers = document.querySelectorAll(".allitems_theirCount2");
    let itemPrices = document.querySelectorAll(".allitems_theirPrice2");
    balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value = 0;
    for(i=0; i<itemNumbers.length; i++){
        balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value = Number(balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value)+(itemNumbers[i].value * itemPrices[i].value);
    }
    balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value = (Number(balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value)+(cgst_import.value/100)*Number(balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value)+(sgst_import.value/100)*Number(balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value)).toFixed(3);
}
function importFormSubmit(event){
    let eachSubproducts = document.querySelectorAll(".subproductId_inInput");
    let eachItem = document.querySelectorAll(".itemId_inInput");
    let minidiv = document.querySelectorAll(".minidiv");
    if(container_of_dynamicAddedEle_import.children.length<=0){
        event.preventDefault();
        add_subproduct_select_btn_import.nextElementSibling.style.display="block";
        return;
    }
    for(i of minidiv){
        i.children[1].selectedOptions[0].id = i.children[1].selectedOptions[0].id.split("_-_")[0];
    }
    for(let i=0;i<eachSubproducts.length;i++ ){
        eachSubproducts[i].value = eachSubproducts[i].parentElement.children[0].selectedOptions[0].id;
        eachItem[i].value = eachItem[i].parentElement.children[1].selectedOptions[0].id;
    }
    balance_importamount.value = ((balance_importamount.previousElementSibling.previousElementSibling.previousElementSibling.value)-(balance_importamount.previousElementSibling.value)).toFixed(3);
}

//***************************************************** EXPORT FORM CODE ***************************************************//

const exportInvoice_form = document.querySelector("#exportInvoice_form");
const add_subproduct_select_btn_export = document.querySelector("#add_subproduct_select_btn");
const container_of_dynamicAddedEle_export = document.querySelector("#selectingProduct_export");
const balance_exportamount = document.querySelector("#balance_exportamount");
const xmark_export = document.querySelector(".xmark_export");
const cgst_export = document.querySelector("#cgst_export");
const sgst_export = document.querySelector("#sgst_export");
let productSold_count_export = 0;

add_subproduct_select_btn_export.addEventListener("click",handler9);
exportInvoice_form.addEventListener("submit",exportFormSubmit);
xmark_export.addEventListener("click",handler11);
cgst_export.value = 0;
sgst_export.value = 0;
cgst_export.addEventListener("input",changeAmount1);
sgst_export.addEventListener("input",changeAmount1);

function handler9(){
    exportInvoice_form.style.setProperty("height","600px");
    let minidiv = document.createElement("div");
    minidiv.setAttribute("class","minidiv");
    error_displayMessage_export(minidiv);
    adding_selectElements_function(minidiv, "export");
    input1_exportInvoice_form(minidiv); //Adding input element 1 for number of items 
    input2_exportInvoice_form(minidiv); //Adding input element 2 for price of one item
    input3_exportInvoice_form(minidiv); //Adding input element 3 for sub product id
    input4_exportInvoice_form(minidiv); //Adding input element 4 for item id
    container_of_dynamicAddedEle_export.append(minidiv);    //adding final minidiv to form on webpage
    add_subproduct_select_btn_export.nextElementSibling.style.display="none";
    productSold_count_export+=1;
}
function error_displayMessage_export(minidiv){
    let error_msg = document.createElement("span");
    error_msg.innerText = "Exporting items exceed available items";
    error_msg.style.color = "red";
    error_msg.style.fontSize = "14px";
    error_msg.style.display="none";
    minidiv.append(error_msg);
}
function input1_exportInvoice_form(minidiv){
    let minidiv2 = document.createElement("div");
    let input1 = document.createElement("input");
    let input1_label = document.createElement("label");
    minidiv2.setAttribute("class","mindiv2");
    input1_label.innerText="Number of items";
    input1.setAttribute("placeholder","Enter number of items sold");
    input1.setAttribute("type","Number");
    input1.setAttribute("required",true);
    input1.setAttribute("class","allitems_theirCount"); // assigning class, so that later they can be obtained to dynamically change amount in changeAmount1 function
    input1.setAttribute("name",`exporting[productSold][${productSold_count_export}][number]`);
    input1.addEventListener("input",changeAmount1); // Dynamically changing total amount to be received as soon as no.of items and their prices are entered
    minidiv2.append(input1_label);
    minidiv2.append(input1);
    minidiv.append(minidiv2);
}
function input2_exportInvoice_form(minidiv){
    let minidiv2 = document.createElement("div");
    let input2 = document.createElement("input");
    let input2_label = document.createElement("label");
    minidiv2.setAttribute("class","mindiv2");
    input2_label.innerText="price of one item";
    input2.setAttribute("placeholder","Enter price of single item");
    input2.setAttribute("type","Number");
    input2.setAttribute("step","any");
    input2.setAttribute("required",true);
    input2.setAttribute("class","allitems_theirPrice"); // assigning class, so that later they can be obtained to dynamically change amount in changeAmount1 function
    input2.setAttribute("name",`exporting[productSold][${productSold_count_export}][indCost]`);
    input2.addEventListener("input",changeAmount1);
    minidiv2.append(input2_label);
    minidiv2.append(input2);
    minidiv.append(minidiv2);
}
function input3_exportInvoice_form(minidiv){
    let input3 = document.createElement("input");
    input3.setAttribute("name",`allIds[${productSold_count_export}]`);
    input3.setAttribute("class","subproductId_inInput_export");
    input3.style.display="none";
    minidiv.append(input3);
}
function input4_exportInvoice_form(minidiv){
    let input4 = document.createElement("input");
    input4.setAttribute("name",`allItemIds[${productSold_count_export}]`);
    input4.setAttribute("class","itemId_inInput_export");
    input4.style.display="none";
    minidiv.append(input4);
}
function handler11(){
    subProductsInnerDiv1.style.opacity='1';
    subProductsInnerDiv2.style.opacity='1';
    subProductsInnerDiv1.style.pointerEvents='all';
    subProductsInnerDiv2.style.pointerEvents='all';
    navbar.style.pointerEvents="all";
    exportInvoice_form.style.display="none";
    exportInvoice_form.reset();
}
function changeAmount1(){
    let itemNumbers = document.querySelectorAll(".allitems_theirCount");
    let itemPrices = document.querySelectorAll(".allitems_theirPrice");
    balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value = 0;
    for(i=0; i<itemNumbers.length; i++){
        balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value = Number(balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value)+(itemNumbers[i].value * itemPrices[i].value);
    }
    balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value = (Number(balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value) + (cgst_export.value/100)*Number(balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value) + (sgst_export.value/100)*Number(balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value)).toFixed(3);
}
function exportFormSubmit(event){
    let eachSubproducts = document.querySelectorAll(".subproductId_inInput_export");
    let eachItem = document.querySelectorAll(".itemId_inInput_export");
    let minidiv = document.querySelectorAll(".minidiv");
    let ava,currValue,isAvailable = true;
    if(container_of_dynamicAddedEle_export.children.length<=0){
        event.preventDefault();
        add_subproduct_select_btn_export.nextElementSibling.style.display = "block";
        return;
    }
    for(i of minidiv){
        ava = Number(i.children[2].selectedOptions[0].id.split("_-_")[1].trim());
        currValue = Number(i.children[3].children[1].value.trim());
        if(currValue > ava || currValue<=0){
            event.preventDefault();
            isAvailable = false;
            i.children[0].style.display="block";
        }
    }
    if(isAvailable){
        for(i of minidiv){
            i.children[2].selectedOptions[0].id = i.children[2].selectedOptions[0].id.split("_-_")[0];
        }
        for(let i=0;i<eachSubproducts.length;i++ ){
            eachSubproducts[i].value = eachSubproducts[i].parentElement.children[1].selectedOptions[0].id;
            eachItem[i].value = eachItem[i].parentElement.children[2].selectedOptions[0].id;
        }
        balance_exportamount.value = ((balance_exportamount.previousElementSibling.previousElementSibling.previousElementSibling.value)-(balance_exportamount.previousElementSibling.value)).toFixed(3);
    }
}

//***************************************************** INDIVIDUAL SALES FORM CODE ***************************************************//

let indSalesInvoice_form = document.querySelector("#indSalesInvoice_form");
let add_subproduct_select_btn_indSales = document.querySelector("#add_subproduct_select_btn_indSales");
let container_of_dynamicAddedEle_indSales = document.querySelector("#selectingProduct_indSales");
let totalReceivable_indSales_amount = document.querySelector("#totalReceivable_indSales_amount");
const cgst_indSales = document.querySelector("#cgst_indSales");
const sgst_indSales = document.querySelector("#sgst_indSales");
let xmark_indSales = document.querySelector(".xmark_indSales");
let productSold_count_indSales = 0;

add_subproduct_select_btn_indSales.addEventListener("click",handler13);
indSalesInvoice_form.addEventListener("submit",indSalesFormSubmit);
xmark_indSales.addEventListener("click",handler14);
cgst_indSales.value = 0;
sgst_indSales.value = 0;
cgst_indSales.addEventListener("input",changeAmount3);
sgst_indSales.addEventListener("input",changeAmount3);

function handler13(){
    indSalesInvoice_form.style.setProperty("height","600px");
    let minidiv = document.createElement("div");
    minidiv.setAttribute("class","minidiv");
    error_displayMessage_indSales(minidiv);
    adding_selectElements_function(minidiv, "indSales");
    input1_indSalesInvoice_form(minidiv); //Adding input element 1 for number of items 
    input2_indSalesInvoice_form(minidiv); //Adding input element 2 for price of one item
    input3_indSalesInvoice_form(minidiv); //Adding input element 3 for sub product id
    input4_indSalesInvoice_form(minidiv); //Adding input element 4 for item id
    container_of_dynamicAddedEle_indSales.append(minidiv); //adding final minidiv to form on webpage
    add_subproduct_select_btn_indSales.nextElementSibling.style.display="none";
    productSold_count_indSales+=1;
}
function error_displayMessage_indSales(minidiv){
    let error_msg = document.createElement("span");
    error_msg.innerText = "Selling items exceed available items";
    error_msg.style.color = "red";
    error_msg.style.fontSize = "14px";
    error_msg.style.display="none";
    minidiv.append(error_msg);
}
function input1_indSalesInvoice_form(minidiv){
    let minidiv2 = document.createElement("div");
    let input1 = document.createElement("input");
    let input1_label = document.createElement("label");
    minidiv2.setAttribute("class","mindiv2");
    input1_label.innerText="Number of items";
    input1.setAttribute("placeholder","Enter number of items sold");
    input1.setAttribute("type","Number");
    input1.setAttribute("required",true);
    input1.setAttribute("class","allitems_theirCount3"); // assigning class, so that later they can be obtained to dynamically change amount in changeAmount3 function
    input1.setAttribute("name",`indSales[productSold][${productSold_count_indSales}][number]`);
    input1.addEventListener("input",changeAmount3);
    minidiv2.append(input1_label);
    minidiv2.append(input1);
    minidiv.append(minidiv2);
}
function input2_indSalesInvoice_form(minidiv){
    let minidiv2 = document.createElement("div");
    let input2 = document.createElement("input");
    let input2_label = document.createElement("label");
    minidiv2.setAttribute("class","mindiv2");
    input2_label.innerText="price of one item";
    input2.setAttribute("placeholder","Enter price of single item");
    input2.setAttribute("type","Number");
    input2.setAttribute("required",true);
    input2.setAttribute("class","allitems_theirPrice3"); // assigning class, so that later they can be obtained to dynamically change amount in changeAmount3 function
    input2.setAttribute("name",`indSales[productSold][${productSold_count_indSales}][indCost]`);
    input2.addEventListener("input",changeAmount3);
    minidiv2.append(input2_label);
    minidiv2.append(input2);
    minidiv.append(minidiv2);
}
function input3_indSalesInvoice_form(minidiv){
    let input3 = document.createElement("input");
    input3.setAttribute("name",`allIds[${productSold_count_indSales}]`);
    input3.setAttribute("class","subproductId_inInput_indSales");
    input3.style.display="none";
    minidiv.append(input3);
}
function input4_indSalesInvoice_form(minidiv){
    let input4 = document.createElement("input");
    input4.setAttribute("name",`allItemIds[${productSold_count_indSales}]`);
    input4.setAttribute("class","itemId_inInput_indSales");
    input4.style.display="none";
    minidiv.append(input4);
}
function handler14(){
    subProductsInnerDiv1.style.opacity='1';
    subProductsInnerDiv2.style.opacity='1';
    subProductsInnerDiv1.style.pointerEvents='all';
    subProductsInnerDiv2.style.pointerEvents='all';
    navbar.style.pointerEvents="all";
    indSalesInvoice_form.style.display="none";
    indSalesInvoice_form.reset();
}
function changeAmount3(){
    let itemNumbers = document.querySelectorAll(".allitems_theirCount3");
    let itemPrices = document.querySelectorAll(".allitems_theirPrice3");
    totalReceivable_indSales_amount.value = 0;
    for(i=0; i<itemNumbers.length; i++){
        totalReceivable_indSales_amount.value = Number(totalReceivable_indSales_amount.value)+(itemNumbers[i].value * itemPrices[i].value);
    }
    totalReceivable_indSales_amount.value = (Number(totalReceivable_indSales_amount.value) + (cgst_indSales.value/100)*Number(totalReceivable_indSales_amount.value) + (sgst_indSales.value/100)*Number(totalReceivable_indSales_amount.value)).toFixed(3); 
}
function indSalesFormSubmit(event){
    let eachSubproducts = document.querySelectorAll(".subproductId_inInput_indSales");
    let eachItem = document.querySelectorAll(".itemId_inInput_indSales");
    let minidiv = document.querySelectorAll(".minidiv");
    let ava,currValue,isAvailable = true;
    if(container_of_dynamicAddedEle_indSales.children.length<=0){
        event.preventDefault();
        add_subproduct_select_btn_indSales.nextElementSibling.style.display="block";
        return;
    }
    for(i of minidiv){
        ava = Number(i.children[2].selectedOptions[0].id.split("_-_")[1].trim());
        currValue = Number(i.children[3].children[1].value.trim());
        if(currValue > ava || currValue<=0){
            event.preventDefault();
            isAvailable = false;
            i.children[0].style.display="block";
        }
    }
    if(isAvailable){
        for(i of minidiv){
            i.children[2].selectedOptions[0].id = i.children[2].selectedOptions[0].id.split("_-_")[0];
        }
        for(let i=0;i<eachSubproducts.length;i++ ){
            eachSubproducts[i].value = eachSubproducts[i].parentElement.children[1].selectedOptions[0].id;
            eachItem[i].value = eachItem[i].parentElement.children[2].selectedOptions[0].id;
        }
    }
}

////////////////////////////////////////////////// PRODUCT DELETE CONFIRMATION CODE ///////////////////////////////////////////////////
const deleteConfirmation_div = document.querySelector("#deleteConfirmation_div");
const productDeleteForm =  document.querySelector("#productDeleteForm");
const deleteProductBtn = document.querySelector("#deleteProductBtn");
const deleteConfirm_btn = document.querySelector("#deleteConfirm_btn");
const xmark_del_product = document.querySelector(".xmark_del_product");

deleteProductBtn.addEventListener("click",deleteHandler);
xmark_del_product.addEventListener("click",handler15);
function deleteHandler(){
    disabling_commonOfAllInvoices();
    navbar.style.pointerEvents="none";
    deleteConfirmation_div.style.display="flex";
    deleteConfirm_btn.addEventListener("click",confirmDeleteHandler);
}
function confirmDeleteHandler(){
    productDeleteForm.submit();
}
function handler15(){
    subProductsInnerDiv1.style.opacity='1';
    subProductsInnerDiv2.style.opacity='1';
    subProductsInnerDiv1.style.pointerEvents='all';
    subProductsInnerDiv2.style.pointerEvents='all';
    navbar.style.pointerEvents="all";
    deleteConfirmation_div.style.display="none";
    deleteConfirm_btn.removeEventListener("click",confirmDeleteHandler);
}

////////////////////////////////////////////////// SUB PRODUCT DELETE CONFIRMATION CODE ///////////////////////////////////////////////////
const subProductDeleteForm = document.querySelectorAll(".subProductDeleteForm");
const deleteConfirmation_div_subproduct = document.querySelector("#deleteConfirmation_div_subproduct");
const xmark_del_subProduct = document.querySelector(".xmark_del_subProduct");
const deleteConfirm_btn_subProduct = document.querySelector("#deleteConfirm_btn_subProduct");

for(let i of subProductDeleteForm){
    i.children[0].addEventListener("click",subProductDeleteHandler);
}
xmark_del_subProduct.addEventListener("click",handler16);
function subProductDeleteHandler(event){
    disabling_commonOfAllInvoices();
    navbar.style.pointerEvents="none";
    deleteConfirmation_div_subproduct.style.display="flex";
    deleteConfirmation_div_subproduct.children[1].innerText = `Are you sure, you want to delete sub product "${event.target.parentElement.parentElement.parentElement.children[0].children[0].innerText}"`;
    deleteConfirm_btn_subProduct.addEventListener("click",()=>{
        event.target.parentElement.submit();
    });
}
function handler16(){
    subProductsInnerDiv1.style.opacity='1';
    subProductsInnerDiv2.style.opacity='1';
    subProductsInnerDiv1.style.pointerEvents='all';
    subProductsInnerDiv2.style.pointerEvents='all';
    navbar.style.pointerEvents="all";
    deleteConfirmation_div_subproduct.style.display="none";
}

///////////////////////////////////////////////////////////// THE END //////////////////////////////////////////////////////
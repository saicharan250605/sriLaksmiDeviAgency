let balance_import = document.querySelector("#balance_import");
let paid_import = document.querySelector("#paid_import");
let totalSpendable_import = document.querySelector("#totalSpendable_import");
let addImportForm = document.querySelector("#addImportForm");

addImportForm.addEventListener("submit",handler1);

function handler1(){
    balance_import.value = totalSpendable_import.value - paid_import.value;
}
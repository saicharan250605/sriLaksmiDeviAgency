const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const ejsMate = require('ejs-mate');
const path = require("path");
const passport = require("passport");
const passportLocal = require("passport-local");
const multer = require("multer");
const {storage} = require("./cloudConfig");
const upload = multer({storage});
if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
}
const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('ejs',ejsMate);
app.use(methodOverride("_method"));

const productTypeClass = require("./models/productType.js");
const subProductTypeClass = require("./models/subProductType.js");
const itemClass = require("./models/item.js");
const importClass = require("./models/importClass.js");
const exportClass = require("./models/exportClass.js");
const sellClass = require("./models/sell.js");
const dealerClass = require("./models/dealerClass.js");
const userClass = require("./models/userModel.js");
const importPlaceClass = require("./models/ImportingPlace.js");

const port = 8000;
app.listen(port,"0.0.0.0",()=>{
    console.log(`Application is live at port ${port}`);
})
const databaseURL = process.env.DATABASE_URL;
async function dataBaseLink(){
    await mongoose.connect(databaseURL);
}
dataBaseLink().then(()=>{
    console.log("connected succesfully with mongo database :)");
});

//////////////////////////////////////////////// SESSION CREATION ///////////////////////////////////////////////
const mongoStore = require("connect-mongo");
const store = mongoStore.create({
    mongoUrl: databaseURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,
});
store.on("error",()=>{
    console.log("Error in mongo session store", err);
});
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(userClass.authenticate()));
passport.serializeUser(userClass.serializeUser());
passport.deserializeUser(userClass.deserializeUser());

/////////////////////////////////////////////////// BASIC APP.USE //////////////////////////////////////////////////////
app.use("/",(req,res,next)=>{
    if(req.method !== "DELETE")
        req.session.originalUrl = req.originalUrl;
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error");
    res.locals.reqUser = req.user;// used to display signup login / logout && listingOwner
    return next();
});
app.use("/ProductInfo",async(req,res,next)=>{
    let allDealers = await dealerClass.find();
    res.locals.allDealers = allDealers;
    next();
});
app.use("/",(req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0'); ///////////////// Important
    res.setHeader('Pragma', 'no-cache');
    return next();
});

function isUserLoggedin(req,res,next){
    if(req.user.username === "vedamani"){
        return next();
    }else{
        req.flash("error","you are not authorised to make changes here");
        res.redirect(req.session.originalUrl);
    }

}
////////////////////////////// ERROR HANDLING /////////////////////////////////////
function asyncwrap(func){
    return function(req,res,next){
        func(req,res,next).catch((err)=>{
            next(err);
        });
    }
}

/////////////////////////////////////////////////// GENERAL ROUTES //////////////////////////////////////////////////////
app.get("/",(req,res)=>{
    res.redirect("/allLists");
});
app.get("/allLists",asyncwrap(async(req,res)=>{
    let result = await productTypeClass.find();
    // let all_vigImports = await importClass.find({place:"ARUNA AGENCIES_VIJAYAWADA"});
    // let vigPlace = await importPlaceClass.findOne({companyName: "ARUNA AGENCIES"});
    // vigPlace.invoices.push(...all_vigImports);
    // await vigPlace.save();
    // console.log(all_vigImports);
    // console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    // console.log(vigPlace);
    res.render("listings/homepage.ejs",{result});
}));

/////////////////////////////////// ADDING PRODUCT //////////////////////////////////
app.get("/addProduct",isUserLoggedin,asyncwrap(async(req,res)=>{
    const allProducts = await productTypeClass.find();
    res.render("listings/addProductForm.ejs",{allProducts});
}));
app.post("/addProduct",isUserLoggedin,upload.single("productImage"),asyncwrap(async(req,res)=>{
    let {productType,hsn} = req.body;
    let{path:url,filename,}= req.file;
    let newProduct = new productTypeClass({
        name:productType,
        hsn,
        total:0,
        sold:0,
        available:0,
        image:{url,filename}
    });
    await newProduct.save();
    req.flash("success","product added successfully");
    res.redirect("/allLists"); 
}));

/////////////////////////////////// DELETE PRODUCT ///////////////////////////////
app.delete("/delete/product/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {id} = req.params;
    let allSP_Ids=[];
    let allItemIds=[];
    const currPro = await productTypeClass.findById(id).populate({
        path:"subProducts",
    }).lean();
    for(let ind_sp of currPro.subProducts){
        allSP_Ids.push(ind_sp._id);
        allItemIds.push(...ind_sp.items);
    }
    //deleting all subproducts and all items in the product
    await subProductTypeClass.deleteMany({_id:{ $in: allSP_Ids}});
    await itemClass.deleteMany({_id:{ $in: allItemIds}});
    // deleting all imports, exports and individual sales
    await importClass.deleteMany({_id:{ $in: currPro.import}});
    await sellClass.deleteMany({_id:{ $in: currPro.sell}});
    for(let i of currPro.export){
        let currexp = await exportClass.findById(i);
        let currDealer = await dealerClass.findOne({name :currexp.dealer});
        await dealerClass.findByIdAndUpdate(currDealer._id,{$pull:{invoices: i}});
    }
    await exportClass.deleteMany({_id:{$in:currPro.export}});
    await productTypeClass.findByIdAndDelete(id);
    req.flash("success","product deleted successfully");
    res.redirect("/allLists");
}));

///////////////////////////////// ADDING SUB PRODUCT ///////////////////////////////
app.get("/ProductInfo/:id",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let result1 = await productTypeClass.findById(id).populate({
        path:"subProducts",
        populate:{
            path:"items"
        }
    }).lean();
    let allImportPlacesList = await importPlaceClass.find();
    let result2 = result1.subProducts;
    let result3= {};
    for(let ind_sp of result1.subProducts ){
        result3[ind_sp.name] = ind_sp.items;
    }
    res.locals.allsubProducts_of_allProducts = await subProductTypeClass.find();
    res.render("listings/productInfo.ejs",{result1,result2,result3,allImportPlacesList});
}));
app.post("/addSubproduct/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let {subProduct} = req.body;
    let mainProduct = await productTypeClass.findById(id);
    let newSubProduct = new subProductTypeClass({
        name:subProduct,
        total:0,
        sold:0,
        available:0,
    });
    await newSubProduct.save();
    mainProduct.subProducts.push(newSubProduct);
    await mainProduct.save();
    req.flash("success","sub product added successfully");
    res.redirect(`/ProductInfo/${id}`);
}));

///////////////////////////////// DELETE SUB PRODUCT ///////////////////////////////
app.delete("/delete/subProduct/:product_id/:subproduct_id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {subproduct_id,product_id} = req.params;
    const currSubPro = await subProductTypeClass.findById(subproduct_id);
    const currPro = await productTypeClass.findById(product_id);
    for(let j of currSubPro.items){
        let currItem = await itemClass.findById(j);
        currPro.total -= currItem.total;
        currPro.sold -= currItem.sold;
        currPro.available -= currItem.available;
        await itemClass.findByIdAndDelete(j);
    }
    await currPro.save();
    await productTypeClass.findByIdAndUpdate(product_id,{$pull:{subProducts:subproduct_id}});
    await subProductTypeClass.findByIdAndDelete(subproduct_id);
    req.flash("success","sub product deleted successfully");
    res.redirect(`/ProductInfo/${product_id}`);
}));

///////////////////////////////////////// ADDING ITEMS /////////////////////////////////////
app.get("/subProduct/info/:id1/:id2",asyncwrap(async(req,res)=>{
    let {id1,id2} = req.params;
    let result1 = await productTypeClass.findById(id1); 
    let result2 = await subProductTypeClass.findById(id2);
    let [result3] = await Promise.all([itemClass.find({_id:{$in: result2.items}})]);
    res.locals.allItems_of_allProducts = await itemClass.find();
    res.render("listings/subProductInfo.ejs",{result1,result2,result3});
}));
app.post("/addItem/:id1/:id2",isUserLoggedin,asyncwrap(async(req,res)=>{
    let {id1,id2} = req.params;
    let {item} = req.body;
    let subProduct = await subProductTypeClass.findById(id2);
    let newItem = new itemClass({
        name:item,
        total:0,
        sold:0,
        available:0,
    });
    await newItem.save();
    subProduct.items.push(newItem);
    await subProduct.save();
    req.flash("success","item added successfully");
    res.redirect(`/subProduct/info/${id1}/${id2}`);
}));

///////////////////////////////////////// DELETE ITEMS /////////////////////////////////////
app.delete("/delete/item/:productId/:subProductId/:itemId",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {productId, subProductId, itemId} = req.params; 
    const currPro = await productTypeClass.findById(productId);
    const currSubPro = await subProductTypeClass.findById(subProductId);
    const currItem = await itemClass.findById(itemId);
    currSubPro.total -= currItem.total;
    currSubPro.sold -= currItem.sold;
    currSubPro.available -= currItem.available;
    currPro.total -= currItem.total;
    currPro.sold -= currItem.sold;
    currPro.available -= currItem.available;
    await currPro.save();
    await currSubPro.save();
    await itemClass.findByIdAndDelete(itemId);
    await subProductTypeClass.findByIdAndUpdate(subProductId,{$pull:{items:itemId}});
    req.flash("success","item deleted successfully");
    res.redirect(`/subProduct/info/${productId}/${subProductId}`);
}));

///////////////////////////////////// ADDING DEALER ///////////////////////////////////////
app.get("/addDealer",isUserLoggedin,asyncwrap(async(req,res)=>{
    let allDealers = await dealerClass.find();
    res.render("listings/addDealerForm.ejs",{allDealers});
}));
app.post("/addDealer",isUserLoggedin,asyncwrap(async(req,res)=>{
    let {dealer} = req.body;
    let kothaDealer = new dealerClass(dealer);
    await kothaDealer.save();
    req.flash("success","dealer added successfully");
    res.redirect("/allLists");
}));

///////////////////////////////////// DELETE DEALER ///////////////////////////////////////
app.delete("/delete/dealer/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const currDealer = await dealerClass.findById(id);
    for(let i of currDealer.invoices){
        let currExport_Invoice = await exportClass.findById(i);
        let currProduct = await productTypeClass.findById(currExport_Invoice.parentProduct);
        for(let j of currExport_Invoice.productSold){
            let currSubPro = await subProductTypeClass.findById(j.parentSubProduct);
            let currItem = await itemClass.findById(j.parentItem);
            currItem.sold -= j.number;
            currItem.available += j.number;
            currSubPro.sold -= j.number;
            currSubPro.available += j.number;
            currProduct.sold -= j.number;
            currProduct.available += j.number;
            await currSubPro.save();
            await currItem.save();
        }
        await currProduct.save();
        await productTypeClass.findByIdAndUpdate(currExport_Invoice.parentProduct,{$pull:{export:i}});
        await exportClass.findByIdAndDelete(i);
    }
    await dealerClass.findByIdAndDelete(id);
    req.flash("success","dealer deleted successfully");
    res.redirect("/allDealersInvoicelist");
}));

//////////////////////////////////// ADDING IMPORT PLACE OR DEALER ////////////////////////////
app.get("/addimportPlace",asyncwrap(async(req,res)=>{
    let allImportPlaces = await importPlaceClass.find();
    res.render("listings/addImportPlaceForm.ejs",{allImportPlaces});
}));
app.post("/addimportPlace",async(req,res)=>{
    let newImportPlace = new importPlaceClass(req.body.importPlace);
    await newImportPlace.save();
    req.flash("success","Import place added successfully");
    res.redirect("/allLists");
});
//////////////////////////////////// DISPLAYING ALL IMPORTS OF INDIVIDUAL PLACES or DEALERS ///////////////////////////////
app.get("/indInvoices_ImportPlace",asyncwrap(async(req,res)=>{
    let allImportPlaces = await importPlaceClass.find();
    res.render("listings/allPlacesImports.ejs",{allImportPlaces});
}));
//////////////////////////////////// ADDING IMPORT /////////////////////////////////////////
app.post("/add/imports/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let selectedProduct = await productTypeClass.findById(id);
    let selectedCompany = await importPlaceClass.findOne({city:req.body.importing.place.split("_")[1].trim(),companyName:req.body.importing.place.split("_")[0].trim()});
    let newImport = new importClass(req.body.importing);
    newImport.parentProduct = id;
    let selectedSubProduct,selectedItem;
    for(i=0; i<req.body.allIds.length; i++){
        selectedProduct.total = Number(selectedProduct.total)+Number(req.body.importing.productsBought[i].number);
        selectedProduct.available = Number(selectedProduct.available)+Number(req.body.importing.productsBought[i].number);
        
        newImport.productsBought[i].parentSubProduct = req.body.allIds[i];
        selectedSubProduct = await subProductTypeClass.findById(req.body.allIds[i]);
        selectedSubProduct.total = Number(req.body.importing.productsBought[i].number) + Number(selectedSubProduct.total) ;
        selectedSubProduct.available=Number(req.body.importing.productsBought[i].number) + Number(selectedSubProduct.available) ;
        await selectedSubProduct.save();

        newImport.productsBought[i].parentItem = req.body.allItemIds[i];
        selectedItem = await itemClass.findById(req.body.allItemIds[i]); 
        selectedItem.total=Number(req.body.importing.productsBought[i].number)+Number(selectedItem.total);
        selectedItem.available=Number(req.body.importing.productsBought[i].number)+Number(selectedItem.available);
        await selectedItem.save();
    }
    await newImport.save();
    selectedProduct.import.push(newImport);
    await selectedProduct.save();
    selectedCompany.invoices.push(newImport);
    await selectedCompany.save();
    req.flash("success","import invoice added successfully");
    res.redirect(`/ProductInfo/${id}`);
}));

//////////////////////////////////// DELETE IMPORT /////////////////////////////////////////
app.delete("/delete/import/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const curr_import_invoice = await importClass.findById(id);
    let currProduct = await productTypeClass.findById(curr_import_invoice.parentProduct);
    let shallProceed = true;
    for(let j of curr_import_invoice.productsBought){
        let currSubPro = await subProductTypeClass.findById(j.parentSubProduct);
        let currItem = await itemClass.findById(j.parentItem);
        currProduct.total -= j.number;
        currProduct.available -= j.number;
        currSubPro.total -= j.number;
        currSubPro.available -= j.number;
        currItem.total -= j.number;
        currItem.available -= j.number;
        if(currProduct.available<0 || currSubPro.available<0 || currItem.available<0){
            shallProceed = false;         
        }
    }
    if(shallProceed){
        await importPlaceClass.findOneAndUpdate({city:curr_import_invoice.place.split("_")[1].trim(),companyName:curr_import_invoice.place.split("_")[0].trim()},{$pull:{invoices:id}});
        currProduct = await productTypeClass.findById(curr_import_invoice.parentProduct);
        for(let j of curr_import_invoice.productsBought){
            let currSubPro = await subProductTypeClass.findById(j.parentSubProduct);
            let currItem = await itemClass.findById(j.parentItem);
            currProduct.total -= j.number;
            currProduct.available -= j.number;
            currSubPro.total -= j.number;
            currSubPro.available -= j.number;
            currItem.total -= j.number;
            currItem.available -= j.number;
            await currSubPro.save();
            await currItem.save();
        }
        await currProduct.save();
        await productTypeClass.findByIdAndUpdate(curr_import_invoice.parentProduct,{$pull:{import:id}});
        await importClass.findByIdAndDelete(id);
        req.flash("success","import invoice deleted successfully");
        res.redirect(req.session.originalUrl);
    }else{
        req.flash("error","This import cannot be deleted");
        res.redirect(req.session.originalUrl);
    }
}));

//////////////////////////////////// ADDING EXPORT /////////////////////////////////////////
app.post("/add/exports/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    let selectedSubProduct,selectedItem;
    const {id} = req.params;
    let selectedProduct = await productTypeClass.findById(id);
    let newExport = new exportClass(req.body.exporting);
    newExport.parentProduct = id;
    for(i=0; i<req.body.allIds.length; i++){
        newExport.productSold[i].parentItem = req.body.allItemIds[i];
        selectedItem = await itemClass.findById(req.body.allItemIds[i]); 
        selectedItem.sold = Number(req.body.exporting.productSold[i].number)+Number(selectedItem.sold);
        selectedItem.available = Number(selectedItem.available) - Number(req.body.exporting.productSold[i].number);
        await selectedItem.save();

        newExport.productSold[i].parentSubProduct = req.body.allIds[i];
        selectedSubProduct = await subProductTypeClass.findById(req.body.allIds[i]);
        selectedSubProduct.sold = Number(req.body.exporting.productSold[i].number) + Number(selectedSubProduct.sold);
        selectedSubProduct.available = Number(selectedSubProduct.available) - Number(req.body.exporting.productSold[i].number);
        await selectedSubProduct.save();
        
        selectedProduct.sold = Number(selectedProduct.sold)+Number(req.body.exporting.productSold[i].number);
        selectedProduct.available = Number(selectedProduct.available)-Number(req.body.exporting.productSold[i].number);
    }
    await newExport.save();
    let currDealer = await dealerClass.findOne({name:req.body.exporting.dealer});
    currDealer.invoices.push(newExport);
    await currDealer.save();
    selectedProduct.export.push(newExport);
    await selectedProduct.save();
    req.flash("success","export invoice added successfully");
    res.redirect(`/ProductInfo/${id}`);
}));

//////////////////////////////////// DELETE EXPORT /////////////////////////////////////////
app.delete("/delete/export/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const curr_export_invoice = await exportClass.findById(id);
    const currProduct = await productTypeClass.findById(curr_export_invoice.parentProduct);
    for(let j of curr_export_invoice.productSold){
        let currSubPro = await subProductTypeClass.findById(j.parentSubProduct);
        let currItem = await itemClass.findById(j.parentItem);
        currItem.sold -= j.number;
        currItem.available += j.number;
        currSubPro.sold -= j.number;
        currSubPro.available += j.number;
        currProduct.sold -= j.number;
        currProduct.available += j.number;
        await currSubPro.save();
        await currItem.save();
    }
    await currProduct.save();
    await productTypeClass.findByIdAndUpdate(curr_export_invoice.parentProduct,{$pull:{export:id}});
    await exportClass.findByIdAndDelete(id);
    req.flash("success","export invoice deleted successfully");
    res.redirect(req.session.originalUrl);
}));

//////////////////////////////////// ADDING SALES /////////////////////////////////////////
app.post("/add/indSales/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const selectedProduct = await productTypeClass.findById(id);
    let newIndSale = new sellClass(req.body.indSales);
    newIndSale.parentProduct = id;
    let selectedSubProduct,selectedItem;
    for(i=0; i<req.body.allIds.length; i++){
        newIndSale.productSold[i].parentItem = req.body.allItemIds[i];
        selectedItem = await itemClass.findById(req.body.allItemIds[i]);
        selectedItem.sold = Number(req.body.indSales.productSold[i].number)+Number(selectedItem.sold);
        selectedItem.available = Number(selectedItem.available) - Number(req.body.indSales.productSold[i].number);
        await selectedItem.save();

        newIndSale.productSold[i].parentSubProduct = req.body.allIds[i];
        selectedSubProduct = await subProductTypeClass.findById(req.body.allIds[i]);
        selectedSubProduct.sold = Number(req.body.indSales.productSold[i].number) + Number(selectedSubProduct.sold);
        selectedSubProduct.available = Number(selectedSubProduct.available) - Number(req.body.indSales.productSold[i].number);
        await selectedSubProduct.save();
        
        selectedProduct.sold = Number(selectedProduct.sold)+Number(req.body.indSales.productSold[i].number);
        selectedProduct.available = Number(selectedProduct.available)-Number(req.body.indSales.productSold[i].number);
    }
    await newIndSale.save();
    selectedProduct.sell.push(newIndSale);
    await selectedProduct.save();
    req.flash("success","individual sales invoice added successfully");
    res.redirect(`/ProductInfo/${id}`);
}));

//////////////////////////////////// DELETE IND SALES /////////////////////////////////////////
app.delete("/delete/indSales/:id",isUserLoggedin,asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const curr_indSales_invoice = await sellClass.findById(id);
    const currProduct = await productTypeClass.findById(curr_indSales_invoice.parentProduct);
    for(let j of curr_indSales_invoice.productSold){
        let currSubPro = await subProductTypeClass.findById(j.parentSubProduct);
        let currItem = await itemClass.findById(j.parentItem);
        currItem.sold -= j.number;
        currItem.available += j.number;
        currSubPro.sold -= j.number;
        currSubPro.available += j.number;
        currProduct.sold -= j.number;
        currProduct.available += j.number;
        await currSubPro.save();
        await currItem.save();
    }
    await currProduct.save();
    await productTypeClass.findByIdAndUpdate(curr_indSales_invoice.parentProduct,{$pull:{export:id}});
    await sellClass.findByIdAndDelete(id);
    req.flash("success","individual sales invoice deleted successfully");
    res.redirect(req.session.originalUrl);
}));

//////////////////////////////////////////// DEALER WISE LIST ///////////////////////////////////////////
app.get("/allDealersInvoicelist",asyncwrap(async(req,res)=>{
    const allDealersObjects = await dealerClass.find();
    res.render("listings/allDealers_info.ejs",{allDealersObjects});
}));

//////////////////////////////////////////// DEALER WISE INVOICE LIST ///////////////////////////////////////////
app.get("/allexp/dealer/:id",asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const indDealersObject = await dealerClass.findById(id);
    let currDealerInfo = {};
    let [exportArr] = await Promise.all([exportClass.find({_id:{$in: indDealersObject.invoices}})]);
    currDealerInfo["name"] = indDealersObject.name;
    currDealerInfo["gst"]=indDealersObject.gstNumber;
    currDealerInfo["shopName"] = indDealersObject.shopName;
    currDealerInfo["city"] = indDealersObject.city;
    currDealerInfo["exports"] = exportArr;
    res.render("listings/allDealers_invoices.ejs",{currDealerInfo});
}));

///////////////////////////////////////////  ALL INVOICES LIST ///////////////////////////////////////
app.get("/allInvoices/indProduct/:id",asyncwrap(async(req,res)=>{
    const {id} = req.params;
    const selectedProduct = await productTypeClass.findById(id);
    const[importsList, exportsList, indSalesList, dealersList] = await Promise.all([
        importClass.find({_id: {$in: selectedProduct.import}}),
        exportClass.find({_id: {$in: selectedProduct.export}}),
        sellClass.find({_id: {$in: selectedProduct.sell}}),
        dealerClass.find()
    ]);
    res.render("listings/allInvoices_indProduct.ejs",{importsList, exportsList, indSalesList, dealersList, productName:selectedProduct.name, productImageLink: selectedProduct.image.url});
}));

////////////////////////////////////////// LOGIN ////////////////////////////////////////////
app.get("/loginPageRender",(req,res)=>{
    res.render("listings/login_signup_page.ejs",{purpose:"login"});
});
app.post("/login",passport.authenticate("local",{failureRedirect:"/loginPageRender",  failureFlash:true}),async (req,res)=>{
    req.flash("success","welcome back to Sri Lakshmi Devi Agencies");
    res.redirect("/allLists");
});

////////////////////////////////////////// SIGN UP ////////////////////////////////////////////
app.get("/signupPageRender",(req,res)=>{
    res.render("listings/login_signup_page.ejs",{purpose:"signup"});
});

app.post("/signup",asyncwrap(async(req,res,next)=>{
    let {username, password} = req.body;
    const allUsers = await userClass.find();
    if(allUsers.length>=1){
        req.flash("error","You are not allowed to sign up");
        res.redirect("/allLists");
    }else{
        let isAlreadyPresent = false;
        let kothaUser = new userClass({
            username,
        });
        await userClass.register(kothaUser,password).catch((error)=>{
            req.flash("error",error.message);
            isAlreadyPresent = true;
            return res.redirect("/signupPageRender");
        })
        if(!isAlreadyPresent){
            req.login(kothaUser,(err)=>{
                if(err)
                    next(err);
                else{
                    req.flash("success","Welcome to Sri Lakshmi Devi Agencies");
                    return res.redirect("/allLists");
                }  
            })
        }
    }
}));

///////////////// LOGOUT ROUTE ////////////////////
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
    if(err){
        return next(err);
    }else{
        req.flash("success","Logged out successfully");
        res.redirect("/allLists");
    }
   });
});

//////////////////////////////////////////// ERROR HANDLING FUNCTIONS ///////////////////////////////////////////////
app.use((req,res,next)=>{
    throw new Error(401,"401 Page Not Found");
});
app.use((err,req,res,next)=>{
    res.render("listings/errorPage.ejs",{err});
});
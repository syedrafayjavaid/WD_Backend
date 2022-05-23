const express =  require('express');
const server =  new express();
var cors = require('cors');

server.use(express.json());
 

server.use(cors())
const port = 3001;
const mongoose = require('mongoose');



//////////////// CONNECTING TO DATABASE COLLECTIONS ////////////////////
try{
    mongoose.connect('mongodb://localhost:27017/wd', {useNewUrlParser: true, useUnifiedTopology: true});
    require('./models/Order');
    require('./models/OrderDetail');
    require('./models/Product');
    require('./models/Category');
    require('./models/Subcategory');
    require('./models/Expense');
   
    console.log('Successfully connected to WD database');
}catch(e){
    console.log('Connection could not be created, possible cause: '+e.message);

}
//----------------------------------------------------------------------







/////////////////////// REGISTERING SCHEMA////////////////////

const Order = mongoose.model('Order');
const OrderDetail = mongoose.model('OrderDetail');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Subcategory = mongoose.model('Subcategory');
const Expense = mongoose.model('Expense');

//-------------------------------------------------------------









////////////////////////////////////////// SEARCH BAR ///////////////////////////////////////////////



server.get('/product/searchBar', async(req, res) => {

    const keyword = req.query.search;

        console.log("incmoing keywords for search",keyword)

    try {

        let key = `${keyword}`;
        console.log("KEY", key);
        let search = await Product.find({name:{$regex:key,$options: '<i>' }}).limit(10)
        console.log("search bar response:", search);
        res.send({code:0, message:"search data response is",data:search})
        
    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  
})


//---------------------------------------------------------------------------------------------------







///////////////////////////////////// ADD PRODUCT ADMIN  ////////////////////////////////////////////

server.post('/product/add', async (req, res) => {


        
        console.log(req.body)
  
  

        let Name = req.body.Name;
        let Quantity = req.body.Quantity;
        let PurchaseCost = req.body.PurchaseCost;
        let SalePrice = req.body.SalePrice;
        let brand = req.body.brand;
        let Category = req.body.Category;
        let SubCategory = req.body.SubCategory;
        let Description = req.body.Description;
        
        

    
        const productData = new Product({
            name: Name,
            quantity: Quantity,
            purchaseCost: PurchaseCost,
            salePrice: SalePrice,
            brand: brand,
            category : Category,
            subCategory:SubCategory,
            description:Description,
        });
    

        try {

            let response = await productData.save();
             console.log("Add Product Response", response);
              res.send({code:0,message:'Product Added Successfully',data:response});
            
        } catch (e) {
    
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
            
        }
    

    
    });
    
 //-------------------------------------------------------------------------------------------------


 

///////////////////////////////// UPDATE PRODUCT ADMIN ///////////////////////////////////////

server.put('/product/update',  async (req, res) => {

    
    const id = req.body._id;
    console.log("Incoming Product Id",id );
    console.log("incoming req body",req.body)
   
        let Name = req.body.Name;
        let Quantity = req.body.Quantity;
        let PurchaseCost = req.body.PurchaseCost;
        let SalePrice = req.body.SalePrice;
        let brand = req.body.brand;
        let Category = req.body.Category;
        let SubCategory = req.body.SubCategory;
        let Description = req.body.Description;
       
      
    
      
        const productData = {};
  
        productData.name = Name;
        productData.quantity = Quantity;
        productData.purchaseCost = PurchaseCost;
        productData.category = Category;
        productData.subCategory = SubCategory;
        productData.salePrice = SalePrice;
        productData.brand = brand;
        productData.description = Description;
        productData.lastModified= new Date();


    
        try {
            let response = await Product.updateOne({_id:id},productData,{new:true});
             console.log("update Product Response",response,productData);
              res.send({code:0,message:'Product Updated Successfully'});
            
        } catch (e) {
    
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
            
        }
    
    
    });    

//--------------------------------------------------------------------------------------------









/////////////////////////////// ALL PRODUCTS VIEW /////////////////////////////////////////////

server.get('/product/view', async(req, res) => {

    try {
  
        let response = await Product.find({}).sort({createdDate:-1});
        console.log(response)
        res.send({code :0, data:response})
    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  
})//---------------------------------------------------------------------------------------------









////////////////////////////////  PRODUCTS SEACRH BAR APP //////////////////////////////////////////

server.get('/product/search', async(req, res) => {

    const searchbar = req.query.search;

    console.log("Incoming name is",searchbar)


    try {


        let search = await Product.find({$or:[{category:searchbar},{subCategory:searchbar},{name:searchbar},{colour:searchbar},{brand:searchbar}]})
        console.log("search bar response:", search);
        res.send({code:0, message:"search data response is",data:search})


        
    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  
})

//---------------------------------------------------------------------------------------------------






////////////////////////////////  PRODUCTS FILTERS UPDATED ADMIN //////////////////////////////////////////

server.put('/product/filters/updated', async(req, res) => {

  
    const brand = req.body.brand;
    const colour = req.body.colour;
    const category = req.body.category;
    const subCategory = req.body.subcategory;
    const priceRange = req.body.priceRange;

    let startPrice = priceRange[0]
    let endPrice = priceRange[1]
    
   
    console.log("incoming start Range :",startPrice);
    console.log("incoming end Range :",endPrice);
    console.log("incoming price Range :",priceRange);
    console.log("incoming brand:",brand);
    console.log("incoming colour:",colour);
    console.log("incoming category:",category);
    console.log("incoming subcategory:",subCategory);
    console.log("incoming start Price:",startPrice);
    console.log("incoming end Price:",endPrice);

        

        try {

            if(brand !=="" && colour !=="" && category!==""&& subCategory!==""&& startPrice!==""){
    
                console.log("Pass 31");
                let response = await Product.find({brand:brand,colour:colour, category:category,subCategory:subCategory, salePrice:{$gte:startPrice,$lte:endPrice}})
                res.send({code :0, data:response})
    
            }

           else if(colour !=="" && category!==""&& subCategory!==""&& startPrice!==""){
    
                console.log("Pass 30");
                let response = await Product.find({colour:colour, category:category,subCategory:subCategory, salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(brand !=="" && category!==""&& subCategory!==""&& startPrice!==""){
    
                console.log("Pass 29");
                let response = await Product.find({brand:brand, category:category,subCategory:subCategory, salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand !=="" && colour!==""&& subCategory!==""&& startPrice!==""){
    
                console.log("Pass 28");
                let response = await Product.find({brand:brand, colour:colour,subCategory:subCategory, salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand !=="" && colour!==""&& category!==""&& startPrice!==""){
    
                console.log("Pass 27");
                let response = await Product.find({brand:brand, colour:colour,category:category, salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(brand !=="" && colour!==""&& category!==""&& subCategory!==""){
    
                console.log("Pass 26");
                let response = await Product.find({brand:brand, colour:colour,category:category, subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(category!==""&& subCategory!=="" && startPrice!==""){
    
                console.log("Pass 25");
                let response = await Product.find({category:category, subCategory:subCategory,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(colour!==""&& subCategory!=="" && startPrice!==""){
    
                console.log("Pass 24");
                let response = await Product.find({colour:colour, subCategory:subCategory,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(colour!==""&& category!=="" && startPrice!==""){
    
                console.log("Pass 23");
                let response = await Product.find({colour:colour, category:category,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(colour!==""&& category!=="" && subCategory!==""){
    
                console.log("Pass 22");
                let response = await Product.find({colour:colour, category:category, subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""&& subCategory!=="" && startPrice!==""){
    
                console.log("Pass 21");
                let response = await Product.find({brand:brand, subCategory:subCategory,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""&& category!=="" && startPrice!==""){
    
                console.log("Pass 20");
                let response = await Product.find({brand:brand,category:category,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""&& category!=="" && subCategory!==""){
    
                console.log("Pass 19");
                let response = await Product.find({brand:brand,category:category,subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""&& colour!=="" && startPrice!==""){
    
                console.log("Pass 18");
                let response = await Product.find({brand:brand,colour:colour,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""&& colour!=="" && subCategory!==""){
    
                console.log("Pass 17");
                let response = await Product.find({brand:brand,colour:colour,subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""&& colour!=="" && category!==""){
    
                console.log("Pass 16");
                let response = await Product.find({brand:brand,colour:colour,category:category})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(subCategory!=="" && startPrice!==""){
    
                console.log("Pass 15");
                let response = await Product.find({subCategory:subCategory,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(subCategory!=="" && startPrice!==""){
    
                console.log("Pass 15");
                let response = await Product.find({subCategory:subCategory,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(category!=="" && startPrice!==""){
    
                console.log("Pass 14");
                let response = await Product.find({category:category,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(category!=="" && subCategory!==""){
    
                console.log("Pass 13");
                let response = await Product.find({category:category,subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(colour!=="" && startPrice!==""){
    
                console.log("Pass 12");
                let response = await Product.find({colour:colour,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(colour!=="" && subCategory!==""){
    
                console.log("Pass 11");
                let response = await Product.find({colour:colour,subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(colour!=="" && category!==""){
    
                console.log("Pass 10");
                let response = await Product.find({colour:colour,category:category})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            
            else if(brand!=="" && startPrice!==""){
    
                console.log("Pass 9");
                let response = await Product.find({brand:brand,salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(brand!=="" && subCategory!==""){
    
                console.log("Pass 8");
                let response = await Product.find({brand:brand,subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else if(brand!=="" && category!==""){
    
                console.log("Pass 7");
                let response = await Product.find({brand:brand,category:category})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!=="" && colour!==""){
    
                console.log("Pass 6");
                let response = await Product.find({brand:brand,colour:colour})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(startPrice!==""){
    
                console.log("Pass 5");
                let response = await Product.find({salePrice:{$gte:startPrice,$lte:endPrice}})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(subCategory!==""){
    
                console.log("Pass 4");
                let response = await Product.find({subCategory:subCategory})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(category!==""){
    
                console.log("Pass 3");
                let response = await Product.find({Category:category})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(colour!==""){
    
                console.log("Pass 2");
                let response = await Product.find({colour:colour})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }
            else if(brand!==""){
    
                console.log("Pass 1");
                let response = await Product.find({brand:brand})
                console.log("response is :",response)
                res.send({code :0, data:response})
    
            }

            else{

                console.log("pass 0");
                res.send({code :-1 ,message:"No record found "})


            }


    
            
        } 
        
        
        catch (e) {
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        }


  
  
})

//---------------------------------------------------------------------------------------------------








///////////////////////////////// PRODUCT DELETE ADMIN ///////////////////////////////////////
server.delete('/product/delete', async(req, res) => {
   
    const _id = req.query._id;
    console.log("incoming", _id, req.query);
    let response = await Product.deleteOne({_id});
    res.send(response);
    console.log(response);
})


//----------------------------------------------------------------------------------------------




////////////////////////////// PRODUCT SHOW ADMIN /////////////////////////////////////////////

server.get('/product/show', async(req, res) => {
    console.log(" id key",req.query.productId);
    let response = await Product.findOne({_id:req.query.productId});
    res.send({data: response});
})

//---------------------------------------------------------------------------------------------








//-----------------------------------------END PRODUCTS APIS-----------------------------------









//======================EXPENSES APIS======================================




////////////////////////////// ADD EXPENSE ////////////////////////////


server.post('/expense/add', async (req, res)=> {


    console.log("incoming title:", req.body.title);
    console.log("icoming detail:", req.body.detail);
    console.log("Incoming amount:",req.body.cost);
    console.log("Incoming date:",req.body.createdDate);

    let title = req.body.title;
    let detail     = req.body.detail;  
    let cost     = req.body.cost;  
    let date = req.body.createdDate; 

    date = new Date(date);

    console.log("Incoming date:",date);

    const expenseData = new Expense({
        
        title:title,
        detail:detail,
        amount:cost,
        createdDate:date
      
    })




    try{
        let response = await expenseData.save();
        console.log("This is add expense response ",response);
        res.send({code: 0, message: 'Expense Added Successfully',data:response});
    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    

});


////////////////////////////////////////////////////////////////////////




///////////////////////// UPDATE EXPENSE ///////////////////////////////

server.put('/expense/update', async(req, res) => {

    const id = req.body._id;
   console.log("incoming id",id );
   console.log("incoming title:", req.body.title);
   console.log("icoming detail:", req.body.detail);
   console.log("Incoming amount:",req.body.amount);



   

   expenseData = {}
  
   expenseData.title = req.body.title;
   expenseData.detail = req.body.detail;
   expenseData.amount = req.body.amount;

   expenseData.lastModified = new Date();

  

    try{
      
        let response = await Expense.updateOne({_id:id}, expenseData);
        console.log("Response Expense Update:",responseProduct);
        res.send({code: 0, message: 'Expense Updated Successfully',data:response});
   }catch(e){
       console.log('Error occured, possible cause: '+e.message);
       res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
   }
   



})

//----------------------------------------------------------------------



//////////////////////////////////DELETE EXPENSE////////////////////////

server.delete('/expense/delete', async(req, res) => {
    
    const id = req.query._id;
    console.log("incoming Id is ", id );

try {
   

    let response = await Expense.deleteOne({_id:id})
    res.send({code: 0, message: "expense Deleted successfully" , data:response})

    
} catch (e) {

    console.log('Error occured, possible cause: '+e.message);
    res.send({code: 1, error: 'Error occured, possible cause: '+e.message});

}


})

//--------------------------------------------------------------------------





/////////////////////////////////// VIEW EXPENSE////////////////////////////

server.get('/expense/view', async(req, res) => {
    
 

try {
   

    let response = await Expense.find({}).sort({createdDate:-1})
    res.send({code: 0,data:response})

    
} catch (e) {

    console.log('Error occured, possible cause: '+e.message);
    res.send({code: 1, error: 'Error occured, possible cause: '+e.message});

}


})

//-------------------------------------------------------------------------





//========================EXPENSES APIS END================================









//=====================CATEGORY APIS=======================================




// ADD CATEGORY ADMIN
server.post('/category/add', async (req, res)=> {


    let CategoryName = req.body.categoryName;
    let Active     = req.body.active;  



                    /////////////////////// pythone ID generation ////////////////////
                    var IdFind = await Category.findOne({}).sort({pythoneId:-1,_id:0});

                    console.log("id  found at first place:",IdFind);

                    var NewId =1000;
                

                    if(IdFind!== null){

                        IdFind  =IdFind.pythoneId;
                
                    console.log("incoming pythone id :",IdFind);
                    NewId = IdFind+1;
                    
                    console.log("pythone id  new :",NewId);

                    }

                //-----------------------------------------------------------






    const categoryData = new Category({
        pythoneId:   NewId ,
        categoryName : CategoryName,
        active       :  Active
    })

    try{
        let response = await categoryData.save();
        console.log(response);
        res.send({code: 0, message: 'Category Added Successfully'});
    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    
});






// VIEW CATEGORY ADMIN & APP (ALL DATA) 
server.get('/category/view', async(req, res) => {

    try {
        
        let response = await Category.find({}).sort({createdDate: -1});
        console.log(response)
        res.send({code: 0, data:response});
    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  
})





//////////////////////////////////// DELETE CATEGORY ADMIN ////////////////////////////////////

server.delete('/category/delete', async(req, res) => {

    const id = req.query._id;
    console.log("incoming category id to delete",id);

    try {
        let categoryName = await Category.findOne({_id:id},{categoryName:1,_id:0});
        categoryName = categoryName.categoryName;
        console.log("incoming catgory name to delete the record:",categoryName);
        let response = await Category.deleteOne({_id:id});
        let productDelete = await Product.deleteMany({category:categoryName})
        let subcategoryDelete = await SubCategory.deleteMany({categoryName:categoryName})

        res.send({code: 0, 
            category:response,
            product:productDelete,
            subcategory:subcategoryDelete
        });
        
    } catch (e) {

        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        
    }
    
})

//---------------------------------------------------------------------------------------------------------




// UPDATE CATEGORY ADMIN
server.put('/category/update', async(req, res) => {

    const id = req.body._id;

        console.log("id",id );
        console.log("Categroy Name", req.body.categoryName);
        console.log("id",req.body.active);

     categoryData = {}
     productData = {}
     subCategoryData={}

        categoryData.categoryName = req.body.categoryName;
        categoryData.active = req.body.active;

         categoryData.lastModified = new Date();

        productData.category =  req.body.categoryName;

        subCategoryData.categoryName = req.body.categoryName;
      


   
         try{
            let responseCategory = await Category.updateOne({categoryName:id}, categoryData);
            let responseProduct = await Product.updateMany({ category:id}, productData);
            let responseSubcategory = await SubCategory.updateMany({categoryName:id}, subCategoryData);
            console.log("Response for category update:",responseCategory);
            console.log("Response for product category update:",responseProduct);
            console.log("Response for Subcategory category update:",responseSubcategory);
            res.send({
                code: 0, 
                message: 'Category updated Successfully',
                data1:responseCategory,
                message:" Product Category Updated Successfully",
                data2:responseProduct,
                message:" Subcategory Category Updated Successfully",
                data3:responseSubcategory});
        }catch(e){
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        }
        

        
       


   
})


//---------------------------END CATEGORY APIs----------------------------------------------










//=====================SUB CATEGORY APIS=======================================





//////////////////////// ADD SUBCATEGORY ADMIN /////////////////////////////////////

server.post('/Subcategory/add', async (req, res)=> {


    let subCategoryName = req.body.SubCategoryName;
    let categoryName = req.body.categoryName;
    let Active     = req.body.active;  




    const subCategoryData = new Subcategory({
        subCategoryName: subCategoryName,
        categoryName  : categoryName,
        active       :  Active
    })

    try{
        let response = await subCategoryData.save();
        console.log(response);
        res.send({code: 0, message: ' Subcategory Added Successfully'});
    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    
});

//-----------------------------------------------------------------------------------









//////////////////////////////////DELETE SUBCATEGORY///////////////////////////////////

server.delete('/Subcategory/delete', async(req, res) => {
    
    const id = req.query._id;
    console.log("incoming Id is ", id );

try {
   
    let subcategoryName = await Subcategory.findOne({_id:id},{subCategoryName:1,_id:0});
    subcategoryName = subcategoryName.subCategoryName;
    console.log("incoming subcategory name is:",subcategoryName)
    let productDelete = await Product.deleteMany({subCategory:subcategoryName})
    let subcategoryDelete = await Subcategory.deleteMany({subCategoryName:subcategoryName})

    res.send({code: 0, 
      
        product:productDelete,
        subcategory:subcategoryDelete
    })



    
} catch (e) {

    console.log('Error occured, possible cause: '+e.message);
    res.send({code: 1, error: 'Error occured, possible cause: '+e.message});

}


})

//-------------------------------------------------------------------------------------







///////////////////////// VIEW SUBCATEGORIES CATEGORY WISE OR SIMPLE  ADMIN & APP ///////////////////////////////

server.get('/Subcategory/view', async(req, res) => {
   
            const category  = req.query.categoryName;

        try {
            if(category){

                let response = await Subcategory.find({categoryName:category}).sort({createdDate: -1});
                console.log("Response for category name ",response)
                res.send({code: 0,  data:response});
            }
            else{

                let response = await Subcategory.find({}).sort({createdDate: -1});
                console.log("Response for all ",response)
                res.send({code: 0,  data:response});
            }
          
           
        } catch (e) {
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        }
    
})


//--------------------------------------------------------------------------------------------------------  





///////////////////////// UPDATE SUBCATEGORIES  ADMIN ////////////////////////////////////////

server.put('/Subcategory/update', async(req, res) => {

         const id = req.body._id;
        console.log("incoming id",id );
        console.log("Categroy Name:", req.body.categoryName);
        console.log("Subcategory:", req.body.subCategoryName);
        console.log("Activity Status:",req.body.active);

        subcategoryData = {}
        productData = {}
        subcategoryData.subCategoryName = req.body.subCategoryName;
        subcategoryData.categoryName = req.body.categoryName;
        subcategoryData.active = req.body.active;

        subcategoryData.lastModified = new Date();

        productData.subCategory =  req.body.subCategoryName;
   
         try{
            let responseSubcategory = await Subcategory.updateOne({subCategoryName:id}, subcategoryData );
             let responseProduct = await Product.updateMany({subCategory:id}, productData);
            console.log("Response for Subcategory subcategory update:",responseSubcategory);
            console.log("Response for PRODUCT update:",responseProduct);
           res.send({code: 0, message: 'Subcategory Updated Successfully',data:responseSubcategory});
        }catch(e){
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        }
        


   
})

//-----------------------------------------------------------------------------------------



//---------------------------END SUB CATEGORY APIs----------------------------------------------


















//=========================ORDER'S APIS=========================================




////////////////////////////////  ORDER DELETE   APP ////////////////////////////////////////////////


server.delete('/order/delete', async (req, res)=> {


    let orderId = req.body.orderId;

    console.log("icoming order id is :",orderId)


    try{
        let response = await Order.deleteOne({_id:orderId});
        console.log("Order delete response",response);
        res.send({code: 0, data:response,message: 'Order Deleted Successfully'});
    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    
});


  
//-------------------------------------------------------------------------------------------






////////////////////////////////  ORDER ADD APP ////////////////////////////////////////////////


server.post('/order/add', async (req, res)=> {


    let customerId = req.body.customerId;
    let totalPrice    = req.body.totalPrice;  
    let totalProduct   = req.body.totalProduct;  
    let status    = req.body.status;  
    let orderAddress   = req.body.orderAddress;  
    let city   = req.body.city;  
    let contactNumber   = req.body.contactNumber; 


                /////////////////////// pythone ID generation ////////////////////
                var IdFind = await Order.findOne({}).sort({pythoneId:-1,_id:0});

                console.log("id  found at first place:",IdFind);

                var NewId =1000;


                if(IdFind!== null){

                    IdFind  =IdFind.pythoneId;

                console.log("incoming pythone id :",IdFind);
                NewId = IdFind+1;
                
                console.log("pythone id  new :",NewId);

                }

            //-----------------------------------------------------------



    const orderData = new Order({
        pythoneId: NewId,
        customerId : customerId,
        totalPrice :  totalPrice,
        totalProduct : totalProduct,
        status     : status,
        orderAddress: orderAddress,
        city: city,
        totalRevinue:0,
        contactNumber:contactNumber
    })

    try{
        let response = await orderData.save();
        console.log("Order add response",response);
        res.send({code: 0, data:response,message: 'Order Added Successfully'});
    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    
});


  
//-------------------------------------------------------------------------------------------






////////////////////////////////  ORDER  VIEW  STATUS BASE + ID Based(update case) ADMIN//////////////////////////////////////////////

server.get('/order/view', async(req, res) => {

       let id   = req.query._id;
       let status = req.query.status;
       console.log("incoming  ID for ID based order view ",status);
       console.log("incoming satus for  status based order view ",status);
    try {

        if(id){
            let response = await Order.findOne({_id:id});
            res.send({ code: 0,data:response });
           console.log("Response for order view status wise ",response)
        }
        else if(status==='all'){
            let response = await Order.find({}).sort({createdDate: -1});
             res.send({ code: 0,data:response });
            console.log("Response for order view status wise ",response)
        }
        else if(status==='pending'){
            let response = await Order.find({status:"new"})
            res.send({code: 0, data:response});
            console.log("Response for order view status wise  pending case",response)
        }
        else if(status==='processing'){
            let response = await Order.find({ status: {$nin: ["new", "canceled","delivered"]} });
            res.send({code: 0, data:response});
            console.log("Response for order view status wise processing case ",response)
        }
        else if(status==='completed'){
            let response = await Order.find({status:"delivered"});
            res.send({code: 0, data:response});
            console.log("Response for order view status wise  completed case ",response)
        }
        else if(status==='canceled'){
            let response = await Order.find({status:"canceled"});
            res.send({code: 0, data:response});
            console.log("Response for order view status wise  completed case ",response)
        }
        
        
    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  

  
});


  
//-------------------------------------------------------------------------------------------




/////////////////////////////////////////// ORDER COUNT API //////////////////////////////////////

server.get('/order/count', async(req, res) => {


 try {
    
         let allCount = await Order.find({}).count();
         let pendingCount = await Order.find({status:"new"}).count();
         let processingCount = await Order.find({ status: {$nin: ["new", "canceled","delivered"]} }).count();
         let completedCount = await Order.find({status:"delivered"}).count();
         let canceledCount = await Order.find({status:"canceled"}).count();

          res.send({
              code: 0,
               allCount:allCount,
               pendingCount:pendingCount,
               processingCount:processingCount,
               completedCount:completedCount,
               canceledCount:canceledCount
             });
       
    
 } 
 
 catch (e) {
     console.log('Error occured, possible cause: '+e.message);
     res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
 }



});


//----------------------------------------------------------------------------------------------



////////////////////////////////  VIEW  ORDER + PRODUCTS + USER (ADMIN) //////////////////////

server.get('/order/products/user/view', async(req, res) => {

        const id = req.query._id;
        console.log("Incoming order ID", id );
      
    try {
        
        let responseOrder = await Order.findOne({_id:id})
        console.log("response for order",responseOrder );

        let responseOrderDetail = await OrderDetail.find({orderId:id})
        console.log("response for orderDetails",responseOrderDetail );

        let customerId   = await  Order.findOne({_id:id},{_id:0,customerId:1})
         let customer= customerId.customerId;
         console.log("response for CustomerID",customer );

        let responseUser   = await  User.findOne({_id:customer})
        console.log("response for User", responseUser );

        res.send({code: 0, 
               message:"response for  order , orderDetails , productDetails",
                order:responseOrder,
                orderDetail:responseOrderDetail,
                customer:responseUser 
            
            });




    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  

  
});


  
//-------------------------------------------------------------------------------------------







////////////////////////////////  ORDER  (MY ORDERS APP) ////////////////////////////////////////

server.get('/order/myOrders', async(req, res) => {

    const id = req.query.id;
    
    console.log("Incoming customer Id", id );
  
try {
    
    let order = await Order.find({customerId:id}).sort({createdDate:-1})
    console.log("response for orders",order)
    res.send({code: 0,message:"response for  order",data:order });


} catch (e) {
    console.log('Error occured, possible cause: '+e.message);
    res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
}



});



//-----------------------------------------------------------------------------------------------




////////////////////////////////  ORDER DETAIL (MY ORDERS APP) ////////////////////////////////////////

server.get('/order/orderDetail', async(req, res) => {

    const id = req.query.id;
    
    console.log("Incoming order Id", id );
  
try {
    
    let orderDetail = await OrderDetail.find({orderId:id}).sort({createdDate:-1})
    console.log("response for orders",orderDetail)
    res.send({code: 0,message:"response for  order Detail",data:orderDetail })


} catch (e) {
    console.log('Error occured, possible cause: '+e.message);
    res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
}



});



//----------------------------------------------------------------------------------------------------






////////////////////////////////  ORDER DETAIL (MY ORDERS APP) ////////////////////////////////////////

server.get('/purchase/history', async(req, res) => {

    const id = req.query.id;
    
    console.log("Incoming cutomer Id", id );
  
try {
    
    let history = await User.findOne({_id:id},{ordersHistory:1,_id:0})
    history = history.ordersHistory

    // // converting array of strings to array of numbers

    // history.map((isItem)=>{

    //     history.push(parseInt(isItem))

    // })
        

    console.log("customer products purchase history",history)
    
    let purchasedProducts = await Product.find({pythoneId:{$in:history}})
    console.log("customer products purchase ",purchasedProducts)
    res.send({code: 0,message:"Purchased Product",data:purchasedProducts})


} catch (e) {
    console.log('Error occured, possible cause: '+e.message);
    res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
}



});



//----------------------------------------------------------------------------------------------------











/////////////////////// ORDER DETAILS UPDATE //////////////////////////////////

server.put('/order/update', async(req, res) => {


    const  id = req.body.id;

    console.log("incoming id for order update is", id);
    
    console.log("incoming address for order update is", req.body.address);
    console.log("incoming city for order update is", req.body.city);
    console.log("incoming contact for order update is", req.body.contact);
    

    const orderData = {};
    

    if(req.body.address){
       orderData.orderAddress = req.body.address;
   }

   if(req.body.city){
       orderData.city = req.body.city;
   }

   if(req.body.contact){
       orderData.contactNumber = req.body.contact;
    }


        orderData.lastModified = new Date();



        try {

            let response = await Order.updateOne({_id:id}, orderData);
            console.log("response for order Edit ",response)
            res.send({code:0, data:response});
           
        } catch (e) {
            
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        }
  
  
   
});

//----------------------------------------------------------------------------





/////////////////////// ORDER STATUS UPDATE AND STOCK MANAGMENT AND REVINUE GENERATIONS /////////////////////


server.put('/orderStatus/update', async(req, res) => {

 
    var Totalprofit =0;

    const  id = req.body.id;

    const orderDetail = req.body.orderDetail;

    const  status  = req.body.status;

    console.log("incoming order details",orderDetail);

    console.log("incoming id for order update is", id);
    
    console.log("incoming status for order status update is", req.body.status);





    try{


        if(status==="shipped"){


            (orderDetail) ? 
            orderDetail.map(async(isItem, key)=>{
       
               console.log("IsItem has :",isItem);
       
            
               let data =  await Product.findOne({_id:isItem.productId},{quantity:1,_id:0})
       
               let  stockQuantity = data.quantity;
       
            //    let purchaseCost =  data.purchaseCost;
       
            //    let salePrice  = data.salePrice;
       
            //    let  profit =  (isItem.quantity)*(salePrice-purchaseCost);
       
            //    Totalprofit = Totalprofit + profit;
       
               console.log("Data found is :",data);
               console.log("quantity in the stock is:",stockQuantity);
               console.log("quantity ordered is:",isItem.quantity);
            //    console.log("Product purchase cost is:",purchaseCost );
            //    console.log("Product sale price is:",salePrice );
            //    console.log("Profit gained is :", profit );
            //    console.log("Total Profit gained is :", Totalprofit );
               stockQuantity = stockQuantity-isItem.quantity;
               
               console.log("Stock Quantity after deducation is:",stockQuantity);
       
               let  quantityData= {};
       
               quantityData.quantity = stockQuantity;
       
              let stockUpdate = await Product.updateOne({_id:isItem.productId}, quantityData);
       
               console.log("stock update reponse:",stockUpdate)




       
            })
            
            : ""

            
            const orderData = {};
    
            orderData.status = req.body.status;   
             orderData.lastModified = new Date();
          
    
                let orderStatus = await Order.updateOne({_id:id}, orderData);
                console.log("response for order status update",orderStatus)
                 res.send({code:0, orderStatus:orderStatus});
     


        }



       else if(status==="delivered"){

            (orderDetail) ? 
            orderDetail.map(async(isItem, key)=>{
       
       
       
               console.log("IsItem has :",isItem);

               let data =  await Product.findOne({_id:isItem.productId},{quantity:1,_id:0, purchaseCost:1})

             
               let purchaseCost =  data.purchaseCost;

               let salePrice  = isItem.price;

               let  profit =  (isItem.quantity)*(salePrice-purchaseCost);
       
               Totalprofit = Totalprofit + profit;
       
               console.log("Data found is :",data);
        
               console.log("quantity ordered is:",isItem.quantity);
               console.log("Product purchase cost is:",purchaseCost );
               console.log("Product sale price is:",salePrice );
               console.log("Profit gained is :", profit );
               console.log("Total Profit gained is :", Totalprofit );



               /////// Data Object ////
                let totalRevinue = {};

                totalRevinue.totalRevinue = Totalprofit;


              let revinue = await Order.updateOne({_id:id}, totalRevinue);
                
               console.log("revinue update reponse:",revinue)



            
       
            })
            
            : ""

                 const orderData = {};
    
                 orderData.status = req.body.status;   
                 orderData.lastModified = new Date();
         
 
                 let orderStatus = await Order.updateOne({_id:id}, orderData);
                 console.log("response for order status update",orderStatus)
                  res.send({code:0, orderStatus:orderStatus});
      



        }
        else{


            const orderData = {};
    

            if(req.body.status){
               orderData.status = req.body.status;   
               orderData.lastModified = new Date();
            }
        
        
        
                let orderStatus = await Order.updateOne({_id:id}, orderData);
                console.log("response for order status update",response)
                 res.send({code:0, orderStatus:orderStatus});
     



        }



  
           
  } catch (e) {
            
            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
        }
  
  
   
});

//-----------------------------------------------------------------------------------










//----------------------------END ORDERS APIS--------------------------------------------








//========================= ORDER DETAIL API=================================


/////////////////////////// ADD ORDER DETAILS APP ////////////////////////////////

server.post('/orderDetail/add', async (req, res)=> {


        let productId = req.body.productId;

        let orderId = req.body.orderId;

        ///////////////////// getting customer ID from order Id///////////////

        let  customerId = await Order.findOne({_id:orderId},{customerId:1,_id:0})

        customerId = customerId.customerId;


        //-------------------------------------------------------------------




         /////////////////////// pythone ID generation ////////////////////
         var IdFind = await OrderDetail.findOne({}).sort({pythoneId:-1,_id:0});

         console.log("id  found at first place:",IdFind);

         var NewId =2000;
     

         if(IdFind!==null){

             IdFind  =IdFind.pythoneId;
     
         console.log("incoming pythone id :",IdFind);
         NewId = IdFind+1;
         
         console.log("pythone id  new :",NewId);

         }

     //-----------------------------------------------------------





    const orderDetailData = new OrderDetail({

        pythoneId: NewId,
        orderId: req.body.orderId,
        productId: req.body.productId,
        productName:req.body.productName,
        price: req.body.price,
        totalPrice:  req.body.totalPrice,
        quantity: req.body.quantity,
        brand: req.body.brand,
        colour: req.body.colour,
    })

    try {
        let response = await orderDetailData.save();
        console.log("add order Detail response",response);


        
     ///////////////////////////// ADDING TO PURCHASE LIST OF CUSTOMER ///////////////////////////

          let pythoneId = await Product.findOne({_id:productId},{pythoneId:1,_id:0})

             pythoneId = pythoneId.pythoneId;

            let customerPurchase = await User.updateMany({_id:customerId},{$push:{ordersHistory:pythoneId}});
            
            console.log("customer Purchase array after push:",customerPurchase);
      
    //------------------------------------------------------------------------------------------



        res.send({code:0,
            message:"Order Aadded Successfully",
            data:response,
            message2:" Customer order history Updated ",
            ordersHistory: customerPurchase
        });
        
    } catch (e) {
        
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});


    }
    
   
  

});

//--------------------------------------------------------------------------



/////////////////////////////ORDER DETAILS DELETE /////////////////////////////////

server.delete('/orderDetail/delete', async(req, res) => {

    const id = req.query.id;
    console.log('Incoming order Delete Id:', id );
    try  {
        
        let response = await OrderDetail.deleteOne({_id:id});
        console.log("OrderDetail Delete Order Response :",response);
        res.send({code: 0, data:response });

        }
    
    catch (e) {
        
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }


  
})

//--------------------------------------------------------------------------------





//////////////////////////// ORDER DETAILS UPDATE /////////////////////////////////

server.put('/orderDetail/update', async(req, res) => {
   

    console.log("incoming body for orderDetails Update:",req.body)

    let id = req.body.id;
    let productId = req.body.productId;
  
    try {

       

        let stockQuantity = await Product.findOne({_id:productId},{quantity:1} );
        
         let count = stockQuantity.quantity;
      
          if (count >=req.body.quantity){
            
                // let requestedQuantity = req.body.quantity;

                // count = count - requestedQuantity;
                // console.log("Stock quantity left:",count);
                console.log("incoming quantity is:",req.body.quantity)
                console.log("incoming ID",id)
                console.log("incoming product Id:",productId)
                console.log("Total Stock Quantity is ", count);
                productData = {};
             
                productData.quantity = req.body.quantity;

           // let productUpdate = await Product.updateOne({_id:productId},productData);
            let response = await OrderDetail.updateOne({_id:id}, productData);
            res.send({code:0,data:response})
            
             
          }
          else{
            res.send({code:-1,message:"can't update the entered limit excceeds stock limit",data:response});

          }
       
        
    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});

    }

  

})


//--------------------------------------------------------------------------------




///////////////////////////////// ADD & UPDATE RATING  //////////////////////////////////

server.post('/rating/add', async(req, res) => {
   

    let customerId = req.body.customerId;
    let productId = req.body.productId;
    let rating     = req.body.rating;  
    


      /////////////////////// pythone ID generation ////////////////////
      var IdFind = await ProductRating.findOne({}).sort({pythoneId:-1,_id:0});

      console.log("id  found at first place:",IdFind);

      var NewId =1000;
  

      if(IdFind!== null){

          IdFind  =IdFind.pythoneId;
  
      console.log("incoming pythone id :",IdFind);
      NewId = IdFind+1;
      
      console.log("pythone id  new :",NewId);

      }

  //-----------------------------------------------------------




   
    const ratingData = new ProductRating({
        pythoneId :  NewId,
        customerId   :  customerId,
        productId    :  productId,
        rating       :  rating

    })

    try{

        let response = await ratingData.save();
        console.log(response);
      


        /////////// CALCULATING TOTAL COUNT ///////////

        let totalReviews = await ProductRating.find({_id:productId}).count()

        console.log("total reviews count:",totalReviews);

        /////////// CALCULATING OVERALL RATING ///////////
        let ratingAvg = await ProductRating.aggregate([
            {$match: {
                productId: productId
            }},
            {$group: {
                _id: "$productId",
                count: {$avg: "$rating"}
            }}
        ]);

         let overAll = ratingAvg[0].count; 
         console.log("orver all product rating ", overAll);
       

        //---------------------------------------------------
        
            

          /////////// UPDATING OVERALL RATING ///////////

           ratingUpdate = {};

           ratingUpdate.rating = overAll;

        let updatedRating = await Product.updateOne({_id:productId}, ratingUpdate);

          //---------------------------------------------



          /////////// Sending Response /////////
          res.send({code: 0,
             responseAdd:response,
             updatedRating:updatedRating,
             reviewCount:totalReviews

            });
         //------------------------------------/

    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    

  

});


//--------------------------------------------------------------------------------------





///////////////////////////////// RATING MATRIX VIEW  //////////////////////////////////

server.get('/rating/matrix/view', async(req, res) => {
   

    
    try{

      let ratingMatrix = await ProductRating.find({})
      console.log("rating matrix has the values:",ratingMatrix.length)

      res.send({code: 0, result: ratingMatrix});

    }catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    

  

});


//--------------------------------------------------------------------------------------








//////////////// ADD TO FAVOURITES CUSTOMER + INCREMENT FAVOURITE COUNT  ///////////

server.post('/favourite/add', async(req, res) => {
   

    let customerId = req.body.customerId;
    let productId = req.body.productId;
    
    
    // console.log(" Incoming Product ID:", productId)

    // console.log(" Incoming Customer ID:", customerId)

    // console.log(" Incoming ratings :", rating)

        try{
     

        // INCREMENTIONG PRODUCT FAVOURITE COUNT    

        let  favourite = await Product.findOne({_id:productId},{favouriteCount:1});
        let favouriteCount = favourite.favouriteCount;


        console.log("Total  favourite Count:",favouriteCount);

        // INCREMENT +1
        
        favouriteCount = favouriteCount +1;

        console.log("Total  favourite Count after increment:",favouriteCount);


        favouriteData = {};

        favouriteData.favouriteCount =  favouriteCount;
        

        let ProductIncrementResponse = await Product.updateOne({_id:productId}, favouriteData);

        console.log("Response after favourite Count  increment:",ProductIncrementResponse);
         
        //---------------------------------------------------------------------------------------





         // ADDING TO FAVOURITE LIST OF CUSTOMER  

         let pythoneId = await Product.findOne({_id:productId},{pythoneId:1,_id:0})

            pythoneId = pythoneId.pythoneId;

         let customerFavourite = await User.updateOne({_id:customerId},{$push:{favouriteProducts:pythoneId}});
        
        console.log("customer favourite array after push:",customerFavourite);
        
        //----------------------------------------------------------------------------------------



        res.send({
            code:0,
            customerFavourite:customerFavourite,
            ProductIncrement:ProductIncrementResponse
        } )

      
  

    }
    
    catch(e){
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
    

  

});


//-----------------------------------------------------------------------------------





//////////////////////////// CUSTOMER FAVOURITES VIEW //////////////////////////////


server.get('/customerfavourite/View', async(req, res) => {

     let customerId = req.query.customerId;

    try {
        
        let customerFavourite = await User.findOne({_id:customerId},{favouriteProducts:1,_id:0});


        console.log("customer favourite array:",customerFavourite);
      
        customerFavourite  = customerFavourite.favouriteProducts;
        
        console.log("customer favourite  actual array:",customerFavourite);

        let favourite = await Product.find({ pythoneId:{$in:customerFavourite}})

        let count = await Product.find({ pythoneId:{$in:customerFavourite}}).count()

        console.log("Customers  All Favourite Products:",favourite);


        res.send({code: 0, data:favourite,count:count});

    } catch (e) {
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }
  
})





//---------------------------------------------------------------------------------







//================================= REPORTS APIS ================================






//////////////////////////// DAILY ACTIVE USERS (DAU) REPORT ///////////////////////////

server.post('/user/dailyActive', async (req, res) => {

    
     let startDate = req.body.startDate
     let  endDate  = req.body.endDate
     let reportType = req.body.reportType
     let duration  = req.body.duration


     startDate= new Date(startDate);
     endDate  = new Date(endDate);

     endDate = new Date (endDate.setDate(endDate.getDate()+1));


     console.log("incoming start date is:",startDate);
     console.log("incoming end date1 is:",endDate); 
     console.log("incoming report type  is:",reportType);
     console.log("incoming end date is:",duration);
 

        try {

            let activeUser = await ActiveUser.aggregate([
                {$match: {
                    createdDate:{$gte:startDate, $lte:endDate }
                }},
                { $project:{
                    day: { "$dayOfMonth" : "$createdDate"},
                    month: { "$month" : "$createdDate" },
                    year:{ "$year": "$createdDate" }
                }},
                { $project:{
                    created_dtm: {"$dateFromParts": { year: "$year", month: "$month", day: "$day" }}
                }},
                {$group: {
                    _id: "$created_dtm",
                    count: {$sum: 1},
                }}
            ]);

            
             res.send({code: 0, data:activeUser});


        } 


        catch (e) {

            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message})

        }




})


//--------------------------------------------------------------------------------------







//////////////////////////// WEEKLY ACTIVE USERS(WAU) REPORT ///////////////////////////



server.get('/user/weeklyActive', async (req, res) => {


    var start;
    var end;

    var firstDayWeek ;

    var lastDayWeek ;




    if( start ==='' && end===''  ){


        firstDayWeek = start;

        lastDayWeek = end;


    }



    else{


            const  currentWeek = weekCount();

            console.log("current week is :",currentWeek)



            if(currentWeek===1){

                firstDayWeek = new Date();

                firstDayWeek = firstDayWeek.setDate(1)

                lastDayWeek  = (new Date()).setDate(7)

            }
            else if(currentWeek===2){

                firstDayWeek = firstDayWeek.setDate(8)

                lastDayWeek  = (new Date()).setDate(14)

            }
            else if(currentWeek===3){

                firstDayWeek = firstDayWeek.setDate(15)

                lastDayWeek  = (new Date()).setDate(21)


            }
            else if(currentWeek===4){

                firstDayWeek = firstDayWeek.setDate(22)

                lastDayWeek  = (new Date()).setDate(28)


            }
            else if(currentWeek===5){

                firstDayWeek = firstDayWeek.setDate(29)

                let date = new Date();

                lastDayWeek  = (new Date(date.getFullYear() ,date.getMonth(),1));

            }





    }






        try {

             let  activeUser = await ActiveUser.find({createdDate:{$gte:  firstDayWeek, $lt:lastDayWeek }}).sort({createdDate:1});
             res.send({code: 0, data:activeUser});


        } 


        catch (e) {

            console.log('Error occured, possible cause: '+e.message);
            res.send({code: 1, error: 'Error occured, possible cause: '+e.message})

        }




})


//--------------------------------------------------------------------------------------







//////////////////////////// MONTHLY ACTIVE USERS(MAU) REPORT ///////////////////////////



server.post('/user/monthlyActive', async (req, res) => {



    let startDate = req.body.startDate

    let  endDate  = req.body.endDate

    let reportType = req.body.reportType

    let duration  = req.body.duration


    startDate= new Date(startDate)
    endDate  = new Date(endDate)

    console.log("incoming report type  is:",reportType);  
    console.log("incoming duration is:",duration);
    console.log("incoming start date is:",startDate);  
    console.log("incoming end date is:",endDate);
    
 

      
            try {

                let activeUserMonth = await ActiveUser.aggregate([
                    {
                        $match: {
                         createdDate:{$gte: startDate , $lte: endDate}
                        }
                    },
                    {
                        $project:{
                            month: {$month: "$createdDate"},
                            year: {$year: "$createdDate"}
                         }
                    },
                    {
                        $group: {
                                    _id: {month: "$month", year: "$year"},
                                    count: {$sum: 1}
                             }
                    },
                    {$project: {
                        month: "$_id.month",
                        year: "$_id.year",
                        count: "$count",
                        _id: 0
                        }},
                        {
                                    $sort: { "month": 1 }
                                },
                                
                    

                ])
    
                    console.log("the response is ",activeUserMonth)
                 res.send({code: 0, data:activeUserMonth});
    
    
            } 
    
    
            catch (e) {
    
                console.log('Error occured, possible cause: '+e.message);
                res.send({code: 1, error: 'Error occured, possible cause: '+e.message})
    
            }
    


})


//-------------------------------------------------------------------------------------







//////////////////////// DAILY USERS ACQUISITIONS (DUA) REPORT /////////////////////////



server.post('/user/dailyAcquisition', async (req, res) => {

    
    let startDate = req.body.startDate
    let  endDate  = req.body.endDate
    let reportType = req.body.reportType
    let duration  = req.body.duration


    startDate= new Date(startDate);
    endDate  = new Date(endDate);

    endDate = new Date (endDate.setDate(endDate.getDate()+1));


    console.log("incoming start date is:",startDate);
    console.log("incoming end date1 is:",endDate); 
    console.log("incoming report type  is:",reportType);
    console.log("incoming end date is:",duration);


       try {

           let activeUser = await User.aggregate([
               {$match: {
                   createdDate:{$gte:startDate, $lte:endDate }
               }},
               { $project:{
                   day: { "$dayOfMonth" : "$createdDate"},
                   month: { "$month" : "$createdDate" },
                   year:{ "$year": "$createdDate" }
               }},
               { $project:{
                   created_dtm: {"$dateFromParts": { year: "$year", month: "$month", day: "$day" }}
               }},
               {$group: {
                   _id: "$created_dtm",
                   count: {$sum: 1},
               }},
               { $project:{
                    createdDate: "$_id",
                    count: "$count"
                }},
                {
                    $sort:{createdDate:1}

                }
           ]);

           
            res.send({code: 0, data:activeUser});


       } 


       catch (e) {

           console.log('Error occured, possible cause: '+e.message);
           res.send({code: 1, error: 'Error occured, possible cause: '+e.message})

       }


   

})


//------------------------------------------------------------------------------------





//////////////////////// MONTHLY USERS ACQUISITIONS (MUA) REPORT ////////////////////////


server.post('/user/monthlyAcquisition', async (req, res) => {


    
    let startDate = req.body.startDate

    let  endDate  = req.body.endDate

    let reportType = req.body.reportType

    let duration  = req.body.duration


    startDate= new Date(startDate)
    endDate  = new Date(endDate)


    console.log("incoming start date is:",startDate);  
    console.log("incoming end date is:",endDate);
    console.log("incoming report type  is:",reportType);  
    console.log("incoming end date is:",duration);

      
            try {

                let newUserMonth = await User.aggregate([
                    {
                        $match: {
                         createdDate:{$gte: startDate , $lte: endDate}
                        }
                    },
                    {
                        $project:{
                            month: {$month: "$createdDate"},
                            year: {$year: "$createdDate"}
                         }
                    },
                    {
                        $group: {
                                    _id: {month: "$month", year: "$year"},
                                    count: {$sum: 1}
                             }
                    },
                    {$project: {
                        month: "$_id.month",
                        year: "$_id.year",
                        count: "$count",
                        _id: 0
                        }},
                        {
                                    $sort: { "month": 1 }
                                }
                                
                    
                ]);
    
          
                 res.send({code: 0, data:newUserMonth });
    
    
            } 
    
    
            catch (e) {
    
                console.log('Error occured, possible cause: '+e.message);
                res.send({code: 1, error: 'Error occured, possible cause: '+e.message})
    
            }

  

     



})


//----------------------------------------------------------------------------------










//////////////////////// DAILY ORDERS SUMMARY (D0S) REPORT /////////////////////////



server.post('/order/dailySummary', async (req, res) => {

    
    
    let startDate = req.body.startDate
    let  endDate  = req.body.endDate
    let reportType = req.body.reportType
    let duration  = req.body.duration


    startDate= new Date(startDate);
    endDate  = new Date(endDate);

    endDate = new Date (endDate.setDate(endDate.getDate()+1));


    console.log("incoming start date is:",startDate);
    console.log("incoming end date1 is:",endDate); 
    console.log("incoming report type  is:",reportType);
    console.log("incoming end date is:",duration);


       try {

           let orders = await Order.aggregate([
               {$match: {
                   createdDate:{$gte:startDate, $lte:endDate }
               }},
               { $project:{
                   day: { "$dayOfMonth" : "$createdDate"},
                   month: { "$month" : "$createdDate" },
                   year:{ "$year": "$createdDate" }
               }},
               { $project:{
                   created_dtm: {"$dateFromParts": { year: "$year", month: "$month", day: "$day" }}
               }},
               {$group: {
                   _id: "$created_dtm",
                   count: {$sum: 1},
               }},
               { $project:{
                    createdDate: "$_id",
                    count: "$count"
                }},
                {
                    $sort:{createdDate:1}

                }
           ]);

           
            res.send({code: 0, data:orders});


       } 


       catch (e) {

           console.log('Error occured, possible cause: '+e.message);
           res.send({code: 1, error: 'Error occured, possible cause: '+e.message})

       }




})


//------------------------------------------------------------------------------------






//////////////////////// MONTHLY ORDERS SUMMARY (MOS) REPORT ////////////////////////


server.post('/order/monthlySummary', async (req, res) => {



    let startDate = req.body.startDate

    let  endDate  = req.body.endDate

    let reportType = req.body.reportType

    let duration  = req.body.duration


    startDate= new Date(startDate)
    endDate  = new Date(endDate)


    console.log("incoming start date is:",startDate);  
    console.log("incoming end date is:",endDate);
    console.log("incoming report type  is:",reportType);  
    console.log("incoming end date is:",duration);

      
            try {

                let orders = await Order.aggregate([
                    {
                        $match: {
                         createdDate:{$gte: startDate , $lte: endDate}
                        }
                    },
                    {
                        $project:{
                            month: {$month: "$createdDate"},
                            year: {$year: "$createdDate"}
                         }
                    },
                    {
                        $group: {
                                    _id: {month: "$month", year: "$year"},
                                    count: {$sum: 1}
                             }
                    },
                    {$project: {
                        month: "$_id.month",
                        year: "$_id.year",
                        count: "$count",
                        _id: 0
                        }},
                        {
                                    $sort: { "month": 1 }
                                }
                                
                ]);
    
          
                 res.send({code: 0, data:orders });
    
    
            } 
    
    
            catch (e) {
    
                console.log('Error occured, possible cause: '+e.message);
                res.send({code: 1, error: 'Error occured, possible cause: '+e.message})
    
            }

  

})


//----------------------------------------------------------------------------------





//////////////////////// DAILY FINANCE REPORT (DFR) /////////////////////////



server.post('/finance/daily', async (req, res) => {


    
    let startDate = req.body.startDate
    let  endDate  = req.body.endDate
    let reportType = req.body.reportType
    let duration  = req.body.duration


    startDate= new Date(startDate);
    endDate  = new Date(endDate);

    endDate = new Date (endDate.setDate(endDate.getDate()+1));


    console.log("incoming start date is:",startDate);
    console.log("incoming end date1 is:",endDate); 
    console.log("incoming report type  is:",reportType);
    console.log("incoming end date is:",duration);


       try {

           let orders = await Order.aggregate([
               {$match: {
                   createdDate:{$gte:startDate, $lte:endDate }
               }},
               { $project:{
                   totalPrice:"$totalRevinue",
                   day: { "$dayOfMonth" : "$createdDate"},
                   month: { "$month" : "$createdDate" },
                   year:{ "$year": "$createdDate" }
               }},
               { $project:{
                   created_dtm: {"$dateFromParts": { year: "$year", month: "$month", day: "$day" }},
                   totalPrice:"$totalPrice"
               }},
               {$group: {
                   _id: "$created_dtm",
                   count: {$sum: 1},
                   revinue:{$sum:"$totalPrice"}
               }},
               { $project:{
                    createdDate: "$_id",
                    count: "$count",
                    revinue:"$revinue"
                }},
                {
                    $sort:{createdDate:1}

                }
           ]);

           
            res.send({code: 0, data:orders});


       } 


       catch (e) {

           console.log('Error occured, possible cause: '+e.message);
           res.send({code: 1, error: 'Error occured, possible cause: '+e.message})

       }



    

})


//--------------------------------------------------------------------------




//////////////////////// DAILY FINANCE REPORT (DFR) /////////////////////////



server.post('/finance/Monthly', async (req, res) => {


    
    let startDate = req.body.startDate
    let  endDate  = req.body.endDate
    let reportType = req.body.reportType
    let duration  = req.body.duration


    startDate= new Date(startDate);
    endDate  = new Date(endDate);

    endDate = new Date (endDate.setDate(endDate.getDate()+1));


    console.log("incoming start date is:",startDate);
    console.log("incoming end date1 is:",endDate); 
    console.log("incoming report type  is:",reportType);
    console.log("incoming end date is:",duration);


       try {

           let orders = await Order.aggregate([
               {$match: {
                   createdDate:{$gte:startDate, $lte:endDate }
               }},
               { $project:{
                   totalPrice:"$totalRevinue",
                   day: { "$dayOfMonth" : "$createdDate"},
                   month: { "$month" : "$createdDate" },
                   year:{ "$year": "$createdDate" }
               }},
               { $project:{
                   created_dtm: {"$dateFromParts": { year: "$year", month: "$month"}},
                   totalPrice:"$totalPrice",
                   day:"$day"
               }},
               {$group: {
                   _id: "$created_dtm",
                   count: {$sum: 1},
                   revinue:{$sum:"$totalPrice"}
               }},
               { $project:{
                    createdDate: "$_id",
                    count: "$count",
                    revinue:"$revinue"
                }},
                    {
                                $sort: { "createdDate": 1 }
                    }
                            
           ]);

           
            res.send({code: 0, data:orders});


       } 


       catch (e) {

           console.log('Error occured, possible cause: '+e.message);
           res.send({code: 1, error: 'Error occured, possible cause: '+e.message})

       }



    

})


//--------------------------------------------------------------------------





//////////////////////////// DELETE ALL COLLECTIONS  DATA /////////////////////



server.delete('/delete/all', async(req, res) => {
    

     let d = req.query.delete;

     console.log(d);

    try  {
        

        if(d===""||d===undefined)
        {

            let activeUser = await ActiveUser.deleteMany({})

            let category = await Category.deleteMany({})
    
            let subCategory = await SubCategory.deleteMany({})
    
            let order = await Order.deleteMany({})
    
            let orderDetails =  await OrderDetail.deleteMany({})
    
            let product = await Product.deleteMany({})
    
            let productRating = await ProductRating.deleteMany({})
    
            let user = await User.deleteMany({})
    

            console.log("Delete response activeUser:",activeUser);
            console.log("Delete response category:",category);
            console.log("Delete response subCategory:",subCategory);
            console.log("Delete response order:",order);
            console.log("Delete response orderDetails:",orderDetails);
            console.log("Delete response product:",product);
            console.log("Delete response  productRating:",productRating);
            console.log("Delete response user:",user);


            res.send({code:0, message:"All collections Documents Deleted Successfully",
            activeUser:activeUser,
            category:category,
            subCategory:subCategory,
            order:order,
            orderDetails:orderDetails,
            product:product,
            productRating:productRating,
            user:user
            })

        }

        else  if(d==="activeUser"){

            let activeUser = await ActiveUser.deleteMany({})
            res.send({code:0, message:"ActiveUser  Collection Documents Deleted Successfully",activeUser:activeUser})
         }

      else  if(d==="category"){

            let category = await Category.deleteMany({})
            res.send({code:0, message:"Category  Collection Documents Deleted Successfully",category:category})

        }

       else if(d==="subCategory"){

            let subCategory = await SubCategory.deleteMany({})
            res.send({code:0, message:"SubCategory Collection Documents Deleted Successfully",subCategory:subCategory})

        }

      else  if(d==="order"){

            let order = await Order.deleteMany({})
            res.send({code:0, message:"Order Collection Documents Deleted Successfully",order:order})

        }

      else  if(d==="orderDetails"){

            let orderDetails =  await OrderDetail.deleteMany({})
            res.send({code:0, message:"orderDetails Collection Documents Deleted Successfully",orderDetails:orderDetails})
        }

      else  if(d==="product"){

            let product = await Product.deleteMany({})
            res.send({code:0, message:"product Collection Documents Deleted Successfully",product:product})
        }

      else  if(d==="productRating"){

            let productRating = await ProductRating.deleteMany({})
            res.send({code:0, message:"productRating Collection Documents Deleted Successfully",productRating:productRating})

        }

      else  if(d==="user"){

            
            let user = await User.deleteMany({})
            res.send({code:0, message:"user Collection Documents Deleted Successfully",user:user})
    

        }
        



        }
    
    catch (e) {
        
        console.log('Error occured, possible cause: '+e.message);
        res.send({code: 1, error: 'Error occured, possible cause: '+e.message});
    }



})




//-----------------------------------------------------------------------------











//=============================APIs End=================================================














    


















//////////////////////////////// STARTING SERVER ////////////////

server.listen(port,()=>{
    console.log("The server started successfully ");
    
    })
    
//---------------------------------------------------------------
    
    
    
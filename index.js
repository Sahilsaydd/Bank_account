var express = require("express")

var bodyparser = require("body-parser")

var util=require("util");
var mysql=require("mysql")


var app=express();

app.use(bodyparser.urlencoded({extended:true}));
var conn=mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"batch35_nodejs"

})

var exe=util.promisify(conn.query).bind(conn)

app.get("/", async function(req, res) {
    var sql = "SELECT * FROM bank_account";
    var data = await exe(sql);

  
    data = data.map(account => {
        if (account.birth_date) {
            account.birth_date = new Date(account.birth_date);
        }
        return account;
    });

    var obj = {
        "bank_accounts": data
    };

    res.render("create_account.ejs", obj);
});





app.post("/save_account", async function(req,res){


    var d=req.body;

    var sql=`INSERT INTO bank_account ( 
        user_name,
       user_mobile,
       user_email,
       user_address,
       pincode,
       birth_date,
       adhar_card_no,
       pan_card_no,
       gender,
       account_type,
       adhar_pan_link) VALUES (  

        '${d.user_name}',
       '${d.user_mobile}',
       '${d.user_email}',
       '${d.user_address}',
       '${d.pincode}',
       '${d.birth_date}',
       '${d.adhar_card_no}',
       '${d.pan_card_no}',
       '${d.gender}',
       '${d.account_type}',
       '${d.adhar_pan_link}' )`

       var data = await exe(sql)

       var obj={
        "bank_accounts":data[0]
       }

    //res.send(d)

    res.redirect("/")
})



app.get("/edit_bank_details/:id",async function(req,res){

    var id =req.params.id;

    var sql= `SELECT * FROM bank_account  WHERE user_id='${id}'`;

    var data= await exe(sql);

    var obj={
       "bank_accounts":data[0]
    }


    res.render("Update_bank_det.ejs",obj)
})



app.post("/edit_bank_details", async function(req, res) {
    var d = req.body;

    var sql = `UPDATE bank_account SET 
        user_name='${d.user_name}',
        user_mobile='${d.user_mobile}',
        user_email='${d.user_email}',
        user_address='${d.user_address}',
        pincode='${d.pincode}',
        birth_date='${d.birth_date}',
        adhar_card_no='${d.adhar_card_no}',
        pan_card_no='${d.pan_card_no}',
        gender='${d.gender}',
        account_type='${d.account_type}',
        adhar_pan_link='${d.adhar_pan_link}' 
        WHERE user_id='${d.user_id}'`;

    await exe(sql);
    res.redirect("/");
});



app.get("/delete_bank_details/:id",async function(req,res){


    var id =req.params.id;

    var sql=`DELETE FROM bank_account WHERE user_id ='${id}'`;

    var data = await exe(sql);

    var obj={
       " bank_accounts":data
    };

    res.redirect("/")
});




app.listen(1000);
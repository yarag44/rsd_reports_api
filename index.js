const express = require("express");

const app= express();

const port = process.env.PORT | 3000;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const pool = require("./db");

app.use(express.json());




//ROUTES

app.get("/",async (req,res) => {

    res.send("Hello World");

});


app.get("/report",async (req,res) => {

    try {
        
        const residential=req.query.Residential;

        if(!residential)  
        {
            res.send({message:'Residential parameter is required*'}); 
            return;
        }
        let query = "select *,(coalesce(\"Jan\",0) + coalesce(\"Feb\",0) + coalesce(\"Mar\",0) + coalesce(\"Apr\",0) + coalesce(\"May\",0) + coalesce(\"Jun\",0) + coalesce(\"Jul\",0) + coalesce(\"Aug\",0) + coalesce(\"Sep\",0) + coalesce(\"Oct\",0) + coalesce(\"Nov\",0) + coalesce(\"Dec\",0)) yearamount " +
        " from crosstab( " +
        " 'SELECT * FROM ( " +
        " SELECT  A.ResidentName,A.name,A.house,b.year,b.month,SUM(cast(b.amount as int)) amount " +
        " FROM ( " +
        " select user_links.resident_id,res_residential.residential_id,residential.name,concat(res.name , '' '' , res.last_name) ResidentName,res.house  from residents res " +
        " inner join residents_user_links user_links on res.id=user_links.resident_id " + 
        " inner join residents_residential_links res_residential on res.id=res_residential.resident_id " +
        " inner join residentials residential on residential.id=res_residential.residential_id " +
        " ) A " +
        " LEFT JOIN ( " +
        " SELECT res_pay.id,res_user.resident_id res_id,res_pay.year,res_pay.month,res_pay.amount " +
        " FROM resident_pays res_pay " +
        " INNER JOIN resident_pays_user_links res_pay_user ON res_pay.id=res_pay_user.resident_pay_id " +
        " INNER JOIN residents_user_links res_user ON res_user.user_id=res_pay_user.user_id " +
        " INNER JOIN residents_residential_links res_residencial ON res_residencial.resident_id = res_user.resident_id " +
        " WHERE res_pay.Is_Paid = true " +
        " ) B ON A.resident_id=B.res_id " +
        " WHERE A.residential_id=" + residential.toString() +
        " GROUP BY A.name, A.ResidentName,A.house,b.year,b.month " +
        " ) Pays WHERE Pays.year > 0','select m from generate_series(1,12) m' ) as ( " +
        " ResidentName varchar(2000), " +
        " Residential varchar(2000), " +
        " House varchar(100), " +
        " year int, " +
        "\"Jan\" int, " +
        "\"Feb\" int, " +
        "\"Mar\" int, " +
        "\"Apr\" int, " +
        "\"May\" int, " +
        "\"Jun\" int, " +
        "\"Jul\" int, " +
        "\"Aug\" int, " +
        "\"Sep\" int, " +
        "\"Oct\" int, " +
        "\"Nov\" int, " +
        "\"Dec\" int " +
        "  );";
  
          
       const result = await pool.query(query);

       console.log(result);

       res.json(result.rows);

    } catch (error) {
        console.log(error);
    }

   //console.log('Entro a report');

});


app.listen (port, () => {

    console.log("Server Running on port 3000");

});




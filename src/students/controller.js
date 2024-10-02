const { response } = require('express');
const pool = require('../../dbconn')   
const queries  = require('./queries')
const cors = require ('cors')
const jwt = require ('jsonwebtoken')
//
const cookieParser = require('cookie-parser')
const express = require ('express')
const app = express()

app.use(cors(
    {
    origin: 'http://localhost:3000',
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE",],

}
));

app.use(cookieParser())
app.use(express.json()); 

const bcrypt = require('bcrypt');
const saltRounds = 10;

const getStudents = (req, res)=>{
    pool.query(queries.getAllCustomers).then((result)=>{
        res.status(200).json(result.rows)
    }).catch((error)=> console.log(error))
};
const getmexCustomers= ((req ,res)=>{
    pool.query(queries.mexicoCustomers).then((results)=>{
        res.status(200).json(results.rows)
    }).catch((err)=>console.log(err))
});
const getcustomerById = ((req, res)=>{
    const id = parseInt(req.params.id)
    pool.query(queries.getCustId, [id]).then((response)=>{
        res.status(200).json(response.rows)
    }).catch((err)=> console.log(err))
});
const postCustomer = ((req, res)=>{
    const {customer_name, contact_name, address, city, postal_code, country } = req.body
    pool.query(queries.checkContactExist, [contact_name]).then((response)=>{
        if(response.rows.length){
            return res.send("Contact name already Taken");
        }
        //add new customer
        pool.query(queries.addCustomer, [customer_name,contact_name,address,city,postal_code,country])
        .then((response)=>{
            res.status(201).send("customer added Successfully")
            console.log(response.rows)
        }).catch((err)=> console.log(err))     
    }).catch((err)=> console.log(err))
})

const regUser =((req, res)=>{
    const {name, email, password} = req.body;
    
    bcrypt.hash(password, saltRounds).then((hash)=>{
        pool.query(queries.CheckEmailExist, [email]).then((response)=>{
            
            if (response.rows.length){
                
                return res.send("email already Exist!")
            }
          
            return pool.query(queries.addUser, [name, email, hash]).then((response)=>{
                res.set('Access-Control-Allow-Origin', '*');
                res.status(201).send("User Registered Successfully")
            }).catch((err)=>{
                console.log(err)
            })
        })

    }).catch((err)=>{
        return res.json({error: "Error Hashing Password", err})
        
    })
});

const isuserAuth = (req,res)=>{
    res.send("User is authenticated");
};

const loginUser = ((req, res)=>{
    const {email, password} = req.body;
    pool.query(queries.CheckEmailExist, [email] ).then((data)=>{
        // console.log("login Query results", data.rows)
        if(data.rows.length > 0){
            bcrypt.compare(password, data.rows[0].password).then((response)=>{
                if(response){
                    const id = data.rows[0].user_id;
                    //console.log(data.rows[0]);
                    res.set('Access-Control-Allow-Origin', '*');
                    const token = jwt.sign({id}, "jwt-secret-key", {expiresIn:86400000});
                   res.cookie('token', token)
                   console.log(token)
                    res.json({Status:"login success", auth: true, token: token})
                }
               else {
                return res.json({Error:"Password did not match", auth:false})
            }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else {
            return res.json({Error:"Email doesnt Exist", auth:false  })
        }
    }).catch((err)=> console.log(err));
});

const travels = ((req,res)=>{
    //TODO: add query
})


module.exports = {
    getStudents,getmexCustomers,getcustomerById,postCustomer,regUser,loginUser,isuserAuth
}
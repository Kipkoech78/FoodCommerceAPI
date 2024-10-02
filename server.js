const express = require ('express')
const studentrout = require('./src/students/routes')
const controller = require('./src/students/controller')
require('dotenv').config();

const cors = require ('cors')
const jwt = require ('jsonwebtoken')
const cookieParser = require('cookie-parser')
const port= process.env.PORT
// const jwtsecret= process.env.TOCKENSECRET
// const headertoken = process.env.HEADERACCESSTOKEN


const app = express()
app.use(express.json())
app.use(cors(
    {
    origin:('*'),
   // origin:'http://127.0.0.1:3000/',
    methods:["POST","GET"],
    credentials:false
}
));
app.use(cookieParser())

app.get('/', (req, res)=>{
    res.send("Hello World");
});
const verifyJWT=(req,res,next)=>{
    const token = req.headers['x-access-token'] ;
    if(!token){
        res.send("Token not provided")
    }else{
        jwt.verify(token, 'jwt-secret-key', (err, decoded)=>{
            if(err){
                res.json({auth:false, message:"You failed to authenticate"})
            }else{
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.use('/api/v1/students', studentrout)
app.use('/api/v1/mexico', studentrout)
app.post('/register', controller.regUser );
app.post('/v1/login' ,  controller.loginUser );
app.get('/isUserAuth',verifyJWT, controller.isuserAuth);


app.listen(port, function(){
    console.log("server is running on Port", port)
} )
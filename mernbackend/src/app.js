const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers")

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path))

app.set("view engine", "hbs");

app.get("/", (req,res) =>{
    res.render("index")
})
app.get("/register", (req,res) =>{
    res.render("register")
})

//create a new user in our database
app.post("/register", async (req,res) =>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirm_password;
        
        if (password == cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                email: req.body.email,
                password:password,
                confirm_password:cpassword
            })

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }else{
            res.send("password are not matching")
        }
    }catch(err){
        res.status(400).send(err);
    }
})

app.get("/login", (req,res) =>{
    res.render("login")
})
app.post("/login", async(req,res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email}); //pehla wala database ka email aur dusra user jo likh rahha
        
        if(useremail.password == password){
            res.status(201).render("index");
        }else{
            res.send("invalid login details")
        }
    } catch(err){
        res.status(400).send("invalid email")
    }
})

app.get("/", (req,res) =>{
    res.send("hello from lucky")
});

app.listen(port, () =>{
    console.log(`server is running at port no ${port}`);
})
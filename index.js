const express = require("express");
const Jwt = require("jsonwebtoken");
const jwtkey = "shivu@123";
const Users = require("./db/Users");
const Product = require("./db/Product");
require("./db/config");
require("./db/Users");
const app = express();

app.use(express.json());


app.get("/products", async (req, res) => {
    let data = await Product.find({});
    if (data.length > 0) {
        res.send(data);
    }
    {
        res.send({ result: "No Products Found" })
    }
});

app.get("/product/:_id", async (req, res) => {
    let data = await Product.findOne(req.params);
    if (data) {
        res.send(data);
    }
    else {
        res.send("Product Not Found");
    }
})

app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find(
        {
            "$or": [
                { name: { $regex: req.params.key } },
                { brand: { $regex: req.params.key } },
            ]
        }
    )
    res.send(result);
})


app.post("/register", async (req, res) => {
    let user = new Users(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send("something went wrong")
        } res.send({ result, auth: token });
    })
})

app.post("/login", async (req, res) => {
    if (req.body.password && req.body.name) {
        let user = await Users.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send("something went wrong")
                } res.send({ user, auth: token });
            })
        }
        else {
            res.send("User Not Found");
        }
    }
    else {
        res.send("Name and password is required");
    }


})


app.post("/add-product", async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save()
    res.send(result);
})


app.put("/product/:id", async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );
    res.send(result);
})


app.delete("/product/:_id", async (req, res) => {
    let data = await Product.deleteOne(req.params);
    res.send(data);
})


function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(" ")[1];
        console.log(token);
        Jwt.verify(token,jwtkey,(err,valid)=>{
            if(err)
            {
                res.send("Please add valid token");
            }
            else{
                next();
            }
        })

    }
    else{
        res.send({result:"Please add JWT Token with headers"});
    }
}

app.listen(3000, () => {
    console.log("Listening to port 3000")
});
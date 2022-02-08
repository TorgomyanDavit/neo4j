import express from "express"
import session from "express-session"
// import passport from "passport"
import path from "path"
import fs from "fs"
// import bcrypt from "bcrypt"
// import passportLocal from "passport-local"
// import Graph DB neo4j 
import neo4j from "neo4j-driver"

const driver = neo4j.driver(
    "neo4j://localhost",
    neo4j.auth.basic("neo4j","foobar")
);

const cleanup = (event) => {
    driver.close(); // close connection
    process.exit(); // close node process
};

process.on("SIGINT",cleanup);
process.on("SIGTERM",cleanup);

const sission = driver.session({
    database:"neo4j",
    defaultAccessMode:neo4j.session.WRITE, //WRITE | READ
});

sission.run("CREATE (james:Person {name : $nameParam}) RETURN james.name AS name",{
    nameParam: "James",
})
.then((result) => {
    result.records.forEach((record) => {
        console.log(record.get("name"));
    });
})
.catch((error) => {
    console.log(error);
})
.then(() => sission.close())







const app = express()

app.use(express.static("public"))
app.use(session({
    secret:process.env.SECRET,
    // cookie:{maxAge:6000},
    saveUninitialized:false,
    resave:false
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res) => {
    // res.redirect("main.html")
    res.send("hello")
    // res.sendFile(path.resolve("public/main.html"))
})

app.listen(process.env.PORT)
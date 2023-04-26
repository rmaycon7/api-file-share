const express = require("express");

// const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

const router = express.Router();

// app.use(cors({ origin: "null" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = () => process.env.PORT || 6666;

require("./app/routes/index")(app);

app.use((req, res, next) => {
    const error = new Error("Resource Not Found!");
    error.status = 404;
    next(error);
});

app.use((error, req, res, mext) => {
    res.status(error.status || 500);
    res.send({
        error: error.status + "!" + error.message
    });
});

// console.

app.listen(port()
           , error => {
    // if(error) console.log({erro: error})
    // else
    if(!error){
        
        console.clear();
        console.log("server run port " + port());
    }
});
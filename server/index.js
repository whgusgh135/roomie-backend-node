const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// const mongoose = require("mongoose");
// mongoose.Promise = Promise;
// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });




const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
    console.log("Server Running");
});
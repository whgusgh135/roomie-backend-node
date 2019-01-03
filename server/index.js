const express = require("express");
const app = express();
const config = require("./config/dev");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(config.DB_URI, { useNewUrlParser: true });


// routes
const userRoutes = require("./routes/user");

app.use("/api/user", userRoutes);


// error handler
app.use(function(error, request, response, next) {
    return response.status(error.status || 500)
        .json({ error: {
            message: error.message || "Something went wrong."
        }})
});


// server running
const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
    console.log("Server Running");
});
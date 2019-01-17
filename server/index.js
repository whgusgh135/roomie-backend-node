const express = require("express");
const app = express();
const config = require("./config/dev");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(config.DB_URI, { useNewUrlParser: true });

// const cors = require("cors");
// app.use(cors());


// routes
const userRoutes = require("./routes/user");
const roomieRoutes = require("./routes/roomie");
const rentRoutes = require("./routes/rent");

app.use("/api/user", userRoutes);
app.use("/api/roomie", roomieRoutes);
app.use("/api/rent", rentRoutes);


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
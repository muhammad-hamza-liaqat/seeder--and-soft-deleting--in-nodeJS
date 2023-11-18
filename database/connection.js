const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.databaseConnectionString).then(()=>{
    console.log("mongoose connected!")
}).catch(()=>{
    console.log("mongoose not connected!")
})

module.exports = mongoose;
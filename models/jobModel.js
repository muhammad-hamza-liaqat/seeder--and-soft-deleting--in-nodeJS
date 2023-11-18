const mongoose = require("mongoose");

const jobSchema= new mongoose.Schema({
    Detail:{
        type: String
    }
})

const Job = mongoose.model('jobs', jobSchema);
module.exports = Job
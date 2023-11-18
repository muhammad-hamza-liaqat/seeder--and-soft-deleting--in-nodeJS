const express = require("express");
const app = express();
require("./database/connection")
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/user");
const admninRoutes = require("./routes/admin");
const adminRoute = require("./routes/admin");



//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/user', userRoutes);
app.use('/admin', adminRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

//server port
app.listen(process.env.PORT, ()=>{
    console.log(`server running at http:localhost:${process.env.PORT}/`);
})
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const postRoutes = require("./route/posts/postRoute");
const commentRoutes = require("./route/comments/commentRoute");
const emailRoutes = require("./route/emailMsg/emailMsgRoute");
const categoryRoute = require("./route/category/categoryRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");



const app = express();
//DB
dbConnect();


//Middleware
app.use(express.json());
//cors
app.use(cors());


//Users route
app.use('/api/users' , userRoutes);
//posts route
app.use('/api/posts' , postRoutes);
//comments route
app.use('/api/comments' , commentRoutes);
//email route
app.use('/api/email' , emailRoutes);
//category route
app.use('/api/category' , categoryRoute);

//err handler
app.use(notFound);
app.use(errorHandler);
//server
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in PORT ${PORT}`));



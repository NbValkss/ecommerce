const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoute");
const prodcategoryRouter = require("./routes/prodcategoryRoute");
const blogRouter = require("./routes/blogRoutes");
const blogCatRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const morgan = require("morgan");


dbConnect();
app.use(morgan("logic Gate"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/prodcategory", prodcategoryRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/brand", brandRouter);

app.use(cookieParser());
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () =>{
    console.log(`Server is running at PORT ${PORT}`);
});
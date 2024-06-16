const express = require("express");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require('dotenv').config();

app.use(cors({
  origin: ['http://localhost:3000',],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

// import routes

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const orderRouter = require("./routes/orderRoute");
const shopRouter = require("./routes/shopRoute");
const WithdrawRouter = require("./routes/withdrawRoute");
const paymentRouter = require("./routes/paymentRoute");


app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product-category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", shopRouter);
app.use("/api/withdraw", WithdrawRouter);
app.use("/api/payment", paymentRouter);

// it's for ErrorHandling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
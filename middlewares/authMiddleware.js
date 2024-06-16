const User = require("../models/userModel");
const Shop = require("../models/shopModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) 
    {
        token = req.headers.authorization.split(" ")[1];
        try {
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            } 
        } catch (error) {
            throw new Error("Not authorized, token failed");
        }
    } else {
        throw new Error("There is no token attached to header");
    }
});

const isSeller = asyncHandler(async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new Error("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);

    req.seller = await Shop.findById(decoded.id);

    next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
        throw new Error("Only Admins can access this route");
    } else {
        next();
    }
})

module.exports = {authMiddleware, isAdmin, isSeller};

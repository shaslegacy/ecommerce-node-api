const express = require("express");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../models/shopModel");
const cloudinary = require("cloudinary");
const sendShopToken = require("../config/shopToken");
const asyncHandler = require("express-async-handler");

// create shop
const createShop = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return next(new Error("User already exists"));
    }

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "public/images/avatars",
    });


    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };
    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:6001/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new Error(error.message, 500));
    }
  } catch (error) {
    return next(new Error(error.message, 400));
  }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
const shopActivation = asyncHandler(async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
        );

        if (!newSeller) {
        return next(new Error("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

        let seller = await Shop.findOne({ email });

        if (seller) {
        return next(new Error("User already exists", 400));
        }

        seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
        });

        sendShopToken(seller, 201, res);
    } catch (error) {
        return next(new Error(error.message, 500));
    }
});

// login shop
const loginSeller = asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new Error("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new Error("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new Error("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new Error(error.message, 500));
    }
});

// load shop
  const getSeller = asyncHandler(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.seller._id);
  
        if (!seller) {
          return next(new Error("User doesn't exists", 400));
        }
  
        res.status(200).json({
          success: true,
          seller,
        });
      } catch (error) {
        return next(new Error(error.message, 500));
      }
  });

// log out from shop

const sellerLogOut = asyncHandler(async (req, res, next) => {
    try {
        res.cookie("seller_token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.status(201).json({
          success: true,
          message: "Log out successful!",
        });
      } catch (error) {
        return next(new Error(error.message, 500));
      }
})

// get shop info

const getShopInfo = asyncHandler(async (req, res, next) => {
try {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({
        success: true,
        shop,
    });
   } catch (error) {
        return next(new Error(error.message, 500));
    }
});

// update shop avatar
const updateShopAvatar = asyncHandler(async (req, res, next) => {
  try {
    let existsSeller = await Shop.findById(req.seller._id);

    // Check if existsSeller.avatar is defined and has a public_id
    if (existsSeller.avatar && existsSeller.avatar.public_id) {
      const imageId = existsSeller.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);
    }

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "public/images/avatars",
      width: 150,
    });

    existsSeller.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await existsSeller.save();

    res.status(200).json({
      success: true,
      seller: existsSeller,
    });
  } catch (error) {
    return next(new Error(error.message || "An error occurred while updating the avatar", 500));
  }
});

// update seller info

const updateShopInfo = asyncHandler(async (req, res, next) => {
    try {
    const { name, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findOne(req.seller._id);

    if (!shop) {
        return next(new Error("User not found", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    res.status(201).json({
        success: true,
        shop,
    });
    } catch (error) {
        return next(new Error(error.message, 500));
    }
})

// all sellers --- for admin

const getAllSellers = asyncHandler(async (req, res, next) => {
    try {
        const sellers = await Shop.find().sort({
          createdAt: -1,
        });
        res.status(201).json({
          success: true,
          sellers,
        });
      } catch (error) {
        return next(new Error(error.message, 500));
      }
})

// delete seller ---admin

const deleteSeller = asyncHandler(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.params.id);
  
        if (!seller) {
          return next(
            new Error("Seller is not available with this id", 400)
          );
        }
  
        await Shop.findByIdAndDelete(req.params.id);
  
        res.status(201).json({
          success: true,
          message: "Seller deleted successfully!",
        });
      } catch (error) {
        return next(new Error(error.message, 500));
      }
})

// update seller withdraw methods --- sellers

const updateWithdrawMethods = asyncHandler(async (req, res, next) => {
    try {
        const { withdrawMethod } = req.body;
  
        const seller = await Shop.findByIdAndUpdate(req.seller._id, {
          withdrawMethod,
        });
  
        res.status(201).json({
          success: true,
          seller,
        });
      } catch (error) {
        return next(new Error(error.message, 500));
      }
});

// delete seller withdraw methods --- only seller

const deleteWithdrawMethod = asyncHandler(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.seller._id);
  
        if (!seller) {
          return next(new Error("Seller not found with this id", 400));
        }
  
        seller.withdrawMethod = null;
  
        await seller.save();
  
        res.status(201).json({
          success: true,
          seller,
        });
      } catch (error) {
        return next(new Error(error.message, 500));
      }
})

module.exports = {
  createShop,
  shopActivation,
  loginSeller,
  getSeller,
  sellerLogOut, 
  getShopInfo,
  updateShopInfo,
  updateShopAvatar,
  getAllSellers,
  deleteSeller,
  updateWithdrawMethods,
  deleteWithdrawMethod
};
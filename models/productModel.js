const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter your product name!"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, "Please enter your product price!"],
    },
    category: {
      type: String,
      required: [true, "Please enter your product category!"],
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: [true, "Please enter your product stock!"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    color: [],
    tags: String,
    reviews: [
      {
        user: {
          type: Object,
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        productId: {
          type: String,
        },
        createdAt:{
          type: Date,
          default: Date.now(),
        }
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
    shopId: {
      type: String,
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    sold_out: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);

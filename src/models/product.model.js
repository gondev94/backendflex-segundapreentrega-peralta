import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  thumbnail: String,
  status: {
    type: Boolean,
    default: true,
    required: false,
  },
  create_at: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;

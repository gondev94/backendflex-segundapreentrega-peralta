import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: {type: String, index: "text"},
  thumbnail: {type: String, default: ""},
  code: {type: String, unique: true},
  price: Number,
  stock: Number,
  category: {type: String, index: true},
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

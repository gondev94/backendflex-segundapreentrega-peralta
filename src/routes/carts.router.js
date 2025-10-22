import express from "express";
import Cart from "../models/cart.model.js";

const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartRouter.get("/:cid", async(req, res) =>{
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid);
    if(!cart) return res.status(500).json({ status: "error", message: "carrito no encontrado"});

    res.status(200).json({status: "success", payload: cart.products});
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message});
  }
})

cartRouter.post("/:cid/product/:pid", async(req, res)=>{
    try {
        const {cid, pid} = req.params;
        const { quantity } = req.body;

        const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { product: pid, quantity } } }, {new: true, runValidators: true});
        res.status(200).json({ status: "success", payload: updatedCart });

      } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

export default cartRouter;

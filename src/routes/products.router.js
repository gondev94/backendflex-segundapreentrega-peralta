import express from "express";
import ProductManager from "../productManager.js";
import Product from "../models/product.model.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

// productsRouter.post("/", uploader.single("file"), async(req, res) => {
//     const title = req.body.title;
//     const description = req.body.description;
//     const price = parseInt(req.body.price);
//     const stock = parseInt(req.body.stock);
//     const thumbnail = "/img/" + req.file.filename;

//     await productManager.addProduct({title, description, price, stock, thumbnail});
//     res.redirect("/realTimeProducts");
// });

productsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Error al cuperar los productos", error });
  }
});

productsRouter.post("/", uploader.single("file"), async (req, res) => {
  try {
    const { title, description, price, stock, thumbnail } = req.body;
    const product = new Product({
      title,
      description,
      price,
      stock,
      thumbnail,
    });
    await product.save();

    res.status(201).json({ status: "success", payload: product });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el producto", error: error.message });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const updateProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });
    if (!updateProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ status: "success", payload: updateProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar el producto" });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.status(200).json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar el producto" });
  }
});
export default productsRouter;

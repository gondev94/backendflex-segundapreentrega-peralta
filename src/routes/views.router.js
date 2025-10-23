import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    const data = await Product.paginate({}, { limit, page, lean: true });
    const products = data.docs;
    delete data.docs;

    const links = [];

    for (let index = 1; index <= data.totalPages; index++) {
      links.push({ text: index, link: `?limit=${limit}&page=${index}` });
    }

    res.render("home", { products, links });
  } catch (error) {}
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
  try {
    const { limit = 4, page = 1 } = req.query;

    const data = await Product.paginate({}, { limit, page, lean: true });
    const products = data.docs;
    delete data.docs;

    const links = [];

    for (let index = 1; index <= data.totalPages; index++) {
      links.push({ text: index, link: `?limit=${limit}&page=${index}` });
    }

    res.render("realTimeProducts", { products, links });
  } catch (error) {

  }
});


viewsRouter.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});
export default viewsRouter;

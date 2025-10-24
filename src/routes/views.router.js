import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    
    console.log("📄 Cargando home - limit:", limit, "page:", page);
    
    const data = await Product.paginate({}, { limit, page, lean: true });
    
    console.log("📦 Productos encontrados:", data.docs.length);
    console.log("📊 Total en DB:", data.totalDocs);
    console.log("📄 Total páginas:", data.totalPages);
    
    const products = data.docs;
    
    // Si no hay productos, mostrar advertencia
    if (products.length === 0) {
      console.log("⚠️ WARNING: No hay productos en la base de datos!");
    }
    
    delete data.docs;

    const links = [];

    for (let index = 1; index <= data.totalPages; index++) {
      links.push({ text: index, link: `?limit=${limit}&page=${index}` });
    }

    res.render("home", { 
      products, 
      links,
      pagination: data,
      currentPage: parseInt(page),
      totalPages: data.totalPages
    });
  } catch (error) {
    console.error("❌ Error en home:", error);
    res.status(500).send("Error al cargar productos");
  }
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
  try {
    const { limit = 4, page = 1 } = req.query;

    console.log("📄 Cargando realTimeProducts - limit:", limit, "page:", page);

    const data = await Product.paginate({}, { limit, page, lean: true });
    
    console.log("📦 Productos encontrados:", data.docs.length);
    
    const products = data.docs;
    delete data.docs;

    const links = [];

    for (let index = 1; index <= data.totalPages; index++) {
      links.push({ text: index, link: `?limit=${limit}&page=${index}` });
    }

    res.render("realTimeProducts", { 
      products, 
      links,
      pagination: data,
      currentPage: parseInt(page),
      totalPages: data.totalPages
    });
  } catch (error) {
    console.error("❌ Error en realTimeProducts:", error);
    res.status(500).send("Error al cargar productos");
  }
});

viewsRouter.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("📄 Cargando producto:", id);
    
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    
    console.log("📄 Cargando carrito:", cid);
    
    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error("❌ Error al cargar carrito:", error);
    res.status(500).send("Error al cargar el carrito");
  }
});

export default viewsRouter;
import express from "express"; // 1 importamos express desde la libreria
import { engine } from "express-handlebars"; // 2 importamos el motor de plantillas
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import connectMongodb from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"
import cartRouter from "./routes/carts.router.js";
import Product from "./models/product.model.js";


dotenv.config(); // iniciamos las variables de entorno 
const app = express(); // 3creamos variable para contener la funcionalidad de expresss para poder levantar nuestro servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
connectMongodb();
const server = http.createServer(app);
const PORT = process.env.PORT;



const io = new Server(server);

//handlebars config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public")); //4indicamos la carpeta publica para los archivos estaticos

//enpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  // ✅ CAMBIO 1: COMENTADO - Ya no enviamos todos los productos al conectarse
  // Esto causaba problemas de paginación
  /*
  const products = await Product.find().lean();
  socket.emit("updateProducts", products);
  */

  // Escuchar creación de nuevo producto desde el cliente
  socket.on("new product", async (newProduct) => {
    try {
      const product = new Product(newProduct);
      await product.save();

      // ✅ CAMBIO 2: Ya no enviamos todos los productos, solo notificamos
      /*
      const updatedProducts = await Product.find().lean();
      io.emit("updateProducts", updatedProducts);
      */
      
      // ✅ Solo notificamos que se agregó un producto
      io.emit("productAdded");
      console.log("✅ Producto agregado exitosamente");
    } catch (error) {
      console.error("❌ Error al agregar producto:", error.message);
    }
  });

  // Escuchar eliminación de producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      
      // ✅ CAMBIO 3: Ya no enviamos todos los productos, solo notificamos
      /*
      const updatedProducts = await Product.find().lean();
      io.emit("updateProducts", updatedProducts);
      */
      
      // ✅ Solo notificamos que se eliminó un producto
      io.emit("productDeleted");
      console.log("✅ Producto eliminado exitosamente");
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error.message);
    }
  });
});


server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
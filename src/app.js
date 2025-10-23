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
  console.log("🟢 Nuevo cliente conectado");

  // Enviar productos actuales al conectarse
  const products = await Product.find().lean();
  socket.emit("updateProducts", products);

  // Escuchar creación de nuevo producto desde el cliente
  socket.on("new product", async (newProduct) => {
    try {
      const product = new Product(newProduct);
      await product.save();

      const updatedProducts = await Product.find().lean();
      io.emit("updateProducts", updatedProducts);
    } catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  });

  // Escuchar eliminación de producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      const updatedProducts = await Product.find().lean();
      io.emit("updateProducts", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  });
});


server.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto 8085");
});

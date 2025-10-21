import express from "express"; // 1 importamos express desde la libreria
import { engine } from "express-handlebars"; // 2 importamos el motor de plantillas
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import connectMongodb from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import ProductManager from "./productManager.js";
import dotenv from "dotenv"


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

const products = [];
const productManager = new ProductManager("./src/products.json");

//websocket

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  //emitimos un evento desde el server al cliente
  socket.emit("mensaje", { greeting: "Bienvenido al servidor" });

  socket.on("new product", (data) => {
    products.push(data);

    io.emit("productslist", data);
  });

  socket.on("deleteProduct", async (productId) => {
    const updatedProducts = await productManager.deleteProductById(productId);
    products.length = 0;
    products.push(...updatedProducts);
    io.emit("updateProducts", updatedProducts);
  });
});


server.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto 8085");
});

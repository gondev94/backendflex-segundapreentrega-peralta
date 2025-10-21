import mongoose from "mongoose";

const connectMongodb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gondev:gondevpass@ecommerce.aiokya5.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Ecommerce"
    );
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("Error al conectar con MongodB", error);
  }
};


export default connectMongodb;
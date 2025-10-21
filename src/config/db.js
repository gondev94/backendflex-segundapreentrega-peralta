import mongoose from "mongoose";

const connectMongodb = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("Error al conectar con MongodB", error);
  }
};


export default connectMongodb;
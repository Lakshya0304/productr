import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import { protect } from "./middleware";
import product from "./routes/product";
import connectDB from "./database/db";
import dotenv from "dotenv";


dotenv.config(); 
const app = express();

app.use(cors());
app.use(express.json());
connectDB();
app.use("/auth", auth);
app.use("/product",protect , product);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

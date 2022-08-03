import express from "express";
// import { addRoutesToExpressInstance } from "./routes";
import cors from "cors";

const app = express();
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOpts));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// addRoutesToExpressInstance(app);

export default app;

import express from "express";
import cors from "cors";
import scraperRoutes from "./routes/scraper.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, "..","public")));
app.use(express.json());
app.use("/api",scraperRoutes);

export default app;
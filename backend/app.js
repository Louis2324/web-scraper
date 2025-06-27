import express from "express";
import cors from "cors";
import scraperRoutes from "./routes/scraper.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api",scraperRoutes);

app.get("/",(req,res)=>{
    res.send("Webtoon scraper is running live");
})

export default app;
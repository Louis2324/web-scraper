import express from "express";
import { scrapeWebtoon } from "../controllers/scrape.controller.js";
import { downloadEpisodes } from "../controllers/download.controller.js";
const router = express.Router();
router.get("/scrape",scrapeWebtoon);
router.post("/download",downloadEpisodes);
export default router;
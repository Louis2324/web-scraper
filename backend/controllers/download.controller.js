import {downloadEpisodeImages } from "../services/downloader.service.js";

export async function downloadEpisodes (req,res) {
    const {title  , episodes } = req.body;
    
    if(!title || !episodes || !Array.isArray(episodes)) {
        return res.status(400).json({msg : "Missing or invalid 'title' or 'episodes'"});
    }

    try {
        for(const episode of episodes) {
            await downloadEpisodeImages(title,episode)
        }
        res.status(200).json({success:true , message:"Episodes Downloaded Succesfully "});
    } catch (error) {
        console.error("Download Failed: ",error.message);
        res.status(500).json({error: "Download failed" +'  '+ error.message});
    }
}
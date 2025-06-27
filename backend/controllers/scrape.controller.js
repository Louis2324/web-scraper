import axios from "axios";
import * as cheerio from "cheerio";


export async function scrapeWebtoon(req,res) {
    const { url } = req.query;
    if(!url ) return res.status(400).json({msg: 'Missing url'});
    try {
        const {data:html} = await axios.get(url);
        const $ = cheerio.load(html);
        const title = $("h1.subj").text().trim();
        const episodes = [];

        $("#_listUl li._episodeItem").each( (i,elem) => {
            const episodeAnchor = $(elem).find("a");
            const episodeTitle = episodeAnchor.find("span.subj span").text().trim();
            const episodeUrl = episodeAnchor.attr("href");

            episodes.push({
                number : i+1,
                title: episodeTitle,
                url: episodeUrl,
            });
        });

        return res.status(200).json({title,episodes});
    } catch (error) {   
        console.error("Scrape Failed: ",error.message);
        return res.status(500).json({error : "Failed to scrape at provided url"});
    }
}
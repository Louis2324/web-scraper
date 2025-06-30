import axios from "axios";
import { load } from "cheerio";
import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";

function sanitize(name) {
    return name.replace(/[<>:"/\\|?*]/g, "").trim();
}

async function downloadImage(imageUrl, savePath, referer) {
    const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        headers: {
            "Referer": referer,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                          "(KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Sec-Fetch-Dest": "image",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site"
        }
    });

    fs.writeFileSync(savePath, response.data);
}


export async function downloadEpisodeImages(webToonTitle, episode) {
    const { title: episodeTitle, url: episodeUrl } = episode;

    try {
        const { data: html } = await axios.get(episodeUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                    "(KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
            }
        });

        const $ = load(html);
        const imageUrls = [];

        $("#_imageList img").each((_, img) => {
        let src = $(img).attr("data-url") || $(img).attr("src");
        if (!src) return;
        if (src.startsWith("//")) {
            src = "https:" + src;
        }
        if (src.startsWith("/")) {
            src = "https://www.webtoons.com" + src;
        }

        if (src.startsWith("http")) {
            imageUrls.push(src);
        }
    });


        const savePath = path.join(
            "F:/webtoons",
            sanitize(webToonTitle),
            sanitize(episodeTitle)
        );
        await mkdir(savePath, { recursive: true });

        for (let i = 0; i < imageUrls.length; i++) {
            const imgUrl = imageUrls[i];
            const ext = path.extname(new URL(imgUrl).pathname).split("?")[0] || ".jpg";
            const filename = `${i + 1}${ext}`;
            const filePath = path.join(savePath, filename);

            await downloadImage(imgUrl, filePath, episodeUrl);
        }

        console.log(`Downloaded : ${episodeTitle}`);
    } catch (error) {
        console.log(`Failed to download ${episodeTitle}: ${error.message}`);
    }
}


import axios from "axios";
import * as cheerio from "cheerio";

// Delay utility to throttle requests (prevents 429 Too Many Requests)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeWebtoon(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    // Headers to mimic a real browser
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      Referer: url,
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    };

    // Helper to fetch a single page and return episodes
    const fetchEpisodesFromPage = async (page) => {
      const pageUrl = url.includes("?")
        ? `${url}&page=${page}`
        : `${url}?page=${page}`;

      const { data: html } = await axios.get(pageUrl, { headers });
      const $ = cheerio.load(html);
      const pageEpisodes = [];

      $("#_listUl li._episodeItem").each((i, elem) => {
        const episodeAnchor = $(elem).find("a");
        const episodeTitle = episodeAnchor.find("span.subj span").text().trim();
        const episodeUrl = episodeAnchor.attr("href");

        if (episodeTitle && episodeUrl) {
          pageEpisodes.push({
            title: episodeTitle,
            url: episodeUrl,
          });
        }
      });

      return pageEpisodes;
    };

    // Get first page to extract title and max episode number
    const { data: html } = await axios.get(url, { headers });
    const $ = cheerio.load(html);
    const title = $("h1.subj").text().trim();
    const firstPageEpisodes = [];

    let maxEpisodeNum = 0;

    $("#_listUl li._episodeItem").each((i, elem) => {
      const episodeAnchor = $(elem).find("a");
      const episodeTitle = episodeAnchor.find("span.subj span").text().trim();
      const episodeUrl = episodeAnchor.attr("href");

      const match = episodeTitle.match(/(\d+)/g);
      const epNum = match ? parseInt(match[0]) : i + 1;
      maxEpisodeNum = Math.max(maxEpisodeNum, epNum);

      if (episodeTitle && episodeUrl) {
        firstPageEpisodes.push({
          title: episodeTitle,
          url: episodeUrl,
        });
      }
    });

    const episodes = [...firstPageEpisodes];

    // Estimate number of pages
    const episodesPerPage = 10;
    const totalPages = Math.ceil(maxEpisodeNum / episodesPerPage);

    console.log(`Webtoon: ${title}`);
    console.log(`Estimated total pages: ${totalPages}`);

    // Fetch other pages with delay
    for (let page = 2; page <= totalPages; page++) {
      console.log(`Fetching page ${page}...`);
      await delay(1500); // wait 1.5 seconds to prevent rate limiting
      const moreEpisodes = await fetchEpisodesFromPage(page);
      episodes.push(...moreEpisodes);
    }

    // Add episode numbers
    const numberedEpisodes = episodes.map((ep, index) => ({
      number: index + 1,
      ...ep,
    }));

    return res.status(200).json({
      title,
      episodes: numberedEpisodes,
    });
  } catch (error) {
    console.error("Scrape Failed:", error.message);
    return res.status(500).json({ error: "Failed to scrape webtoon" });
  }
}

const fetchBtn = document.getElementById("fetch-btn");
const urlInput = document.getElementById("webtoon-url");
const loadingSection = document.getElementById("loading");
const detailsSection = document.getElementById("webtoon-details");
const webtoonTitle = document.getElementById("webtoon-title");
const webtoonDescription = document.getElementById("webtoon-description");
const episodesGrid = document.getElementById("episodes-grid");
const webtoonCover = document.getElementById("webtoon-cover");

fetchBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) {
    alert("Please enter a webtoon URL");
    return;
  }

  loadingSection.style.display = "block";
  detailsSection.style.display = "none";

  try {
    const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error("Failed to scrape");

    const data = await response.json();
    const { title, cover, episodes } = data;

    // Update UI with title and cover
    webtoonTitle.textContent = title || "Webtoon Title";
    webtoonCover.src = cover || "https://via.placeholder.com/300x400/FFD700/333333?text=Webtoon+Cover";
    webtoonDescription.textContent = `Found ${episodes.length} episode(s) for "${title}"`;

    episodesGrid.innerHTML = "";

    // Render episodes
    episodes.forEach((ep) => {
      const card = document.createElement("div");
      card.className = "episode-card";
      card.innerHTML = `
        <div class="episode-thumb">
          <div class="episode-number">#${ep.number}</div>
        </div>
        <div class="episode-info">
          <div class="episode-title">${ep.title}</div>
          <button class="download-btn" 
                  data-epnum="${ep.number}" 
                  data-url="${ep.url}" 
                  data-title="${ep.title}">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      `;
      episodesGrid.appendChild(card);
    });

    loadingSection.style.display = "none";
    detailsSection.style.display = "block";
    detailsSection.scrollIntoView({ behavior: "smooth" });

    setupDownloadListeners(title);
  } catch (err) {
    console.error("Scrape failed:", err.message);
    alert("Unable to fetch episodes. Check the console.");
  } finally {
    loadingSection.style.display = "none";
  }
});

function setupDownloadListeners(webtoon) {
  document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const epTitle = btn.dataset.title;
      const epNum = btn.dataset.epnum;
      const epUrl = btn.dataset.url;

      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading`;
      btn.disabled = true;

      const episode = {
        number: parseInt(epNum),
        title: epTitle,
        url: epUrl,
      };

      try {
        const response = await fetch("/api/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: webtoon,
            episodes: [episode],
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Download failed");
        }

        btn.innerHTML = `<i class="fas fa-check"></i> Downloaded`;
      } catch (error) {
        console.error("Download error:", error.message);
        btn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Failed`;
      }
    });
  });
}

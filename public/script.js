const fetchBtn = document.getElementById("fetch-btn");
const urlInput = document.getElementById("webtoon-url");
const loadingSection = document.getElementById("loading");
const detailsSection = document.getElementById("webtoon-details");
const webtoonTitle = document.getElementById("webtoon-title");
const webtoonDescription = document.getElementById("webtoon-description");
const episodesGrid = document.getElementById("episodes-grid");

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
    const { title, episodes } = data;

    webtoonTitle.textContent = title || "Webtoon Title";
    webtoonDescription.textContent = `Found ${episodes.length} episode(s).`;
    episodesGrid.innerHTML = "";

    // Render episodes
    episodes.forEach((ep) => {
      const card = document.createElement("div");
      card.className = "episode-card";
      card.innerHTML = `
        <div class="episode-thumb">
          <div class="episode-number">${title}</div>
        </div>
        <div class="episode-info">
          <div class="episode-title">${ep.title}</div>
          <button class="download-btn" data-epnum="${ep.number}" data-url="${ep.url}" data-title="${ep.title}">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      `;
      episodesGrid.appendChild(card);
    });

    loadingSection.style.display = "none";
    detailsSection.style.display = "block";
    detailsSection.scrollIntoView({ behavior: "smooth" });

    document.querySelectorAll(".download-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const epTitle = btn.dataset.title;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading`;
        btn.disabled = true;

        // TODO: Implement real download later
        setTimeout(() => {
          btn.innerHTML = `<i class="fas fa-check"></i> Downloaded`;
        }, 2000);
      });
    });
  } catch (err) {
    console.error("Scrape failed:", err.message);
    alert("Unable to fetch episodes. Check the console.");
  } finally {
    loadingSection.style.display = "none";
  }
});

        // Simulate fetching webtoon data
        document.getElementById('fetch-btn').addEventListener('click', function() {
            const urlInput = document.getElementById('webtoon-url').value;
            
            if (!urlInput) {
                alert('Please enter a webtoon URL');
                return;
            }
            
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('webtoon-details').style.display = 'none';
            
            // Simulate network request
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('webtoon-details').style.display = 'block';
                
                // Generate episode cards
                const episodesGrid = document.getElementById('episodes-grid');
                episodesGrid.innerHTML = '';
                
                for (let i = 1; i <= 15; i++) {
                    const episodeCard = document.createElement('div');
                    episodeCard.className = 'episode-card';
                    episodeCard.innerHTML = `
                        <div class="episode-thumb">
                            <img src="https://via.placeholder.com/300x150/FFD700/333333?text=Episode+${i}" alt="Episode ${i}">
                            <div class="episode-number">Episode ${i}</div>
                        </div>
                        <div class="episode-info">
                            <div class="episode-title">The ${getRandomAdjective()} ${getRandomNoun()}</div>
                            <div class="episode-date">${getRandomDate()}</div>
                            <button class="download-btn" data-episode="${i}">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    `;
                    episodesGrid.appendChild(episodeCard);
                }
                
                // Add download event listeners
                document.querySelectorAll('.download-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const episode = this.getAttribute('data-episode');
                        alert(`Downloading episode ${episode}...`);
                        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading';
                        this.disabled = true;
                        
                        // Simulate download completion
                        setTimeout(() => {
                            this.innerHTML = '<i class="fas fa-check"></i> Downloaded';
                        }, 2000);
                    });
                });
                
                // Scroll to results
                document.getElementById('webtoon-details').scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        });
        
        // Helper functions for generating random data
        function getRandomAdjective() {
            const adjectives = ['Mysterious', 'Beautiful', 'Dramatic', 'Romantic', 'Unexpected', 
                              'Shocking', 'Enchanting', 'Secret', 'Fateful', 'Emotional'];
            return adjectives[Math.floor(Math.random() * adjectives.length)];
        }
        
        function getRandomNoun() {
            const nouns = ['Encounter', 'Revelation', 'Meeting', 'Moment', 'Decision', 
                         'Confession', 'Promise', 'Reunion', 'Departure', 'Surprise'];
            return nouns[Math.floor(Math.random() * nouns.length)];
        }
        
        function getRandomDate() {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[Math.floor(Math.random() * months.length)];
            const day = Math.floor(Math.random() * 28) + 1;
            const year = 2020 + Math.floor(Math.random() * 4);
            return `${month} ${day}, ${year}`;
        }

const API_KEY = "################################"; // ⚠️ WARNING: Never expose API keys in client-side code.
                                                                    // Move this to a backend server or environment variable before deploying.

const recommendedVideos = [
    {
        videoId: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up',
        channel: 'Rick Astley',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        publishedAt: 'Oct 25, 2009'
    },
    {
        videoId: 'JGwWNGJdvx8',
        title: 'Ed Sheeran - Shape of You',
        channel: 'Ed Sheeran',
        thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
        publishedAt: 'Jan 30, 2017'
    },
    {
        videoId: 'kJQP7kiw5Fk',
        title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
        channel: 'Luis Fonsi',
        thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
        publishedAt: 'Jan 12, 2017'
    },
    {
        videoId: 'OPf0YbXqDm0',
        title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
        channel: 'Mark Ronson',
        thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
        publishedAt: 'Nov 19, 2014'
    },
    {
        videoId: 'hT_nvWreIhg',
        title: 'OneRepublic - Counting Stars',
        channel: 'OneRepublic',
        thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/hqdefault.jpg',
        publishedAt: 'May 31, 2013'
    },
    {
        videoId: 'YQHsXMglC9A',
        title: 'Adele - Hello',
        channel: 'Adele',
        thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
        publishedAt: 'Oct 22, 2015'
    }
];

async function searchVideos(event) {
    if (event) {
        event.preventDefault();
    }

    const query = document.getElementById("searchInput").value.trim();
    const messageDiv = document.getElementById("message");
    const resultsDiv = document.getElementById("results");
    const recommendedSection = document.querySelector(".card-block");

    messageDiv.textContent = "";
    resultsDiv.innerHTML = "";

    if (!query) {
        messageDiv.textContent = "Please enter a search term.";
        return;
    }

    // Hide recommended section when a search is made
    recommendedSection.style.display = "none";

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`;

    try {
        messageDiv.textContent = "Searching...";

        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const errorMessage = errorBody?.error?.message || `HTTP ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        messageDiv.textContent = "";

        if (!data.items || data.items.length === 0) {
            messageDiv.textContent = "No videos found. Try another search.";
            return;
        }

        displayResults(data.items);
    } catch (error) {
        console.error("Error fetching data:", error);
        messageDiv.textContent = "Unable to fetch results. Check your API key and internet connection.";
    }
}

function displayRecommendedVideos() {
    const recommendedDiv = document.getElementById("recommended");
    recommendedDiv.innerHTML = "";

    recommendedVideos.forEach(video => {
        const videoElement = document.createElement("article");
        videoElement.classList.add("video");

        videoElement.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" rel="noreferrer">
                <img src="${video.thumbnail}" alt="${video.title}">
            </a>
            <div class="video-details">
                <h3><a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" rel="noreferrer">${video.title}</a></h3>
                <p class="channel">${video.channel}</p>
                <p class="meta">${video.publishedAt}</p>
            </div>
        `;

        recommendedDiv.appendChild(videoElement);
    });
}

function displayResults(videos) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    videos.forEach(video => {
        const videoId = video.id?.videoId;
        const snippet = video.snippet || {};
        const title = snippet.title || "Untitled video";
        const channel = snippet.channelTitle || "Unknown channel";
        const thumbnail = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "";
        const publishedAt = snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : "";

        const videoElement = document.createElement("article");
        videoElement.classList.add("video");

        videoElement.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noreferrer">
                <img src="${thumbnail}" alt="${title}">
            </a>
            <div class="video-details">
                <h3><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noreferrer">${title}</a></h3>
                <p class="channel">${channel}</p>
                <p class="meta">${publishedAt}</p>
            </div>
        `;

        resultsDiv.appendChild(videoElement);
    });
}

document.getElementById("searchForm").addEventListener("submit", searchVideos);
window.addEventListener("DOMContentLoaded", displayRecommendedVideos);

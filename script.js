const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsContainer =
    document.getElementById("results-container");
const singleSongView = document.getElementById("single-song-view");
const songDetails = document.getElementById("song-details");
const backBtn = document.getElementById("back-btn");
const favoritesList = document.getElementById("favorites-list");
const themeBtn = document.getElementById("theme-btn");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch songs from API
async function searchSongs(query) {
    const response = await fetch(
        `https://api.lyrics.ovh/suggest/${query}`
    );
    const data = await response.json();
    return data.data;
}

// Display search results
function displayResults(songs) {
    resultsContainer.innerHTML = "";
    songs.forEach((song) => {
        const songItem = document.createElement("div");
        songItem.classList.add("song-item");
        songItem.innerHTML = `
<h3>${song.title}</h3>
<p>By ${song.artist.name}</p>
<button onclick="showSingleSong('${song.artist.name}', '${song.title}')">Show Lyrics</button>
<button onclick="addToFavorites('${song.artist.name}', '${song.title}')">❤️ Add to Favorites</button>
`;
        resultsContainer.appendChild(songItem);
    });
}

// Show single song and lyrics
async function showSingleSong(artist, title) {
    const response = await fetch(
        `https://api.lyrics.ovh/v1/${artist}/${title}`
    );
    const data = await response.json();
    let lyrics = data.lyrics || "Lyrics not found!";

    // Format lyrics: Replace newlines with <br> tags
    lyrics = lyrics.replace(/\n/g, "<br>");

    // Hide results and show single song view
    resultsContainer.style.display = "none";
    singleSongView.style.display = "block";

    // Display song details and lyrics
    songDetails.innerHTML = `
<h3>${title}</h3>
<p>By ${artist}</p>
<div class="lyrics">${lyrics}</div>
`;
}

// Back to results
backBtn.addEventListener("click", () => {
    singleSongView.style.display = "none";
    resultsContainer.style.display = "block";
});

// Add song to favorites
function addToFavorites(artist, title) {
    if (
        !favorites.some(
            (fav) => fav.artist === artist && fav.title === title
        )
    ) {
        favorites.push({ artist, title });
        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );
        updateFavoritesList();
    }
}

// Update favorites list
function updateFavoritesList() {
    favoritesList.innerHTML = "";
    favorites.forEach((fav) => {
        const li = document.createElement("li");
        li.innerText = `${fav.title} - ${fav.artist}`;
        favoritesList.appendChild(li);
    });
}

// Toggle dark/light mode
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeBtn.innerText = document.body.classList.contains(
        "dark-mode"
    )
        ? "☀️"
        : "🌙";
});

// Search button event
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query) {
        const songs = await searchSongs(query);
        displayResults(songs);
    }
});

// Initialize favorites list
updateFavoritesList();
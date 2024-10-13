let api_key = "a54ae990141a49038640374dd2d86d2d";
let items = document.getElementById("items");
let paginationContainer = document.getElementById("pagination");
let maxPages = 10;
let gamesPerPage = 24;
let currentPage = 1;
let allGames = [];
let storedGames = localStorage.getItem("gameData");
if (storedGames) {
  allGames = JSON.parse(storedGames);
  setupPagination(allGames);
} else {
  fetchAllGames();
}

async function fetchAllGames(page = 1) {
  try {
    let data = await fetch(
      `https://api.rawg.io/api/games?key=${api_key}&page=${page}`
    );
    let req = await data.json();
    allGames = allGames.concat(req.results);

    if (req.next && page < maxPages) {
      fetchAllGames(page + 1);
    } else {
      localStorage.setItem("gameData", JSON.stringify(allGames));
      setupPagination(allGames);
    }
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}
function setupPagination(games) {
  let totalPages = Math.ceil(games.length / gamesPerPage);

  paginationContainer.innerHTML = "";
  updatePaginationButtons(currentPage, totalPages); // Set up pagination buttons

  goToPage(1); // Load the first page by default
}

function updatePaginationButtons(currentPage, totalPages) {
  paginationContainer.innerHTML = "";

  // Determine the range of pagination buttons to show
  let startPage = Math.max(currentPage - 5, 1);
  let endPage = Math.min(startPage + 9, totalPages);

  // Adjust startPage if we are close to the last page
  if (endPage - startPage < 9) {
    startPage = Math.max(endPage - 9, 1);
  }

  // Create the pagination buttons
  for (let i = startPage; i <= endPage; i++) {
    let button = document.createElement("button");
    button.textContent = i;
    button.classList.add("page-button");

    // Set the active class on the current page
    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => goToPage(i));
    paginationContainer.appendChild(button);
  }
}

function goToPage(page) {
  currentPage = page;

  // Remove active class from all pagination buttons
  let allButtons = document.querySelectorAll(".page-button");
  allButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to the clicked pagination button
  let currentButton = paginationContainer.querySelector(
    `button:nth-child(${page - currentPage + 5})`
  );
  if (currentButton) {
    currentButton.classList.add("active");
  }

  items.innerHTML = "";
  let startIndex = (page - 1) * gamesPerPage;
  let endIndex = startIndex + gamesPerPage;
  let gamesToShow = allGames.slice(startIndex, endIndex);

  displayGames(gamesToShow);

  // Update pagination buttons dynamically
  updatePaginationButtons(
    currentPage,
    Math.ceil(allGames.length / gamesPerPage)
  );
}

document.title = "GamesReaper" + "-All Games";
function displayGames(games) {
  games.forEach((ele) => {
    // Ensure 'ele' (the game object) exists and has the necessary properties
    if (!ele || !ele.name || !ele.genres || !ele.platforms) {
      console.warn("Game data is incomplete or undefined:", ele);
      return; // Skip rendering if the game data is incomplete
    }

    let item = document.createElement("div");

    // Check if genres exist, if not provide a fallback
    let genres =
      ele.genres && ele.genres.length > 0
        ? ele.genres.map((genre) => genre.name).join(", ")
        : "Unknown Genre";

    // Check if platforms exist, if not provide a fallback
    let platforms =
      ele.platforms && ele.platforms.length > 0
        ? ele.platforms
            .slice(0, 1)
            .map((platform) => platform.platform.name)
            .join(", ")
        : "Unknown Platform";

    // Ensure the image exists, if not, provide a placeholder image
    let backgroundImage = ele.background_image || "placeholder-image-url"; // Use a fallback URL if image is missing

    item.classList.add("item");
    item.innerHTML = `
      <a onclick="getDetails(${ele.id})" href="./details.html">
        <img src="${backgroundImage}" alt="Game Image">
      </a>
      <div class="content">
        <p class="name">Name: <span>${ele.name}</span></p>
        <p class="rating">Rating: <span>${
          ele.rating ? ele.rating : "No Rating"
        }</span></p>
        <p class="genre">Genre: <span>${genres}</span></p>
        <p class="platform">Platform: <span>${platforms} , ...</span></p>
      </div>`;

    items.appendChild(item);
  });
}

// Redirect to details page
function getDetails(id) {
  localStorage.setItem("gameId", id); // Store game ID in localStorage
}

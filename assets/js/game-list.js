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
  for (let i = 1; i <= totalPages; i++) {
    let button = document.createElement("button");
    button.textContent = i;
    button.classList.add("page-button");

    // Set the active class on the first page by default
    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => goToPage(i));
    paginationContainer.appendChild(button);
  }

  goToPage(1); // Load the first page by default
}

function goToPage(page) {
  currentPage = page;

  // Remove active class from all pagination buttons
  let allButtons = document.querySelectorAll(".page-button");
  allButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to the clicked pagination button
  let currentButton = paginationContainer.children[page - 1];
  currentButton.classList.add("active");

  items.innerHTML = "";
  let startIndex = (page - 1) * gamesPerPage;
  let endIndex = startIndex + gamesPerPage;
  let gamesToShow = allGames.slice(startIndex, endIndex);

  displayGames(gamesToShow);
}

document.title = "GamesReaper" + "-All Games";
function displayGames(games) {
  games.forEach((ele) => {
    let item = document.createElement("div");
    let genres = ele.genres.map((genre) => genre.name).join(", ");
    let platforms = ele.platforms
      .slice(0, 1)
      .map((platform) => platform.platform.name)
      .join(", ");
    item.classList.add("item");
    item.innerHTML = `
                  <a onclick="getDetails(${ele.id})" href="./details.html">
                  <img src="${ele.background_image}" alt=""></a>
                <div class="content">
                  <p class="name">Name:<span>${ele.name}</span></p>
                  <p class="rating">Rating:<span>${ele.rating}</span></p>
                  <p class="genre">Genre:<span>${genres}</span></p>
                  <p class="platform">Platform:<span>${
                    platforms + " , ..."
                  }</span></p>
                </div>`;
    items.appendChild(item);
  });
}

// Redirect to details page
function getDetails(id) {
  localStorage.setItem("gameId", id); // Store game ID in localStorage
}

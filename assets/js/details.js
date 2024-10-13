let api_key = "a54ae990141a49038640374dd2d86d2d";
let gameId = localStorage.getItem("gameId");
let items_detail = document.getElementById("container-details");
let trailerContainer = document.querySelector(".swiper-wrapper");

async function getDetails() {
  // Retrieve game ID from localStorage
  if (!gameId) return; // Ensure game ID exists

  let data = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${api_key}`
  );
  let GameDetails = await data.json();

  displayDetails(GameDetails);
}

function displayDetails(details) {
  let item_detail = document.createElement("div");
  item_detail.classList.add("item_detail");
  let {
    background_image,
    name,
    released,
    description_raw,
    rating,
    genres,
    platforms,
    publishers,
    website,
  } = details;
  let shortDescription =
    description_raw.length > 200
      ? description_raw.slice(0, 200) + "..."
      : description_raw;
  document.title = "GamesReaper " + `${name}`;
  let platformsList = platforms
    .map((platform) => platform.platform.name)
    .join(", "); // Get platform names

  let gen = genres.map((gener) => gener.name).join(", ");
  console.log(gen);
  let publishersList = publishers.map((publisher) => publisher.name).join(", ");
  item_detail.innerHTML = `
    <div class="image">
      <img src="${background_image}" alt="${name}">
    </div>
    <div class="content">
      <h2 class="name">${name}</h2>
      <p class="release">Released: ${released}</p>
      <p class="type">description:</p>
      <p class="description">${shortDescription}</p>
      <p class="rating">Rating : <span>${rating}</span></p>
      <p class="platforms">Genres : <span>${gen}</span></p>
      <p class="platforms">Platforms: <span>${platformsList}</span></p>
      <p class="platforms">Publishers: <span>${publishersList}</span></p>
      <a class="website" target="_blanck" href="${website}">Game Website</a>
    </div>

    
  `;
  items_detail.appendChild(item_detail);
}
async function getTrailers() {
  try {
    let response = await fetch(
      `https://api.rawg.io/api/games/${gameId}/movies?key=${api_key}`
    );
    let data = await response.json();

    // Check if there are any trailers available
    if (data.results.length > 0) {
      displayTrailers(data.results);
      document.querySelector(".swiper-button-prev").style.display = "block";
      document.querySelector(".swiper-button-next").style.display = "block";
    } else {
      trailerContainer.innerHTML = `No Available Trailer`;
      trailerContainer.style.display = "flex";
      trailerContainer.style.justifyContent = "center";
      trailerContainer.style.alignItems = "center";
      trailerContainer.style.fontSize = "24px";
      trailerContainer.style.backgroundColor = "#12272c";
      trailerContainer.style.width = "100%";
      trailerContainer.style.height = "400px";
    }
  } catch (error) {
    console.error("Error fetching trailers:", error);
    trailerContainer.innerHTML = `<p class="error">Failed to load trailers. Please try again later.</p>`;
  }
}

// Function to display all trailers on the page
function displayTrailers(trailers) {
  trailers.forEach((trailer) => {
    let trailerElement = document.createElement("div");
    trailerElement.classList.add("swiper-slide");

    trailerElement.innerHTML = `
      <video controls>
        <source src="${trailer.data.max}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    trailerContainer.appendChild(trailerElement);
  });

  // Initialize Swiper after adding slides
  var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      slideChange: function () {
        // Pause video in the previously active slide
        const activeSlide = document.querySelector(
          ".swiper-slide-active video"
        );
        if (activeSlide) {
          activeSlide.pause();
        }
      },
    },
  });
}

// Call the getTrailers function when the page loads
getTrailers();

getDetails(); // Fetch and display the game details

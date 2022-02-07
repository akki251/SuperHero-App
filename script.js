// MAIN API
const API_URL = "https://www.superheroapi.com/api.php/615113109930402/";

//  SELECTING DOM ELEMENTS
const search = document.getElementById("search");
const mainContainerEl = document.querySelector(".main-container");
const displayEl = document.createElement("div");
const favListBtn = document.querySelector(".fav-list-btn");
const favListEl = document.querySelector(".fav-list-container");

var favList = [];

// search event Listener on input
search.addEventListener("input", async (e) => {
  const searchTerm = e.target.value;

  const resp = await fetch(API_URL + "search/" + searchTerm);

  const respData = await resp.json();
  if (searchTerm) {
    mainContainerEl.appendChild(displayEl);
    displayEl.classList.add("display-container");
  } else {
    displayEl.remove();
  }

  showCharacters(respData.results);
});

// showCharacters function
function showCharacters(charactersData) {
  if (!charactersData) {
    const warning = document.createElement("h2");
    warning.innerHTML = "No results available, please try different characters";
    displayEl.appendChild(warning);
    return;
  }

  displayEl.innerHTML = "";
  charactersData.forEach((singleCharacter) => {
    var singleCharacterEl = document.createElement("div");
    singleCharacterEl.classList.add("single-character");
    singleCharacterEl.innerHTML = ` <div class="img-box">
      <img
        src=" ${singleCharacter.image.url}"
        alt="${singleCharacter.name}"
      />
    </div>
    <div class="character-details">
      <h4>Name: ${singleCharacter.name}</h4>
      <p>${singleCharacter.work.occupation}</p>
      <p>${singleCharacter.biography.publisher}</p>
    </div>
    <button class="fav-btn">Add to Favorites</button>
    
 `;

    displayEl.appendChild(singleCharacterEl);

    //add to Fav
    const addfavBtn = singleCharacterEl.querySelector(".fav-btn");
    addfavBtn.addEventListener("click", () => {
      addToFav(singleCharacter);
    });

    // singleCharacterDetail
    singleCharacterEl
      .querySelector(".img-box")
      .addEventListener("click", () => {
        const heroBox = document.createElement("div");
        heroBox.classList.add("hero-desc");
        heroBox.innerHTML = `
        <div class="icon-box">
        <i class="fa fa-window-close close-icon" aria-hidden="true"></i>
      </div>

      <div class="superhero-detail">
        <div class="img-box">
          <img
            src="${singleCharacter.image.url}"
            alt="${singleCharacter.name}"
          />
        </div>
        <div class="details">
          <p>Name: ${singleCharacter.name}</p>
          <div class="intelligence">
            <div class="bg-i">Intelligence</div>
          </div>
          <div class="intelligence">
            <div class="bg-s">Strength</div>
          </div>
          <div class="intelligence">
            <div class="bg-sp">Speed</div>
          </div>
          <div class="intelligence">
            <div class="bg-d">durability</div>
          </div>
          <div class="intelligence">
            <div class="bg-p">power</div>
          </div>
        </div>
      </div>


        `;

        document.querySelector(".wrapper").classList.add("blur");

        heroBox.querySelector(
          ".details .bg-i"
        ).style.width = `${singleCharacter.powerstats.intelligence}%`;

        heroBox.querySelector(
          ".details .bg-s"
        ).style.width = `${singleCharacter.powerstats.strength}%`;

        heroBox.querySelector(
          ".details .bg-sp"
        ).style.width = `${singleCharacter.powerstats.speed}%`;

        heroBox.querySelector(
          ".details .bg-d"
        ).style.width = `${singleCharacter.powerstats.durability}%`;
        heroBox.querySelector(
          ".details .bg-p"
        ).style.width = `${singleCharacter.powerstats.power}%`;

        document.body.appendChild(heroBox);
        heroBox.querySelector(".close-icon").addEventListener("click", () => {
          heroBox.remove();
          document.querySelector(".wrapper").classList.toggle("blur");
        });
      });
  });
}

// fetching Favourites
function fetchFavorites() {
  const favListUl = favListEl.querySelector(".fav-list");
  favList = getCharsFromLS();
  if (favList.length > 0) {
    favListUl.innerHTML = "";

    favList.forEach((favListItem) => {
      const favListItemEl = document.createElement("li");
      favListItemEl.classList.add("fav-list-item");
      favListItemEl.innerHTML = `
 
 
     <div class="img-box">
     <img
       src="${favListItem.image.url}"
       alt=${favListItem.name}
     />
   </div>
 
   <div class="text-box">
     <p>Name: ${favListItem.name} </p>
    <p>Role: ${favListItem.work.occupation}</p>
     <button class="fav-btn remove">Remove From Favorites</button>
   </div>
     `;

      const removeBtn = favListItemEl.querySelector(".remove");
      removeBtn.addEventListener("click", () => {
        removeFromFavList(favListItem);
      });

      favListUl.appendChild(favListItemEl);
    });
  } else {
    const warning = document.createElement("h2");
    favListUl.innerHTML = "";

    warning.innerHTML = "Please add one";
    warning.classList.add("warning");
    favListUl.appendChild(warning);
  }
}

// FAVORITE TOGGLE

favListBtn.addEventListener("click", () => {
  favListEl.classList.toggle("hidden");
  if (favListEl.classList.contains("hidden") == false) {
    fetchFavorites();
  }
});

// ADD to favList

function addToFav(singleCharacter) {
  favList.push(singleCharacter);
  addToLocal(singleCharacter);
  fetchFavorites();
}

// REMOVE from favList

function removeFromFavList(singleCharacter) {
  const chars = getCharsFromLS();
  localStorage.setItem(
    "chars",
    JSON.stringify(chars.filter((item) => item.id !== singleCharacter.id))
  );

  fetchFavorites();
}

// Add to localStorage

function addToLocal(singleCharacter) {
  const chars = getCharsFromLS();

  localStorage.setItem("chars", JSON.stringify([...chars, singleCharacter]));
}

// getFromLocalStorage

function getCharsFromLS() {
  const characters = JSON.parse(localStorage.getItem("chars"));

  return characters === null ? [] : characters;
}

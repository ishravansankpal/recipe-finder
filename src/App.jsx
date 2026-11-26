import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetails from "./components/RecipeDetails";
import "./App.css";

const API_URL = "https://dummyjson.com/recipes";

// Cuisine names must match the "cuisine" field returned by the API
const cuisineList = ["Indian", "Italian", "Mexican", "Asian", "American"];

function App() {
  // Which page is visible: home, explore, favourites, about or details
  const [page, setPage] = useState("home");
  const [previousPage, setPreviousPage] = useState("home");
  const [selectedId, setSelectedId] = useState(null);

  // Recipe data
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null means "no search yet"
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  // Favourites are read from localStorage when the app starts
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  // Fetch all recipes once, when the app loads
  useEffect(() => {
    async function getRecipes() {
      try {
        // limit=0 gives all recipes instead of only the first 30
        const response = await fetch(API_URL + "?limit=0");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        setAllRecipes(data.recipes);
      } catch (err) {
        setError("Could not load recipes. Please check your internet and refresh.");
      }
      setLoading(false);
    }

    getRecipes();
  }, []);

  // Save favourites to localStorage every time they change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // ---------- Functions ----------

  function goToPage(newPage) {
    setPage(newPage);
    window.scrollTo(0, 0);
  }

  function viewRecipe(id) {
    setPreviousPage(page); // remember where we came from for the Back button
    setSelectedId(id);
    goToPage("details");
  }

  function isFavourite(id) {
    const found = favourites.find((item) => item.id === id);
    return found !== undefined;
  }

  function toggleFavourite(recipe) {
    if (isFavourite(recipe.id)) {
      // remove it
      setFavourites(favourites.filter((item) => item.id !== recipe.id));
    } else {
      // add it
      setFavourites([...favourites, recipe]);
    }
  }

  // Search by recipe name (API) and by ingredient (JavaScript filter)
  async function handleSearch(event) {
    event.preventDefault();
    const text = searchText.trim();

    if (text === "") {
      setSearchResults(null);
      goToPage("explore");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL + "/search?q=" + encodeURIComponent(text));
      const data = await response.json();
      const nameMatches = data.recipes;

      // Recipes that contain the word in their ingredients
      const ingredientMatches = allRecipes.filter((recipe) =>
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(text.toLowerCase())
        )
      );

      // Join both lists without repeating a recipe
      const combined = [...nameMatches];
      ingredientMatches.forEach((recipe) => {
        const alreadyAdded = combined.find((item) => item.id === recipe.id);
        if (!alreadyAdded) {
          combined.push(recipe);
        }
      });

      setSearchResults(combined);
    } catch (err) {
      setError("Search failed. Please try again.");
    }
    setLoading(false);
    goToPage("explore");
  }

  function selectCuisine(cuisine) {
    setSelectedCuisine(cuisine);
    goToPage("explore");
  }

  function clearSearch() {
    setSearchText("");
    setSearchResults(null);
    setSelectedCuisine("All");
  }

// Decide which recipes to show on the Explore page
function getVisibleRecipes() {
  let list = allRecipes;
  if (searchResults !== null) {
    list = searchResults;
  }
  if (selectedCuisine !== "All") {
    // Match the cuisine field OR the tags (e.g. Biryani has the tag "Indian")
    list = list.filter((recipe) =>
      recipe.cuisine === selectedCuisine || recipe.tags.includes(selectedCuisine)
    );
  }
  return list;
}

  // ---------- Small pieces of JSX used on more than one page ----------

  function renderSearchBar() {
    return (
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by recipe or ingredient, e.g. pizza or tomato"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
      </form>
    );
  }

  function renderCuisineButtons(withAll) {
    return (
      <div className="cuisine-buttons">
        {withAll && (
          <button
            className={selectedCuisine === "All" ? "chip chip-active" : "chip"}
            onClick={() => selectCuisine("All")}
          >
            All
          </button>
        )}
        {cuisineList.map((cuisine) => (
          <button
            key={cuisine}
            className={
              withAll && selectedCuisine === cuisine ? "chip chip-active" : "chip"
            }
            onClick={() => selectCuisine(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>
    );
  }

  function renderCards(list, emptyMessage) {
    if (list.length === 0) {
      return <p className="message">{emptyMessage}</p>;
    }
    return (
      <div className="card-grid">
        {list.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavourite={isFavourite(recipe.id)}
            onView={viewRecipe}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </div>
    );
  }

  // Loading and error messages (used by Home and Explore)
  function renderStatus() {
    if (loading) {
      return <p className="message">Loading recipes...</p>;
    }
    if (error) {
      return <p className="message error">{error}</p>;
    }
    return null;
  }

  // ---------- Pages ----------

  function renderHome() {
    // Popular recipes = the 6 highest rated ones
    const popular = [...allRecipes].sort((a, b) => b.rating - a.rating).slice(0, 6);

    return (
      <div>
        <section className="hero">
          <h2>Find Something Delicious to Cook</h2>
          <p>Search hundreds of recipes by name or ingredient.</p>
          {renderSearchBar()}
        </section>

        <h3 className="section-title">Browse by Cuisine</h3>
        {renderCuisineButtons(false)}

        <h3 className="section-title">Popular Recipes</h3>
        {renderStatus() || renderCards(popular, "No recipes to show.")}
      </div>
    );
  }

  function renderExplore() {
    const visible = getVisibleRecipes();

    return (
      <div>
        <h2 className="page-title">Explore Recipes</h2>
        {renderSearchBar()}
        {renderCuisineButtons(true)}

        {searchResults !== null && (
          <p className="search-info">
            Showing results for "{searchText}"{" "}
            <button className="link-btn" onClick={clearSearch}>Clear search</button>
          </p>
        )}

        {renderStatus() ||
          renderCards(visible, "No recipes found. Try a different name, ingredient or cuisine.")}
      </div>
    );
  }

  function renderFavourites() {
    return (
      <div>
        <h2 className="page-title">Your Favourites</h2>
        {renderCards(
          favourites,
          "You have no favourites yet. Click the heart on a recipe to save it here."
        )}
      </div>
    );
  }

  function renderAbout() {
    return (
      <div className="about">
        <h2 className="page-title">About</h2>
        <p>
        Recipe Finder will helps you find something to cook.
        You can search recipes by name or ingredient, filter them by cuisine,
        read the full method and save your favourite dishes.
        </p>
      </div>
    );
  }

  // Decide which page to show
  let content;
  if (page === "home") {
    content = renderHome();
  } else if (page === "explore") {
    content = renderExplore();
  } else if (page === "favourites") {
    content = renderFavourites();
  } else if (page === "about") {
    content = renderAbout();
  } else {
    content = (
      <RecipeDetails
        recipeId={selectedId}
        isFavourite={isFavourite(selectedId)}
        onBack={() => goToPage(previousPage)}
        onToggleFavourite={toggleFavourite}
      />
    );
  }

  return (
    <div>
      <Navbar
        currentPage={page === "details" ? previousPage : page}
        onNavigate={goToPage}
      />
      <main className="container">{content}</main>
      <footer className="footer">@Recipe Finder</footer>
    </div>
  );
}

export default App;

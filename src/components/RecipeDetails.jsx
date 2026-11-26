import { useState, useEffect } from "react";

function RecipeDetails({ recipeId, isFavourite, onBack, onToggleFavourite }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs whenever recipeId changes
  useEffect(() => {
    async function getRecipe() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("https://dummyjson.com/recipes/" + recipeId);
        if (!response.ok) {
          throw new Error("Recipe not found");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError("Could not load this recipe. Please try again.");
      }
      setLoading(false);
    }

    getRecipe();
  }, [recipeId]);

  if (loading) {
    return <p className="message">Loading recipe...</p>;
  }

  if (error) {
    return (
      <div className="message">
        <p>{error}</p>
        <button className="btn" onClick={onBack}>Back</button>
      </div>
    );
  }

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="details">
      <button className="btn" onClick={onBack}>← Back</button>

      <div className="details-top">
        <img src={recipe.image} alt={recipe.name} />

        <div className="details-info">
          <h2>{recipe.name}</h2>
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Cooking time:</strong> {totalTime} mins</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
          <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

          <button
            className={isFavourite ? "btn btn-orange" : "btn"}
            onClick={() => onToggleFavourite(recipe)}
          >
            {isFavourite ? "♥ Remove from Favourites" : "♡ Add to Favourites"}
          </button>
        </div>
      </div>

      <div className="details-lists">
        <div>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;

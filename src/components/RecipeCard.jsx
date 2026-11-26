function RecipeCard({ recipe, isFavourite, onView, onToggleFavourite }) {
  // Total cooking time = preparation time + cooking time
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="card">
      <img src={recipe.image} alt={recipe.name} />

      <div className="card-body">
        <h3>{recipe.name}</h3>
        <p className="cuisine">{recipe.cuisine}</p>
        <p className="time">{totalTime} mins</p>

        <div className="card-buttons">
          <button className="btn" onClick={() => onView(recipe.id)}>
            View Recipe
          </button>
          <button
            className={isFavourite ? "heart-btn liked" : "heart-btn"}
            onClick={() => onToggleFavourite(recipe)}
            title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            {isFavourite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;

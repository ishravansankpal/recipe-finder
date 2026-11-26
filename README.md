# Recipe Finder

A beginner-friendly recipe website built with React as a college project. Users can search recipes, filter by cuisine, read full cooking instructions and save favourites.

## Technologies Used
- React.js (functional components)
- React Hooks: `useState` and `useEffect`
- HTML / JSX
- Normal CSS (Flexbox and Grid)
- JavaScript with the Fetch API (`async` / `await`)
- Vite (development server)

## Features
- Horizontal navbar: Home, Explore Recipes, Favourites, About
- Search by recipe name or by ingredient
- Cuisine filter buttons with an **All** option
- Responsive recipe cards (image, name, cuisine, cooking time, View Recipe, heart button)
- Recipe details page: ingredients, instructions, cuisine, time, servings, Back button
- Add / remove favourites, saved with `localStorage` so they stay after refresh
- Loading message, error message and "no recipes found" message
- Works on desktop, tablet and mobile

## API Used
Free [DummyJSON Recipes API](https://dummyjson.com/recipes) (no API key needed)
- All recipes: `https://dummyjson.com/recipes?limit=0`
- Search: `https://dummyjson.com/recipes/search?q=pizza`
- One recipe: `https://dummyjson.com/recipes/1`

## Project Structure
- `src/App.jsx` : main logic (pages, search, filter, favourites)
- `src/components/Navbar.jsx` : top navigation bar
- `src/components/RecipeCard.jsx` : one recipe card
- `src/components/RecipeDetails.jsx` : full recipe page (fetches by id)
- `src/App.css`, `src/index.css` : styling

## Installation Steps
1. Install [Node.js](https://nodejs.org) (version 18 or newer).
2. Open a terminal inside the `recipe-finder` folder.
3. Run: `npm install`

## How to Run
Run `npm run dev` and open the address shown in the terminal (usually http://localhost:5173).
An internet connection is needed because recipes come from the API.

## Notes
- The cuisine buttons use names that exist in the API data: Indian, Italian, Mexican, Asian and American. The API has no "Chinese" cuisine, so "Asian" is used instead.
- Pages are switched using a `page` state variable instead of React Router, to keep the project simple.

// --- Express.js Backend Server ---
const express = require("express");
const cors = require("cors");
const fs = require("fs"); // Node's file system module
const path = require("path"); // Node's path module
const csv = require("csv-parser"); // Library to read CSV files
const app = express();
const PORT = process.env.PORT || 3000;
// --- Configuration ---
const CSV_FILE_PATH = path.join(__dirname, "IndianFoodDataset.csv");
let recipesDb = []; // Global array to hold all recipe data from CSV
let favoritesDb = {}; // In-memory store for user favorites

// --- CSV Loading Logic ---
function loadRecipesFromCsv() {
  return new Promise((resolve, reject) => {
    const tempRecipes = [];
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on("data", (data) => {
        const recipeTitle =
          data.TranslatedRecipeName || data.RecipeName || "Unknown Dish";

        // --- ID Generation Logic ---
        // 1. Use Srno if it exists and is valid.
        let id = data.Srno && data.Srno.trim() ? data.Srno.trim() : null;

        if (!id) {
          // 2. Fallback: Create a unique ID using the title and time (replacing spaces with hyphens)
          const normalizedTitle = recipeTitle
            .replace(/\s+/g, "-")
            .toLowerCase();
          id = `fallback-${normalizedTitle}-${data.TotalTimeInMins}`;
          // Ensure the fallback ID is URL-safe and unique
        }

        // --- IMAGE URL (Static Placeholder) ---
        // We use the static placeholder and ensure consistency by passing the required text.
        const dynamicImageURL = `https://www.shutterstock.com/shutterstock/photos/2645880327/display_1500/stock-photo-assorted-indian-food-on-black-background-indian-cuisine-top-view-with-copy-space-2645880327.jpg`;
        // --- End ID Generation ---

        // Clean up the structure for better use in the frontend
        const ingredientsArray = data.TranslatedIngredients
          ? data.TranslatedIngredients.split(",")
          : [];

        const instructionsString =
          data.TranslatedInstructions || data.Instructions || "";

        tempRecipes.push({
          id: id,
          title: recipeTitle,
          servings: data.Servings,
          time: `${data.TotalTimeInMins} min`,
          ingredients: ingredientsArray.map((i) => i.trim()),
          image: dynamicImageURL,
          instructions: instructionsString,
          cuisine: data.Cuisine,
          course: data.Course,
        });
      })
      .on("end", () => {
        // FIX: Ensure recipesDb is populated only after successful read
        recipesDb = tempRecipes;
        console.log(
          `Successfully loaded ${recipesDb.length} recipes from CSV.`,
        );
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        reject(error);
      });
  });
}

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Search Recipes (GET /api/recipes?q=...) - Searches local CSV data
app.get("/api/recipes", (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : "";

  // If recipesDb is empty, return an error state immediately
  if (recipesDb.length === 0) {
    return res
      .status(500)
      .json({ message: "Recipe database is not loaded on the server." });
  }

  if (!query) {
    // Return a small, random sample if no query is provided (Initial Load)
    return res.json(recipesDb.slice(0, 10));
  }

  // Filter recipes based on name or ingredients
  const results = recipesDb.filter(
    (recipe) =>
      // FIX: Use optional chaining and ensure properties exist before checking includes()
      recipe.title?.toLowerCase().includes(query) ||
      recipe.ingredients?.some((i) => i.toLowerCase().includes(query)),
  );

  // Simulate API delay for a realistic feel
  setTimeout(() => {
    res.json(results);
  }, 300);
});

// 2. Get Single Recipe Details (GET /api/recipes/:id)
app.get("/api/recipes/:id", (req, res) => {
  const id = req.params.id;
  const recipe = recipesDb.find((r) => r.id === id);

  if (recipe) {
    return res.json(recipe);
  } else {
    res.status(404).json({ message: "Recipe not found in local database." });
  }
});

// 3. Get Favorites List (GET /api/favorites)
app.get("/api/favorites", (req, res) => {
  res.json(Object.values(favoritesDb));
});

// 4. Toggle Favorite Status (POST /api/favorites/:id)
app.post("/api/favorites/:id", (req, res) => {
  const id = req.params.id;
  const isFavorite = !!favoritesDb[id];

  if (isFavorite) {
    delete favoritesDb[id];
    res.status(200).json({ message: "Removed from favorites" });
  } else {
    const recipeToAdd = req.body;
    if (recipeToAdd && recipeToAdd.id) {
      // Find the full recipe details from the main DB before saving to favorites
      const fullRecipe = recipesDb.find((r) => r.id === recipeToAdd.id);
      if (fullRecipe) {
        favoritesDb[id] = fullRecipe;
        res.status(201).json({ message: "Added to favorites" });
      } else {
        res.status(404).json({ message: "Recipe not found for favoriting." });
      }
    } else {
      res
        .status(400)
        .json({ message: "Invalid recipe data provided (missing ID)." });
    }
  }
});

// --- Server Startup ---
async function startServer() {
  try {
    await loadRecipesFromCsv();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Status: Serving recipes from local IndianFoodDataset.csv.");
    });
  } catch (e) {
    console.error("Failed to start server due to CSV loading error.");
    process.exit(1);
  }
}

startServer();

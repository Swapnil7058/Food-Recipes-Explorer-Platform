import { useState, useEffect, useCallback } from 'react';

// connecting with backends port no. 3000 ;
const EXPRESS_API_URL = "http://localhost:3000/api"; 


export const useRecipeData = () => {
  
  
  // State management
  // _________________________________________________________________________
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState({}); // {recipeId: recipeObject}
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // fetching data
  // _________________________________________________________________________
  const fetchData = useCallback(
    async (endpoint, options = {}) => {// here option is a empty  object 
    const url = `${EXPRESS_API_URL}/${endpoint}`;
    try {// error handling
        const response = await fetch(url, options);
        const clone = response.clone();
        
        let data;
        try {
            data = await response.json();
        } catch {
            const text = await clone.text();
            data = { message: text || `Non-JSON response from server.` };
        }
        
        if (!clone.ok) {// if status code is not 200 
            throw new Error(data.message || `HTTP error! Status: ${clone.status}`);
        }
        
        setError(null);
        return data;
    } catch (e) {// The "e" is Error object it includes name of error(eg. TypeError, ReferenceError) and error description message
        console.error(`Error fetching from ${url}:`, e);
        setError(`Connection Error: ${e.message}. Ensure Express server is running.`);
        return null;
    }
  }, []);


  // "favorite" Action Handler
  //__________________________________________________________________________
  const fetchFavorites = useCallback(
    async () => {
    const favArray = await fetchData('favorites');
    if (favArray !== 0) {
        const newFavorites = favArray.reduce((acc, recipe) => {
            acc[recipe.id] = recipe;
            return acc;
        }, {});
        setFavorites(newFavorites);
    }
  }, [fetchData]);


  // Fetches recipes based on the search term
  const fetchRecipes = useCallback(async (query) => {
    // If query is empty, treat it as a request for the initial sample
    const isInitialLoad = query === '';
    
    setRecipes([]);
    setIsLoading(true);
    setError(null); 

    let results = [];

    if (isInitialLoad) {
        // Fetch initial sample without query parameter
        results = await fetchData('recipes');
    } else {
        // Fetch based on search term
        results = await fetchData(`recipes?q=${encodeURIComponent(query)}`);
    }

    // FIX 2: Only filter for valid IDs after receiving results
    if (results && Array.isArray(results)) {
        const validResults = results.filter(r => r && r.id);
        setRecipes(validResults);
    }
    
    setIsLoading(false);
  }, [fetchData]);


  // Toggles the favorite status via POST request to the Express server
  const toggleFavorite = useCallback(async (recipe) => {
    // Check added previously to prevent the /undefined API call
    if (!recipe || !recipe.id) {
        setError("Cannot favorite: Recipe ID is missing or undefined.");
        console.error("Attempted to toggle favorite with missing recipe ID.");
        return; // Stop execution if ID is invalid
    }

    const isFavorite = !!favorites[recipe.id];
    
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isFavorite ? null : JSON.stringify(recipe) 
    };

    const result = await fetchData(`favorites/${recipe.id}`, options);
    
    if (result) {
        fetchFavorites();
    } else {
        console.warn("Favorite toggle failed on server side.");
    }
  }, [fetchData, favorites, fetchFavorites]);
  
  
  // Handles selecting a recipe card to view the details modal
  const handleSelectRecipe = useCallback(async (recipe) => {
      // FIX: Add ID validation here too, in case a card without an ID is clicked.
      if (!recipe || !recipe.id) {
          setError("Cannot view details: Recipe ID is missing.");
          console.error("Attempted to view details with missing recipe ID.");
          return; // Stop execution if ID is invalid
      }
      setSelectedRecipe(recipe);
  }, []);


  // ===================================
  // 4. LIFECYCLE: Initial Load and Polling
  // ===================================

  useEffect(() => {
    fetchFavorites(); 
    fetchRecipes(''); // Load initial recipes on startup

    const interval = setInterval(fetchFavorites, 5000); 
    
    return () => clearInterval(interval);
  }, [fetchFavorites, fetchRecipes]); 

  // ===================================
  // 5. RETURN VALUES
  // ===================================

  return {
    searchTerm, 
    recipes, 
    favorites, 
    selectedRecipe,
    isLoading, 
    error,
    
    setSearchTerm, 
    setSelectedRecipe, 

    fetchRecipes,
    toggleFavorite,
    handleSelectRecipe,
  };
};
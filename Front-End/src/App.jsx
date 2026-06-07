import React from 'react';
import { Utensils, Search, Loader } from 'lucide-react';

// Import Components 
import { useRecipeData } from './hooks/useRecipeData.js';
import { RecipeCard } from './components/RecipeCard.jsx';
import { DetailModal } from './components/DetailModal.jsx';
import { FavoriteList } from './components/FavoriteList.jsx';


const App = () => {
  
  
  // Destructures all state from useRecipeData.js inside hook folder
  const { 
    searchTerm, setSearchTerm, 
    recipes, favorites, 
    selectedRecipe, setSelectedRecipe,
    isLoading, error, 
    fetchRecipes, toggleFavorite, handleSelectRecipe,
  } = useRecipeData(); 
  
  // Search Action Handlers 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes(searchTerm);
  };

  //  Render Website Layout 
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      
      {/* Header */}
      <header className="mb-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-extrabold text-indigo-800 flex items-center">
              <Utensils size={32} className="mr-3 text-indigo-600"/> <span className='bg-amber-300'><span className='text-orange-600'>In</span><span className='text-white'>di</span><span className='text-green-700'>an</span></span> Recipe App (All In One)
            </h1>
        </div>

        {/* Developer Information */}
        <div className="border-t pt-3 mb-4">
            <div className="text-sm text-gray-700 leading-relaxed">
                Developed by: <span className="font-semibold text-indigo-700">@Swapnil Dhotre</span>
                <br/>
                <br/>
                <span className="font-bold text-slate-800">Technologies: This project utilizes</span>
                <ul className='list-disc ml-5'>
                <li><span className="font-semibold text-sky-700"> ReactJS </span> for the <span className='font-semibold text-slate-700'>Frontend.</span></li> 
                <li><span className="font-semibold text-pink-700"> Tailwind CSS </span> for <span className="font-semibold text-slate-700">Styling.</span></li>
                <li><span className="font-semibold text-lime-600"> Node.js/Express.js </span> for <span className="font-semibold text-slate-700">Backend.</span></li>
                </ul> 
                <br/>
                The recipe data is sourced directly from a local <span className="font-semibold text-green-700"> **CSV file** </span>.
            </div>
        </div>

        {/* About recipes source  */}
        <div className="flex items-center justify-between border-t pt-3">
            <p className="text-gray-600 text-sm font-semibold flex items-center">
                Backend: Uses Recipes data from local `IndianFoodDataset.csv` this is downloaded from GitHub.
            </p>
        </div>
      </header>

      {/* Favorites Section <FavoriteList> Component */}
      <section className="mb-8">
          <FavoriteList 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
              error={error} 
          />
      </section>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8 p-4 bg-white rounded-xl shadow-lg">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by ingredient or name (e.g., 'chicken', 'roti')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-4 focus:ring-indigo-500 text-gray-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors flex items-center font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={20} className="animate-spin" />// Loader Icon from Lucide-react package
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Search
              </>// Search Icon from Lucide-react package
            )}
          </button>
        </div>
      </form>

      {/* Recipe Results in Grid view */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            {recipes.length > 0 ? `Results for "${searchTerm}"` : 'Start Searching'}
        </h2>
        
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Map over recipes and render the <RecipeCard> component */}
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} // Each card item should have unique key(id) so that browser will keep record of element has changed 
                recipe={recipe} 
                // Pass handler function and state to RecipeCard
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleSelectRecipe={handleSelectRecipe}
              />
            ))}
          </div>
        ) : (
            !isLoading && searchTerm && (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm text-gray-500">
                    <p className="text-lg">No recipes found for "{searchTerm}". Try another search term!</p>
                </div>
            )
        )}

      </section>

      {/* Recipe Detail Modal <DetailModal> component */}
      <DetailModal 
        recipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)}
      />
      
    </div>
  );
};

export default App;
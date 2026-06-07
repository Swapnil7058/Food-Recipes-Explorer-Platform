import React from 'react';
import { Heart, Clock, Users } from 'lucide-react';

/**
 * RecipeCard Component
 * Displays a single recipe item with image, title, and buttons for favoriting and viewing details.
ent
 * {props.recipe} - The current recipe object.
 * {props.favorites} - The map of current favorites ({id: recipe}).
 * {props.toggleFavorite} - Handler to add/remove a favorite via API.
 * {props.handleSelectRecipe} - Handler to open the detail modal.
 */
export const RecipeCard = ({ recipe, favorites, toggleFavorite, handleSelectRecipe }) => {
    // Check if the current recipe ID exists in the favorites map
    const isFav = !!favorites[recipe.id];
    
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full">
        <div className="relative overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/e5e7eb/6b7280?text=No+Image'; }}
          />
          <button
            // Stop propagation to prevent the modal from opening if the user clicks the heart icon
            onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe); }}
            className={`absolute top-3 right-3 p-2 rounded-full ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500'} transition-colors shadow-md`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart size={20} fill={isFav ? 'currentColor' : 'none'} strokeWidth={2}/>
          </button>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{recipe.title}</h2>
          
          <div className="text-sm text-gray-500 space-y-1 mb-4">
              {recipe.time && (
                <div className="flex items-center">
                    <Clock size={14} className="mr-2 text-indigo-500" />
                    <span>{recipe.time}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center">
                    <Users size={14} className="mr-2 text-indigo-500" />
                    <span>Serves {recipe.servings}</span>
                </div>
              )}
          </div>

          <button
            onClick={() => handleSelectRecipe(recipe)}
            className="mt-auto w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            View Recipe
          </button>
        </div>
      </div>
    );
  };
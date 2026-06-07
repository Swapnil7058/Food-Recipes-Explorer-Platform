import React, { useMemo } from 'react';
import { Heart, X } from 'lucide-react';

/**
 * FavoriteList Component
 * Displays the current list of recipes marked as favorites by the user.
 * It also handles displaying global errors related to connectivity.
 
 * @props.favorites - The map of scurrent favorites ({id: recipe}).
 * @{function} props.toggleFavorite - Handler to remove a favorite via API.
 * @{string} props.error - Global error message from the hook.
 */

export const FavoriteList = ({ favorites, toggleFavorite, error }) => {
  
    // Used useMemo to prevent unnecessary re-rendering of the entire list structure
    const favoriteListContent = useMemo(() => {
        const favoriteArray = Object.values(favorites);

        if (favoriteArray.length === 0) {
            return (
                <p className="text-gray-500 italic">
                    No favorites added yet. Search for a recipe and click the heart icon!
                </p>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                {favoriteArray.map(fav => (
                    <div key={fav.id} className="flex items-center p-3 border rounded-lg shadow-sm bg-gray-50">
                        <img 
                            src={fav.image || 'https://placehold.co/60x60/e5e7eb/6b7280?text=Fav'} 
                            alt={fav.title} 
                            className="w-12 h-12 object-cover rounded-md mr-3"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/60x60/e5e7eb/6b7280?text=Fav'; }}
                        />
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold truncate text-gray-800">{fav.title}</p>
                            <p className="text-xs text-gray-500">Serves: {fav.servings || 'N/A'}</p>
                        </div>
                        <button
                            onClick={() => toggleFavorite(fav)}
                            className="ml-3 p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Remove Favorite"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        );
    }, [favorites, toggleFavorite]);


    return (
        <div className="p-4 bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart size={20} className="mr-2 text-red-500" fill="currentColor" />
                Your Favorites ({Object.keys(favorites).length})
            </h3>
            
            {/* Display Error Feedback if present */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-lg text-sm">
                    {error}
                </div>
            )}
            
            {favoriteListContent}
        </div>
    );
};
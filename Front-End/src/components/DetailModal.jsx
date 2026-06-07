import React from 'react';
import { X, Users, Utensils, BookOpen, Clock } from 'lucide-react';

/**
 * DetailModal Component
 * Displays the full recipe details in a modal overlay, including ingredients and instructions.
 */

export const DetailModal = ({ recipe, onClose }) => {
    if (!recipe) return null; // Render nothing if no recipe is selected

    return (
      // Modal Overlay
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        
        {/* Modal Content Card */}
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-red-500 transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Recipe Image */}
          <img 
            src={recipe.image || 'https://placehold.co/800x400/e5e7eb/6b7280?text=No+Image'} 
            alt={recipe.title} 
            className="w-full h-64 object-cover rounded-t-xl"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x400/e5e7eb/6b7280?text=No+Image'; }}
          />

          {/* Text Content Area */}
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">{recipe.title}</h2>
            
            {/* Metadata Bar */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-600 mb-6 border-b pb-4">
                <p className="flex items-center"><Users size={16} className="mr-2 text-indigo-500"/> Serves: {recipe.servings || 'N/A'}</p>
                <p className="flex items-center"><Clock size={16} className="mr-2 text-indigo-500"/> Time: {recipe.time || 'N/A'}</p>
                <p className="flex items-center"><span className="font-bold mr-2 text-indigo-500">Cuisine:</span> {recipe.cuisine || 'N/A'}</p>
                <p className="flex items-center"><span className="font-bold mr-2 text-indigo-500">Course:</span> {recipe.course || 'N/A'}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Ingredients List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <Utensils size={20} className="mr-2 text-red-500"/> Ingredients
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {recipe.ingredients && recipe.ingredients.map((item, index) => (
                            <li key={index} className="text-sm">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Instructions */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <BookOpen size={20} className="mr-2 text-green-500"/> Instructions
                    </h3>
                    {/* The whitespace-pre-wrap utility preserves line breaks within the string */}
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {recipe.instructions || "Instructions not available in the dataset."}
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
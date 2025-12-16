/**
 * IngredientAutocomplete - Composant de recherche d'ingrédients avec autocomplete
 * US-026: Autocomplete avec debounce 300ms, min 2 caractères, keyboard navigation
 */

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import api from '../../lib/api';

export default function IngredientAutocomplete({ 
  onSelect, 
  placeholder = 'Rechercher un ingrédient...',
  clearOnSelect = false,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Recherche d'ingrédients avec debounce
  useEffect(() => {
    const searchIngredients = async () => {
      // Ne pas rechercher si moins de 2 caractères
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setShowDropdown(true); // Ouvrir avant le chargement
        
        const response = await api.get(`/ingredients?search=${encodeURIComponent(debouncedSearchTerm)}`);
        setSuggestions(response.data || []);
      } catch (err) {
        console.error('Error searching ingredients:', err);
        setError('Erreur lors de la recherche');
        setSuggestions([]);
        setShowDropdown(true); // Garder ouvert pour afficher l'erreur
      } finally {
        setLoading(false);
      }
    };

    searchIngredients();
  }, [debouncedSearchTerm]);

  // Gestion de la sélection
  const handleSelect = (ingredient) => {
    onSelect(ingredient);
    
    if (clearOnSelect) {
      setSearchTerm('');
    } else {
      setSearchTerm(ingredient.name);
    }
    
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Gestion du clavier
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;

      default:
        break;
    }
  };

  // Fermer dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format de la catégorie pour affichage
  const formatCategory = (category) => {
    if (!category) return '';
    return category
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input de recherche */}
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        aria-label="Recherche d'ingrédient"
        aria-autocomplete="list"
        aria-controls="ingredient-suggestions"
        aria-expanded={showDropdown}
      />

      {/* Dropdown avec résultats */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="ingredient-suggestions"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
        >
          {/* Loading state */}
          {loading && (
            <div className="px-4 py-3 text-center text-gray-500">
              <svg
                className="inline-block w-5 h-5 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Recherche en cours...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="px-4 py-3 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && suggestions.length === 0 && (
            <div className="px-4 py-3 text-center text-gray-500">
              Aucun ingrédient trouvé
            </div>
          )}

          {/* Results */}
          {!loading && !error && suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((ingredient, index) => (
                <li key={ingredient.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(ingredient)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {ingredient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCategory(ingredient.category)}
                        </div>
                      </div>
                      
                      {/* Badge type (base/custom) */}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                          ingredient.type === 'custom'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-info/10 text-info border border-info/30'
                        }`}
                      >
                        {ingredient.type === 'custom' ? 'Custom' : 'Base'}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

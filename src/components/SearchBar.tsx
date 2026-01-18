import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { promptService } from '../services/promptService';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search prompts by keyword, category, or tag...', initialValue = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch suggestions as user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length >= 2) {
                const results = await promptService.getSearchSuggestions(query);
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 150);
        return () => clearTimeout(debounce);
    }, [query]);

    // Handle clicks outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = useCallback((searchQuery: string) => {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onSearch(searchQuery);
    }, [onSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                setQuery(suggestions[selectedIndex]);
                handleSubmit(suggestions[selectedIndex]);
            } else {
                handleSubmit(query);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current?.focus();
        onSearch('');
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        handleSubmit(suggestion);
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    className="search-input"
                    aria-label="Search prompts"
                    aria-autocomplete="list"
                    aria-controls="search-suggestions"
                    aria-expanded={showSuggestions}
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="search-clear-btn"
                        aria-label="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
                <button
                    onClick={() => handleSubmit(query)}
                    className="search-submit-btn"
                >
                    Search
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    id="search-suggestions"
                    className="search-suggestions"
                    role="listbox"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={suggestion}
                            className={`search-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            role="option"
                            aria-selected={index === selectedIndex}
                        >
                            <Search size={14} className="suggestion-icon" />
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// src/hooks/usePlaceAutocomplete.ts

import { useState, useEffect, useRef } from "react";
import { searchPlaces, type LocationOption } from "@/services/geoapify";

interface UsePlaceAutocompleteReturn {
  query: string;
  setQuery: (value: string) => void;
  options: LocationOption[];
  isLoading: boolean;
  selectedOption: LocationOption | null;
  selectOption: (option: LocationOption) => void;
  clearSelection: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function usePlaceAutocomplete(): UsePlaceAutocompleteReturn {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  // Debounce ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't search if user already selected an option
    if (selectedOption) return;

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      const results = await searchPlaces(query);
      setOptions(results);
      setIsOpen(results.length > 0);
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, selectedOption]);

  const selectOption = (option: LocationOption) => {
    setSelectedOption(option);
    setQuery(option.label);
    setOptions([]);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setSelectedOption(null);
    setQuery("");
    setOptions([]);
    setIsOpen(false);
  };

  return {
    query,
    setQuery,
    options,
    isLoading,
    selectedOption,
    selectOption,
    clearSelection,
    isOpen,
    setIsOpen,
  };
}
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
  setInitialOption: (option: LocationOption) => void;
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

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selectedOption) return;

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

  /**
   * Sets an initial option without opening dropdown or triggering search.
   * Used for pre-filling pickup with current location.
   */
  const setInitialOption = (option: LocationOption) => {
    setSelectedOption(option);
    setQuery(option.label);
  };

  return {
    query,
    setQuery,
    options,
    isLoading,
    selectedOption,
    selectOption,
    clearSelection,
    setInitialOption,
    isOpen,
    setIsOpen,
  };
}
// components/common/StateCitySelector.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";

interface StateCitySelectorProps {
  selectedState: string;
  selectedCity: string;
  onStateChange: (stateCode: string, stateName: string) => void;
  onCityChange: (city: string) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
}

export default function StateCitySelector({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  required = false,
  className = "",
  disabled = false,
  showLabel = true,
  label = "Location",
}: StateCitySelectorProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string>(selectedState || "");
  const [selectedCityName, setSelectedCityName] = useState<string>(selectedCity || "");

  // Get India country
  const india = useMemo(() => {
    return Country.getAllCountries().find((country) => country.isoCode === "IN");
  }, []);

  // Get all Indian states
  const indianStates = useMemo(() => {
    if (!india) return [];
    return State.getStatesOfCountry(india.isoCode);
  }, [india]);

  // Get cities for selected state
  const stateCities = useMemo(() => {
    if (!india || !selectedStateCode) return [];
    return City.getCitiesOfState(india.isoCode, selectedStateCode);
  }, [india, selectedStateCode]);

  // Update internal state when props change
  useEffect(() => {
    if (selectedState) {
      setSelectedStateCode(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      setSelectedCityName(selectedCity);
    }
  }, [selectedCity]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const stateName = selectedOption?.text || "";
    
    // Update internal state
    setSelectedStateCode(stateCode);
    setSelectedCityName(""); // Reset city when state changes
    
    // Notify parent
    onStateChange(stateCode, stateName);
    onCityChange(""); // Reset city in parent as well
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCityName(cityName);
    onCityChange(cityName);
  };

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
      {/* State Dropdown */}
      <div>
        {showLabel && (
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <MapPin className="mr-1.5 inline h-4 w-4" />
            State {required && <span className="text-[var(--danger)]">*</span>}
            <span className="ml-1.5 text-xs text-[var(--text-muted)]">(Optional)</span>
          </label>
        )}
        <select
          value={selectedStateCode || ""}
          onChange={handleStateChange}
          disabled={disabled || indianStates.length === 0}
          className="select-field disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {indianStates.length === 0 ? "Loading..." : "Select State (Optional)"}
          </option>
          {indianStates.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
        {indianStates.length === 0 && (
          <p className="mt-1 text-xs text-[var(--warning)]">Loading states...</p>
        )}
      </div>

      {/* City Dropdown */}
      <div>
        {showLabel && (
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <MapPin className="mr-1.5 inline h-4 w-4" />
            City {required && <span className="text-[var(--danger)]">*</span>}
            <span className="ml-1.5 text-xs text-[var(--text-muted)]">(Optional)</span>
          </label>
        )}
        <select
          value={selectedCityName || ""}
          onChange={handleCityChange}
          disabled={!selectedStateCode || disabled || stateCities.length === 0}
          className="select-field disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {!selectedStateCode 
              ? "Select state first" 
              : stateCities.length === 0 
                ? "No cities found" 
                : "Select City (Optional)"}
          </option>
          {stateCities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {selectedStateCode && stateCities.length === 0 && (
          <p className="mt-1 text-xs text-[var(--warning)]">No cities found for this state</p>
        )}
      </div>
    </div>
  );
}
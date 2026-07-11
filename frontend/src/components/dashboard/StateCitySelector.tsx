// components/common/StateCitySelector.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";

interface StateCitySelectorProps {
  selectedState: string;
  selectedCity: string;
  onStateChange: (state: string, stateName: string) => void;
  onCityChange: (city: string) => void;
  required?: boolean;
  className?: string;
}

export default function StateCitySelector({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  required = false,
  className = "",
}: StateCitySelectorProps) {
  const [selectedStateCode, setSelectedStateCode] = useState(selectedState || "");
  const [selectedCityName, setSelectedCityName] = useState(selectedCity || "");

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
    setSelectedStateCode(selectedState || "");
  }, [selectedState]);

  useEffect(() => {
    setSelectedCityName(selectedCity || "");
  }, [selectedCity]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const stateName = e.target.options[e.target.selectedIndex]?.text || "";
    setSelectedStateCode(stateCode);
    setSelectedCityName(""); // Reset city when state changes
    onCityChange("");
    onStateChange(stateCode, stateName);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCityName(cityName);
    onCityChange(cityName);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* State Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          <MapPin className="w-4 h-4 inline mr-1.5" />
          State {required && <span className="text-red-400">*</span>}
        </label>
        <select
          value={selectedStateCode}
          onChange={handleStateChange}
          className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="">Select State</option>
          {indianStates.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          <MapPin className="w-4 h-4 inline mr-1.5" />
          City 
        </label>
        <select
          value={selectedCityName}
          onChange={handleCityChange}
          disabled={!selectedStateCode}
          className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50"
        >
          <option value="">
            {!selectedStateCode ? "Select state first" : "Select City"}
          </option>
          {stateCities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {selectedStateCode && stateCities.length === 0 && (
          <p className="mt-1 text-xs text-yellow-400">No cities found for this state</p>
        )}
      </div>
    </div>
  );
}
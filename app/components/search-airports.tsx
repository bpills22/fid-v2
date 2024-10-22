"use client";

import { useState } from "react";
import { paths } from "@/api/aeroapi-openapi.4.22.0";

async function getAirportByCode(code: string) {
  try {
    const response = await fetch(`/api/airports/${code}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching airport data:", error);
    return null;
  }
}

export default function SearchAirports() {
  const [airportSearch, setAirportSearch] = useState("sfo");
  const [airportByCode, setAirportByCode] = useState<
    | paths["/airports/{id}"]["get"]["responses"]["200"]["content"]["application/json; charset=UTF-8"]
    | null
  >(null);

  async function findAirport() {
    try {
      const data = await getAirportByCode(airportSearch);
      setAirportByCode(data);
    } catch (error) {
      console.error("Error fetching airport data:", error);
    }
  }

  return (
    <div>
      <input
        type="text"
        name="airport"
        id="airport"
        placeholder="Enter airport code"
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        value={airportSearch}
        onChange={(e) => setAirportSearch(e.target.value)}
      />
      <button
        onClick={() => findAirport()}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Search
      </button>
      <h3>Airport</h3>
      {airportByCode && <pre>{JSON.stringify(airportByCode, null, "  ")}</pre>}
    </div>
  );
}

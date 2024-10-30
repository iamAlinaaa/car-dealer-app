"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  const [vehicleMakes, setVehicleMakes] = useState<any[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i <= currentYear - 2015; i++) {
    years.push((2015 + i).toString());
  }

  useEffect(() => {
    const fetchVehicleMakes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/GetMakesForVehicleType/car?format=json`
        );
        if (!response.ok) throw new Error("Fetching vehicle makes failed");
        const data = await response.json();
        setVehicleMakes(data.Results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVehicleMakes();
  }, []);

  const vehicleMakeChangeHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMake(e.target.value);
  };

  const yearChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      <div className="background-image" />
      <h1
        className="text-3xl font-bold mb-6 relative z-10 bg-white bg-opacity-10 
      backdrop-blur-md rounded-lg p-4 shadow-md text-white"
      >
        Find the Perfect Car
      </h1>
      <select
        value={selectedMake}
        onChange={vehicleMakeChangeHandler}
        className="mb-8 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 shadow-md
         focus:outline-none max-w-xs w-full"
      >
        <option value="">Select Vehicle Make</option>
        {vehicleMakes.map((make) => (
          <option key={make.MakeId} value={make.MakeId}>
            {make.MakeName}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={yearChangeHandler}
        className="mb-8 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 shadow-md 
        focus:outline-none max-w-xs w-full"
      >
        <option value="">Select Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <Link href={`/result/${selectedMake}/${selectedYear}`} passHref>
        <button
          disabled={!selectedMake || !selectedYear}
          className={`p-3 min-w-[100px] text-white text-lg font-semibold rounded-lg relative z-10 ${
            !selectedMake || !selectedYear
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-800 shadow-md hover:shadow-lg hover:scale-105"
          }`}
        >
          Next
        </button>
      </Link>
    </div>
  );
}

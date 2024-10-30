import React from "react";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";
import { LoadingIndicator } from "@/components/LoadingIndicator";

const fetchVehicleModels = async (makeId: string, year: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch vehicle models");
  }
  return await response.json();
};

const fetchMakeName = async (makeId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/GetAllMakes?format=json`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch make name");
  }
  const data = await response.json();
  const make = data.Results.find((m: any) => m.Make_ID.toString() === makeId);
  return make ? make.Make_Name : "Unknown Make";
};

const ResultPage = async ({
  params,
}: {
  params: { makeId: string; year: string };
}) => {
  const { makeId, year } = await params;

  const vehicleModels = await fetchVehicleModels(makeId, year);
  console.log(vehicleModels);

  const makeName = await fetchMakeName(makeId);

  return (
    <div className="p-4">
      <div className="background-image result-page" />
      <h1
        className="text-3xl font-bold mt-4 mb-6 relative z-10 bg-white bg-opacity-10 
      backdrop-blur-md rounded-lg p-4 shadow-md text-white text-center"
      >
        Vehicle Models for {makeName} in {year}
      </h1>

      {vehicleModels.Results.length > 0 ? (
        <ul>
          {vehicleModels.Results.map((model: any) => (
            <li
              key={uuidv4()}
              className="mb-4 p-4 bg-white bg-opacity-90 text-gray-700 border 
              border-gray-300 rounded-lg shadow-md hover:bg-opacity-80 text-lg"
            >
              {model.Model_Name} ({makeName})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-800 text-xl text-center mt-4">
          No vehicle models found.
        </p>
      )}
    </div>
  );
};

export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/GetMakesForVehicleType/car?format=json`
  );
  const data = await response.json();

  const params = [];

  for (const make of data.Results) {
    for (let year = 2015; year <= new Date().getFullYear(); year++) {
      params.push({
        makeId: make.MakeId.toString(),
        year: year.toString(),
      });
    }
  }

  return params;
}

const SuspenseWrapper = ({
  params,
}: {
  params: { makeId: string; year: string };
}) => (
  <Suspense fallback={<LoadingIndicator />}>
    <ResultPage params={params} />
  </Suspense>
);

export default SuspenseWrapper;

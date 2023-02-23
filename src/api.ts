import {
  GroupBase,
  OptionsOrGroups,
} from "react-select/dist/declarations/src/types";
import { haversineDistance } from "./utils";
import { Option } from "./types";

type City = [string, number, number];
const citiesList: Array<City> = [
  ["Paris", 48.856614, 2.352222],

  ["Marseille", 43.296482, 5.36978],

  ["Lyon", 45.764043, 4.835659],

  ["Toulouse", 43.604652, 1.444209],

  ["Nice", 43.710173, 7.261953],

  ["Nantes", 47.218371, -1.553621],

  ["Strasbourg", 48.573405, 7.752111],

  ["Montpellier", 43.610769, 3.876716],

  ["Bordeaux", 44.837789, -0.57918],

  ["Lille", 50.62925, 3.057256],

  ["Rennes", 48.117266, -1.677793],

  ["Reims", 49.258329, 4.031696],

  ["Le Havre", 49.49437, 0.107929],

  ["Saint-Étienne", 45.439695, 4.387178],

  ["Toulon", 43.124228, 5.928],

  ["Angers", 47.478419, -0.563166],

  ["Grenoble", 45.188529, 5.724524],

  ["Dijon", 47.322047, 5.04148],

  ["Nîmes", 43.836699, 4.360054],

  ["Aix-en-Provence", 43.529742, 5.447427],
];

interface Search {
  (
    inputValue: string,
    callback: (options: OptionsOrGroups<Option, GroupBase<Option>>) => void
  ): void | Promise<OptionsOrGroups<Option, GroupBase<Option>>>;
}

export const searchCities: Search = (inputValue, callback) => {
  const promise = new Promise<OptionsOrGroups<Option, GroupBase<Option>>>(
    (resolve, reject) => {
      setTimeout(() => {
        if (inputValue === "fail") {
          reject("API failed to return results");
        }
        const list = citiesList
          .filter((city: City) => new RegExp(inputValue, "i").test(city[0]))
          .map((city) => ({
            label: city[0],
            value: [city[1], city[2]] as [number, number],
          }));
        resolve(list);
      }, 500);
    }
  );
  promise
    .then((options) => callback(options))
    .catch((err) => {
      console.log(err);
      callback([]);
    });
};

export const calculateDistances = (
  destinations: string[],
  coords: [number, number][]
) => {
  return new Promise<[number[], number]>((resolve, reject) => {
    let total = 0;
    setTimeout(() => {
      if (destinations.includes("Dijon")) {
        reject("API failed to return results");
      }
      const distances = [];
      for (let i = 1; i < coords.length; i++) {
        const distance = haversineDistance(coords[i - 1], coords[i]);
        distances.push(distance);
        total += distance;
      }
      resolve([distances, total]);
    }, 500);
  });
};

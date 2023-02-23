import { Errors, Option } from "./types";

export const formatDate = (date: Date) => {
  const shortMonth = date.toLocaleString("default", { month: "short" });
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const displayDate = `${shortMonth} ${day}, ${year}`;
  const isoDate = `${year}-${month === 1 ? "0" + month : month}-${
    day.toString().length === 1 ? "0" + day : day
  }`;
  return [displayDate, isoDate];
};

export const filterPassedTime = (time: Date) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);
  return currentDate.getTime() < selectedDate.getTime();
};

export const createErrorsObject = (
  passengers: number,
  date: Date,
  origin: Option | null,
  selectedDestinations: Array<Option | null>
) => {
  const newErrors: Errors = {};
  newErrors.destinations = [];
  newErrors.passengers = passengers ? undefined : "Select passengers";
  newErrors.date = date ? undefined : "Select date";
  newErrors.origin = origin ? undefined : "You must choose city of origin";
  for (let i = 0; i < selectedDestinations.length; i++) {
    let destination = selectedDestinations[i];
    newErrors.destinations[i] = destination
      ? undefined
      : "You must choose city of destination";
  }
  if (!newErrors.destinations.some((destination) => destination)) {
    delete newErrors.destinations;
  }
  Object.entries(newErrors).forEach(([key, value]) => {
    if (!value) {
      delete newErrors[key as keyof Errors];
    }
  });
  return newErrors;
};

interface Location {
  lat: number;
  lng: number;
}

export const haversineDistance = (
  location1: [number, number],
  location2: [number, number]
): number => {
  if (!location1 || !location2) {
    return 0;
  }
  const earthRadius = 6371; // in kilometers

  const [lat1, lng1] = location1;
  const [lat2, lng2] = location2;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
};

const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// export const calculateTotalDistance = (locations: Location[]): number => {
//   let totalDistance = 0;

//   for (let i = 0; i < locations.length - 1; i++) {
//     const location1 = locations[i];
//     const location2 = locations[i + 1];
//     const distance = haversineDistance(location1, location2);
//     totalDistance += distance;
//   }

//   return totalDistance;
// };

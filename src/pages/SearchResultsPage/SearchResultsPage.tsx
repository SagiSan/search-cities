import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResultsPage.styles.css";
import { BsCircle, BsThreeDotsVertical } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { formatDate } from "../../utils";
import { calculateDistances } from "../../api";
import { useEffect, useState } from "react";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const passengers = params.get("passengers");
  const [date, isoDate] = formatDate(new Date(params.get("date") as string));
  const destinations = params.getAll("destination");
  const coords: Array<[number, number]> = params
    .getAll("coords")
    .map(
      (coord) =>
        coord.split(",").map((str) => parseFloat(str)) as [number, number]
    );
  const [distances, setDistances] = useState<number[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    asyncCalculateDistances();
  }, []);

  const asyncCalculateDistances = async () => {
    try {
      const [distances, total] = await calculateDistances(destinations, coords);
      setDistances(distances);
      setTotalDistance(total);
    } catch (err) {
      console.log(err);
      setError(err as string);
    }
  };

  const onBack = () => {
    let url = "/search";
    url += `?passengers=${encodeURIComponent(passengers as string)}`;
    url += `&date=${encodeURIComponent(params.get("date") as string)}`;
    url = destinations.reduce((acc, destination, index) => {
      const encodedDestination = encodeURIComponent(destination);
      const encodeCoordinates = encodeURIComponent(coords[index].toString());
      return `${acc}&destination=${encodedDestination}&coords=${encodeCoordinates}`;
    }, url);
    navigate(url);
  };

  return (
    <div className="SearchResultsPage">
      <div className="destinations">
        {destinations.map((destination, index) => {
          return (
            <Row
              key={index}
              destination={destination}
              distance={distances[index - 1]}
              isFirst={index === 0}
              isLast={index === destinations.length - 1}
              error={error}
            />
          );
        })}
      </div>
      {totalDistance || error ? (
        <p>
          <span className="highlight">
            {error ? "--" : totalDistance.toFixed(2)}
          </span>{" "}
          km is total distance
        </p>
      ) : (
        <span>Calculating...</span>
      )}
      <p>
        <span className="highlight">{passengers}</span> passengers
      </p>
      <time dateTime={isoDate} className="highlight">
        {date}
      </time>
      <br />
      <button type="button" className="back-btn" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

const Row = ({
  destination,
  distance,
  isFirst = false,
  isLast = false,
  error,
}: {
  destination: string;
  distance: number;
  isFirst: boolean;
  isLast: boolean;
  error: string;
}) => {
  const distanceStr = distance?.toFixed(2).toString();
  return (
    <div className="row">
      {!isFirst ? (
        <div className="distance">
          {distanceStr || error ? (
            <Tooltip text={`${error ? "--" : distanceStr} km`} />
          ) : (
            <span>Calculating...</span>
          )}
          <BsThreeDotsVertical />
        </div>
      ) : null}
      <div className="destination">
        {isLast ? (
          <GoLocation
            color="red"
            style={{ fontSize: "22px", position: "relative", right: "2px" }}
          />
        ) : (
          <BsCircle />
        )}
        <span style={{ marginLeft: "20px" }}>{destination}</span>
      </div>
    </div>
  );
};
export { SearchResultsPage };

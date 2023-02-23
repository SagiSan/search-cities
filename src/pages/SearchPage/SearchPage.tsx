import { useEffect, useRef, useState } from "react";
import { AutoCompleteInput } from "../../components/AutoCompleteInput/AutoCompleteInput";
import "./SearchPage.styles.css";
import { useLocation, useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createErrorsObject, filterPassedTime } from "../../utils";
import { SingleValue } from "react-select";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { Errors, Option } from "../../types";
import { BsPlusCircle } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";

const SearchPage = () => {
  const isInitialMount = useRef(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [origin, setOrigin] = useState<Option | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<
    Array<Option | null>
  >([null]);
  const [date, setDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [passengers, setPassengers] = useState(0);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newPassengers = params.get("passengers");
    const newDate = params.get("date");
    const newDestinations = params.getAll("destination");
    const newCoords = params.getAll("coords");
    if (newPassengers) {
      setPassengers(parseInt(newPassengers));
    }
    if (newDate && new Date(newDate) > date) {
      setDate(new Date(newDate));
    }
    if (newDestinations?.length) {
      const data = newDestinations.map((destination, index) => ({
        value: newCoords[index].split(",").map((str) => parseFloat(str)) as [
          number,
          number
        ],
        label: destination,
      }));
      setOrigin(data[0]);
      data.splice(0, 1);
      setSelectedDestinations(data);
    }
  }, [location.search]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      validateForm();
    }
  }, [passengers, date, origin, selectedDestinations]);

  const onDestinationChange = (
    selectedOption: SingleValue<Option>,
    index: number
  ) => {
    const newSelectedDestinations = [...selectedDestinations];
    newSelectedDestinations[index] = selectedOption;
    setSelectedDestinations(newSelectedDestinations);
  };

  const onAddDestination = () => {
    setSelectedDestinations([...selectedDestinations, null]);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    validateForm();
    if (Object.keys(errors).length) return;
    let url = "/search-results";
    url += `?passengers=${encodeURIComponent(passengers)}`;
    url += `&date=${encodeURIComponent(date.toISOString())}`;
    url += `&destination=${encodeURIComponent(
      origin!.label
    )}&coords=${encodeURIComponent(origin!.value.toString())}`;
    url = selectedDestinations
      .filter((des) => des)
      .reduce((acc, destination) => {
        const encodedDestination = encodeURIComponent(destination!.label);
        const encodeCoordinates = encodeURIComponent(
          destination!.value.toString()
        );
        return `${acc}&destination=${encodedDestination}&coords=${encodeCoordinates}`;
      }, url);
    navigate(url);
  };

  const onRemoveDestination = (index: number) => {
    const newDestinations = [...selectedDestinations];
    newDestinations.splice(index, 1);
    setSelectedDestinations(newDestinations);
  };

  const validateForm = () => {
    const newErrors: Errors = createErrorsObject(
      passengers,
      date,
      origin,
      selectedDestinations
    );
    setErrors(newErrors);
  };

  const isFormValid = !Object.keys(errors).length;

  return (
    <div className="SearchPage">
      <form
        onSubmit={onSubmit}
        className={`${!isFormValid ? "form-errors" : ""}`}
      >
        <div className="form-container">
          <div className="destinations">
            <div className="input-row">
              <label htmlFor="origin" className="label">
                City of origin
              </label>
              <AutoCompleteInput
                value={origin}
                onChange={setOrigin}
                name="destination_origin"
                error={errors.origin}
              />
            </div>
            {selectedDestinations.map((selectedDestination, index) => (
              <div key={index} className="input-row">
                <div className="input-container">
                  <label htmlFor="destination" className="label">
                    City of destination
                  </label>
                  <div className="input-wrapper">
                    <div className="input">
                      <AutoCompleteInput
                        value={selectedDestination}
                        onChange={(selectedOption) =>
                          onDestinationChange(selectedOption, index)
                        }
                        name={`destination_${index}`}
                        error={errors?.destinations?.[index]}
                      />
                    </div>
                    {selectedDestinations.length !== 1 ? (
                      <div
                        className="remove-destination"
                        onClick={() => onRemoveDestination(index)}
                      >
                        <TiDeleteOutline size={22} color="#7786D2" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            <button
              className="add-destination"
              disabled={selectedDestinations.length > 8}
              type="button"
              onClick={onAddDestination}
            >
              <BsPlusCircle style={{ marginRight: "20px" }} />
              Add destination
            </button>
          </div>
          <div className="additional-info">
            <div>
              <label className="label">Date</label>
              <br />
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                filterDate={filterPassedTime}
                onFocus={(e) => (e.target.readOnly = true)}
              />
              {errors.date ? <ErrorMessage text={errors.date} /> : null}
            </div>
            <div>
              <label className="label">Passengers</label>
              <div className="passenger-btns">
                <button
                  type="button"
                  disabled={!passengers}
                  onClick={() => setPassengers(passengers - 1)}
                >
                  -
                </button>
                <span className="passengers-num">{passengers}</span>
                <button
                  type="button"
                  disabled={passengers >= 99}
                  onClick={() => setPassengers(passengers + 1)}
                >
                  +
                </button>
              </div>
              {errors?.passengers ? (
                <ErrorMessage text={errors.passengers} />
              ) : null}
            </div>
          </div>
        </div>
        <input
          className="submit"
          disabled={!isFormValid}
          type="submit"
          title="Submit"
        />
      </form>
    </div>
  );
};

export { SearchPage };

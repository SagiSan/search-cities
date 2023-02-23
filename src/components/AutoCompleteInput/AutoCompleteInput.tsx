import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { searchCities } from "../../api";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Option } from "../../types";

interface Props {
  value: Option | null;
  onChange: (destination: SingleValue<Option>) => void;
  name: string;
  error?: string;
}

const AutoCompleteInput = ({ value, onChange, name, error }: Props) => {
  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: error ? "1px solid red" : base.border,
    }),
  };

  return (
    <>
      <AsyncSelect
        styles={customStyles}
        loadOptions={searchCities}
        cacheOptions
        value={value}
        onChange={onChange}
        isSearchable
        isClearable
        name={name}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
      {error ? <ErrorMessage text={error} /> : null}
    </>
  );
};

export { AutoCompleteInput };

import React from "react";
import Autosuggest from "react-autosuggest";
import styled from "styled-components";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { reqCustomers } from "services/customer";

type WrapperProps = {
  error: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__input {
    width: 100%;
    height: 30px;
    padding: 18.5px 14px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
    border: 1px solid ${(props) => (props.error ? "red" : "#aaa")};
    border-radius: 4px;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: 38px;
    width: 100%;
    border: 1px solid #aaa;
    background-color: #fff;
    font-weight: 300;
    font-size: 16px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 2;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 10px 20px;
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: #ddd;
  }
`;

function myShowErrorFunction({
  meta: { submitError, dirtySinceLastSubmit, error, touched },
}: any): boolean {
  return !!(((submitError && !dirtySinceLastSubmit) || error) && touched);
}

type Customer = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  createdAt: object;
  updatedAt: object;
};

const getSuggestionValue = (suggestion: { name: string }) => suggestion.name;
const renderSuggestion = (suggestion: { name: string }) => (
  <div>{suggestion.name}</div>
);

const CustomerAutosuggest = (props: any) => {
  const [value, setValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Customer[]>([]);
  const { input } = props;

  React.useEffect(() => {
    if (typeof input === "object" && input.value && input.value.name) {
      setValue(input.value.name);
    } else {
      setValue(input.value);
    }
  }, [input.value]);

  const onChange = (event: object, { newValue }: { newValue: string }) => {
    input.onChange(event);
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    reqCustomers(value).then((customers: any) => setSuggestions(customers));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event: object,
    { suggestion }: { suggestion: object }
  ) => {
    input.onChange(suggestion);
  };

  const inputProps = {
    ...input,
    placeholder: "ผู้ว่างจ้าง",
    value,
    onChange,
  };

  return (
    <FormControl fullWidth>
      <Wrapper error={myShowErrorFunction(props)}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={inputProps}
        />
      </Wrapper>

      {myShowErrorFunction(props) && (
        <FormHelperText error>กรุณากรอกชื่อผู้จ้าง</FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomerAutosuggest;

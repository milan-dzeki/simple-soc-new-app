import { ChangeEvent, useReducer, useCallback, useEffect, useState } from "react";
import { IForm } from "../../types/formsAndInputs/form";
import reducer from "./useFormReducer";
import { ActionTypes } from "./useFormTypes";
import axiosCSC from "../../axios/axiosCSC";

export const useForm = (form: IForm): {
  form: IForm;
  onSetForm: (providedForm: IForm) => void;
  onGetUSStates: () => Promise<{name: string, code: string}[] | undefined>;
  onGetCountries: () => Promise<{name: string, code: string}[] | undefined>;
  onGetCitiesOfCountry: (countryCode: string) => Promise<string[] | undefined>;
  onGetUSStatesCities: (stateCode: string) => Promise<string[] | undefined>;
  onInputFocus: (inputGroup: string, inputName: string) => void;
  onCountryInputFocus: (inputGroup: string, inputName: string) => Promise<void>;
  onInputUnfocus: (inputGroup: string, inputName: string) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onSelectInputChange: (inputGroup: string, inputName: string, inputValue: string) => Promise<void>;
  onRadioInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string) => void;
  onTogglePasswordInputVisibility: (inputGroup: string, inputName: string) => void;
} => {
  const [state, dispatch] = useReducer(reducer, form);

  const [countries, setCountries] = useState<{name: string, code: string}[]>([]);
  const [usStates, setUSStates] = useState<{name: string, code: string}[]>([]);

  const onGetCountries = useCallback(async(): Promise<{name: string, code: string}[] | undefined> => {
    try {
      const { data } = await axiosCSC.get<{status: string, countries: {name: string, code: string}[]}>("/countries");
      setCountries(data.countries);
      return data.countries;
    } catch(error) {
      console.log(error);
      
    }
  }, []);

  const onGetUSStates = useCallback(async(): Promise<{name: string, code: string}[] | undefined> => {
    try {
      const {data} = await axiosCSC.get<{status: string, usStates: {name: string, code: string}[]}>("/us-states");
    
      setUSStates(data.usStates);
      return data.usStates;
    } catch(error) {
      console.log(error);
      
    }
  }, []);

  const onGetCitiesOfCountry = useCallback(async(countryCode: string): Promise<string[] | undefined> => {
    try {
      const {data} = await axiosCSC.get<{status: string, cities: string[]}>(`/cities/${countryCode}`);
    
      return data.cities;
    } catch(error) {
      console.log(error);
      
    }
  }, []);

  const onGetUSStatesCities = useCallback(async(stateCode: string): Promise<string[] | undefined> => {
    try {
      const {data} = await axiosCSC.get<{status: string, cities: string[]}>(`/us-cities/${stateCode}`);
      return data.cities;
    } catch(error) {
      console.log(error);
      
    }
  }, []);

  const isFormValid = useCallback(() => {
    let formIsValid = false;
    let valids: boolean[] = [];

    for(const group in state.inputs) {
      for(const input in state.inputs[group]) {
        valids.push(state.inputs[group][input].valid)
      }
    }

    if(valids.every(item => item === true)) {
      formIsValid = true;
    }

    dispatch({
      type: ActionTypes.IS_FORM_VALID,
      formIsValid
    });
  },[state.inputs]);
  
  useEffect(() => {
    isFormValid();
  }, [isFormValid]);

  const onSetForm = useCallback((providedForm: IForm): void => {
    dispatch({
      type: ActionTypes.ON_SET_FORM,
      providedForm
    });
  }, []);

  const onInputFocus = useCallback((inputGroup: string, inputName: string): void => {
    console.log(inputGroup, inputName);
    
    dispatch({
      type: ActionTypes.ON_INPUT_FOCUS,
      inputGroup,
      inputName
    });
  }, []);

  const onCountryInputFocus = useCallback(async(inputGroup: string, inputName: string): Promise<void> => {
    if(countries.length === 0) {
      const fetchedCountries = await onGetCountries();
      dispatch({
        type: ActionTypes.ON_COUNTRY_INPUT_FOCUS,
        inputGroup,
        inputName,
        countries: Array.from(new Set(fetchedCountries!.map(ctr => ctr.name)))
      });
    } else  {
      dispatch({
        type: ActionTypes.ON_COUNTRY_INPUT_FOCUS,
        inputGroup,
        inputName,
        countries: Array.from(new Set(countries.map(ctr => ctr.name)))
      });
    }
  }, [countries, onGetCountries]);

  const onInputUnfocus = useCallback((inputGroup: string, inputName: string): void => {
    dispatch({
      type: ActionTypes.ON_INPUT_UNFOCUS,
      inputGroup,
      inputName
    });
  }, []);

  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string): void => {
    const { name, value } = event.target;
    dispatch({
      type: ActionTypes.ON_INPUT_CHANGE,
      inputGroup,
      inputName: name,
      inputValue: value,
    });
  }, []);

  const onSelectInputChange = useCallback(async(inputGroup: string, inputName: string, inputValue: string): Promise<void> => {
    if(inputName.toLowerCase().includes("country")) {
      let states: string[] = [];
      let cities: string[] = [];
      let statesDisabled = true;
      let citiesDisabled = true;

      if(inputValue.toLowerCase() === "united states") {
        if(usStates.length === 0) {
          const fetchedUSStates = await onGetUSStates();
          if(fetchedUSStates) {
            states = Array.from(new Set(fetchedUSStates.map(st => st.name)));
          } 
        } else {
          states = Array.from(new Set(usStates.map(st => st.name)));
        }

        statesDisabled = false;
        citiesDisabled = true;
      } else {
        if(countries.length === 0) {const fetchedCountries = await onGetCountries();
          if(fetchedCountries) {
            const targetCountry = fetchedCountries.find(ctr => ctr.name.toLowerCase() === inputValue.toLowerCase());
            if(targetCountry) {
              const fetchedCities = await onGetCitiesOfCountry(targetCountry.code);
              if(fetchedCities) {
                cities = Array.from(new Set(fetchedCities));
              }
            }
          }
        } else {
          const targetCountry = countries.find(ctr => ctr.name.toLowerCase() === inputValue.toLowerCase());
          console.log(targetCountry);
          
          if(targetCountry) {
            const fetchedCities = await onGetCitiesOfCountry(targetCountry.code);
            if(fetchedCities) {
              cities = Array.from(new Set(fetchedCities));
            }
          }
        }

        citiesDisabled = false;
        statesDisabled = true;
      }
      
      dispatch({
        type: ActionTypes.ON_SELECT_INPUT_CHANGE,
        inputGroup,
        inputName,
        inputValue,
        states,
        cities,
        statesDisabled,
        citiesDisabled,
      });
      return;
    } else if(inputName.toLowerCase().includes("state")) {
      let cities: string[] = [];

      if(usStates.length === 0) {
        const fetchedUSStates = await onGetUSStates();
        if(fetchedUSStates) {
          const targetState = fetchedUSStates.find(st => st.name.toLowerCase() === inputValue.toLowerCase());
          if(targetState) {
            const fetchedCities = await onGetUSStatesCities(targetState.code);
            if(fetchedCities) {
              cities = Array.from(new Set(fetchedCities));
            }
          }
        }
      } else {
        const targetState = usStates.find(st => st.name === inputValue);
          if(targetState) {
            const fetchedCities = await onGetUSStatesCities(targetState.code);
            if(fetchedCities) {
              cities = Array.from(new Set(fetchedCities));
            }
          }
      }

      dispatch({
        type: ActionTypes.ON_SELECT_INPUT_CHANGE,
        inputGroup,
        inputName,
        inputValue,
        cities,
        citiesDisabled: false
      });

      return;
    }
    dispatch({
      type: ActionTypes.ON_SELECT_INPUT_CHANGE,
      inputGroup,
      inputName,
      inputValue
    });
  }, [countries, usStates, onGetCitiesOfCountry, onGetCountries, onGetUSStates, onGetUSStatesCities]);

  const onRadioInputChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputGroup: string): void => {
    const { name, id } = event.target;
    dispatch({
      type: ActionTypes.ON_RADIO_INPUT_CHANGE,
      inputGroup,
      inputGroupName: name,
      inputName: id
    });
  }, []);

  const onTogglePasswordInputVisibility = useCallback((inputGroup: string, inputName: string): void => {
    dispatch({
      type: ActionTypes.ON_TOGGLE_PASSWORD_INPUT_VISIBILITY,
      inputGroup,
      inputName
    });
  }, []);

  return {
    form: state,
    onSetForm,
    onGetUSStates,
    onGetCountries,
    onGetCitiesOfCountry,
    onGetUSStatesCities,
    onInputFocus,
    onCountryInputFocus,
    onInputUnfocus,
    onInputChange,
    onSelectInputChange,
    onRadioInputChange,
    onTogglePasswordInputVisibility
  };
};
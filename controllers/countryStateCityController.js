const { Country, State, City } = require("country-state-city");

exports.getCountries = (req, res, next) => {
  const countries = Country.getAllCountries().map(ctr => {
    return {
      name: ctr.name,
      code: ctr.isoCode
    };
  })
  console.log(countries);

  res.status(200).json({
    status: "success",
    countries
  })
};
exports.getUSStates = (req, res, next) => {
  const usStates = State.getStatesOfCountry("US").map(ctr => {
    return {
      name: ctr.name,
      code: ctr.isoCode
    };
  })
  console.log(usStates);

  res.status(200).json({
    status: "success",
    usStates
  })
};

exports.getUSStateCities = (req, res, next) => {
  const {stateCode} = req.params;
  const cities = City.getCitiesOfState("US", stateCode).map(ct => ct.name);

  res.status(200).json({
    status: "success",
    cities
  });
};
exports.getCitiesOfCountry = (req, res, next) => {
  const {countryCode} = req.params;
  const cities = City.getCitiesOfCountry(countryCode).map(ct => ct.name);

  res.status(200).json({
    status: "success",
    cities
  });
};
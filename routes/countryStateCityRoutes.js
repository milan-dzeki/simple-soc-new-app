const { Router }  = require("express");
const { getCountries, getUSStates, getCitiesOfCountry, getUSStateCities } = require("../controllers/countryStateCityController");

const router = Router();

router.get("/countries", getCountries);
router.get("/us-states", getUSStates);
router.get("/cities/:countryCode", getCitiesOfCountry);
router.get("/us-cities/:stateCode", getUSStateCities);

module.exports = router;
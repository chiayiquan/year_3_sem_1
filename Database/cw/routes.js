const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports = function (app) {
  app.get("/", async function (_req, res) {
    const selectWorldTotalPopulationQuery =
      "SELECT FORMAT(SUM(population),0) as total_population FROM Population;";
    const selectWorldCovidQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectWorldVaccinationQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectWorldTotalCovidQuery =
      "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase;";
    const selectWorldTotalVaccinationQuery =
      "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination;";
    const selectFacilitiesQuery =
      "SELECT Country.location, Facilities.handwashing_facilities, Facilities.hospital_beds_per_thousand FROM Facilities INNER JOIN Country ON Facilities.iso_code = Country.iso_code ORDER BY Country.location;";
    const [
      worldPopulation,
      worldCovid,
      worldVaccination,
      totalCovid,
      totalVaccination,
      facilities,
    ] = await Promise.all([
      query(selectWorldTotalPopulationQuery),
      query(selectWorldCovidQuery),
      query(selectWorldVaccinationQuery),
      query(selectWorldTotalCovidQuery),
      query(selectWorldTotalVaccinationQuery),
      query(selectFacilitiesQuery),
    ]);
    console.log(facilities);
    res.render("index.html", {
      population: worldPopulation[0],
      covid: worldCovid,
      vaccination: worldVaccination,
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
      facilities,
    });
  });

  app.get("/continent", async function (_req, res) {
    const selectContinentQuery = "SELECT id, continent FROM Continent;";
    const continents = await query(selectContinentQuery);

    const selectContinentPopulationQuery =
      "SELECT FORMAT(SUM(population),0) as total_population FROM Population WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
    const selectContinentCovidQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectContinentVaccinationQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectContinentTotalCovidQuery =
      "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
    const selectContinentTotalVaccinationQuery =
      "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
    const [
      continentPopulation,
      continentCovid,
      continentVaccination,
      totalCovid,
      totalVaccination,
    ] = await Promise.all([
      query(selectContinentPopulationQuery, [continents[0].id]),
      query(selectContinentCovidQuery, [continents[0].id]),
      query(selectContinentVaccinationQuery, [continents[0].id]),
      query(selectContinentTotalCovidQuery, [continents[0].id]),
      query(selectContinentTotalVaccinationQuery, [continents[0].id]),
    ]);

    res.render("continent.html", {
      continents,
      population: continentPopulation[0],
      covid: continentCovid,
      vaccination: continentVaccination,
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
    });
  });

  app.get("/country", async function (_req, res) {
    const selectCountryQuery =
      "SELECT iso_code, location FROM Country ORDER BY location;";
    const countries = await query(selectCountryQuery);

    const selectCountryPopulationQuery =
      "SELECT FORMAT(SUM(population),0) as total_population FROM Population WHERE iso_code = ?;";
    const selectCountryCovidQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ? GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectCountryVaccinationQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code = ? GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectCountryTotalCovidQuery =
      "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ?;";
    const selectCountryTotalVaccinationQuery =
      "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code = ?;";
    const selectCountryTestQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date,new_tests, positive_rate FROM Test WHERE iso_code = ? AND DATE_FORMAT(`date`,'%Y-%m')=? ORDER BY date;";
    const selectCountryTestDateListQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date FROM Test WHERE iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m') ORDER BY date;";
    const [
      countryPopulation,
      countryCovid,
      countryVaccination,
      totalCovid,
      totalVaccination,
      test,
      testDateList,
    ] = await Promise.all([
      query(selectCountryPopulationQuery, [countries[0].iso_code]),
      query(selectCountryCovidQuery, [countries[0].iso_code]),
      query(selectCountryVaccinationQuery, [countries[0].iso_code]),
      query(selectCountryTotalCovidQuery, [countries[0].iso_code]),
      query(selectCountryTotalVaccinationQuery, [countries[0].iso_code]),
      query(selectCountryTestQuery, [countries[0].iso_code, "2020-02"]),
      query(selectCountryTestDateListQuery, [countries[0].iso_code]),
    ]);

    res.render("country.html", {
      countries,
      population: countryPopulation[0],
      covid: countryCovid,
      vaccination: countryVaccination,
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
      test,
      testDateList,
    });
  });

  app.get("/api/covid/:type", async function (req, res) {
    let param = req.query;
    let selectCovidQuery;
    let selectTotalCovidQuery;

    switch (req.params.type) {
      case "world":
        if (param.date === "all") {
          selectCovidQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
          selectTotalCovidQuery =
            "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase;";
        } else {
          selectCovidQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
          selectTotalCovidQuery =
            "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=?;";
        }

        break;
      case "continent":
        if (param.date === "all") {
          selectCovidQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
          selectTotalCovidQuery =
            "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
        } else {
          selectCovidQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
          selectTotalCovidQuery =
            "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
        }
        break;

      case "country":
        if (param.date === "all") {
          selectCovidQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ? GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
          selectTotalCovidQuery =
            "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ?;";
        } else {
          selectCovidQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death, stringency_index FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
          selectTotalCovidQuery =
            "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?;";
        }
        break;

      default:
        selectCovidQuery =
          "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
        selectTotalCovidQuery =
          "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase;";
        break;
    }

    if (param.date === "all") delete param["date"];
    const [covid, totalCovid] = await Promise.all([
      query(
        selectCovidQuery,
        Object.values(param).map((value) => value)
      ),
      query(
        selectTotalCovidQuery,
        Object.values(param).map((value) => value)
      ),
    ]);

    res.status(200).json({ covid, totalCovid: totalCovid[0] });
  });

  app.get("/api/vaccination/:type", async function (req, res) {
    const param = req.query;
    let selectVaccinationQuery;
    let selectSumVaccinationQuery;

    switch (req.params.type) {
      case "world":
        if (param.date === "all") {
          selectVaccinationQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
          selectSumVaccinationQuery =
            "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination;";
        } else {
          selectVaccinationQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
          selectSumVaccinationQuery =
            "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=?;";
        }
        break;

      case "continent":
        if (param.date === "all") {
          selectVaccinationQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
          selectSumVaccinationQuery =
            "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
        } else {
          selectVaccinationQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
          selectSumVaccinationQuery =
            "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
        }
        break;

      case "country":
        if (param.date === "all") {
          selectVaccinationQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code = ? GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
          selectSumVaccinationQuery =
            "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code = ?;";
        } else {
          selectVaccinationQuery =
            "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d') ORDER BY date;";
          selectSumVaccinationQuery =
            "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?;";
        }
        break;

      default:
        selectVaccinationQuery =
          "SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
        selectSumVaccinationQuery =
          "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination;";
        break;
    }

    if (param.date === "all") delete param["date"];
    const [vaccination, totalVaccination] = await Promise.all([
      query(
        selectVaccinationQuery,
        Object.values(param).map((value) => value)
      ),
      query(
        selectSumVaccinationQuery,
        Object.values(param).map((value) => value)
      ),
    ]);

    res
      .status(200)
      .json({ vaccination, totalVaccination: totalVaccination[0] });
  });

  app.get("/api/population/:type", async function (req, res) {
    let selectPopulationQuery = "";
    switch (req.params.type) {
      case "continent":
        selectPopulationQuery =
          "SELECT FORMAT(SUM(population),0) as total_population FROM Population WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";
        break;
      case "country":
        selectPopulationQuery =
          "SELECT FORMAT(SUM(population),0) as total_population FROM Population WHERE iso_code=?;";
        break;
      default:
        selectPopulationQuery =
          "SELECT FORMAT(SUM(population),0) as total_population FROM Population;";
        break;
    }

    const population = await query(
      selectPopulationQuery,
      Object.values(req.query).map((value) => value)
    );

    res.status(200).json({ population: population[0] });
  });

  app.get("/api/test/", async function (req, res) {
    const selectCountryTestQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date,new_tests, positive_rate FROM Test WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? ORDER BY date;";

    const test = await query(
      selectCountryTestQuery,
      Object.values(req.query).map((value) => value)
    );

    res.status(200).json({ test });
  });
};

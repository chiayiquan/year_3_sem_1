const util = require("util");
const query = util.promisify(db.query).bind(db);

const sqlQuery = {
  selectWorldCovidVaccinationQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase GROUP BY DATE_FORMAT(`date`,'%Y-%m')), vaccination_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination GROUP BY DATE_FORMAT(`date`,'%Y-%m')) SELECT * FROM covid_query LEFT JOIN vaccination_query USING (date) ORDER BY date;",
  selectWorldCovidVaccinationByMonthQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), vaccination_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')) SELECT * FROM covid_query LEFT JOIN vaccination_query USING (date) ORDER BY date;",
  selectWorldTotalCovidQuery:
    "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase;",
  selectWorldTotalVaccinationQuery:
    "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination;",
  selectWorldTotalCovidByDateQuery:
    "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=?;",
  selectWorldTotalVaccinationByDateQuery:
    "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=?;",

  selectContinentCovidVaccinationQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m')), vaccination_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m')) SELECT * FROM covid_query LEFT JOIN vaccination_query USING (date) ORDER BY date;",
  selectContinentCovidVaccinationByMonthQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), vaccination_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')) SELECT * FROM covid_query LEFT JOIN vaccination_query USING (date) ORDER BY date;",
  selectContinentTotalCovidQuery:
    "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);",
  selectContinentTotalVaccinationQuery:
    "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);",
  selectContinentTotalCovidByDateQuery:
    "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);",
  selectContinentTotalVaccinationByDateQuery:
    "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);",

  selectCountryCovidVaccinationQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m')), vaccination_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m')) SELECT * FROM covid_query LEFT JOIN vaccination_query USING (date) ORDER BY date;",
  selectCountryCovidVaccinationByMonthQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), vaccination_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), stringency_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, stringency_index FROM Stringency WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?) SELECT * FROM covid_query LEFT JOIN vaccination_query USING (date) LEFT JOIN stringency_query USING (date) ORDER BY date;",
  selectCountryTotalCovidQuery:
    "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ?;",
  selectCountryTotalVaccinationQuery:
    "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE iso_code = ?;",
  selectCountryTotalCovidByDateQuery:
    "SELECT FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?;",
  selectCountryTotalVaccinationByDateQuery:
    "SELECT FORMAT(SUM(new_vaccinations_smoothed),0) as total_vaccinations, FORMAT(SUM(new_people_vaccinated_smoothed),0) as total_unique_vaccinated_people FROM Vaccination WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?;",

  selectWorldCovidHospitalizeQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase GROUP BY DATE_FORMAT(`date`,'%Y-%m')), hospitalize_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize GROUP BY DATE_FORMAT(`date`,'%Y-%m')) SELECT * FROM covid_query LEFT JOIN hospitalize_query USING (date) ORDER BY date;",
  selectWorldCovidHospitalizeByDateQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), hospitalize_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE DATE_FORMAT(`date`,'%Y-%m')=? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')) SELECT * FROM covid_query LEFT JOIN hospitalize_query USING (date) ORDER BY date;",
  selectWorldTotalHospitalize:
    "SELECT FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize;",
  selectWorldTotalHospitalizeByDate:
    "SELECT FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE DATE_FORMAT(`date`,'%Y-%m')=?;",

  selectContinentCovidHospitalizeQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m')), hospitalize_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m')) SELECT * FROM covid_query LEFT JOIN hospitalize_query USING (date) ORDER BY date;",
  selectContinentCovidHospitalizeByDateQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')),  hospitalize_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?) GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')) SELECT * FROM covid_query LEFT JOIN hospitalize_query USING (date) ORDER BY date;",
  selectContinentTotalHospitalizeQuery:
    "SELECT FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);",
  selectContinentTotalHospitalizeByDateQuery:
    "SELECT FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE  DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);",

  selectCountryCovidHospitalizeQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m')), hospitalize_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m') as date, FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m')) SELECT * FROM covid_query LEFT JOIN hospitalize_query USING (date) ORDER BY date;",
  selectCountryCovidHospitalizeByMonthQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), hospitalize_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')) SELECT * FROM covid_query LEFT JOIN hospitalize_query USING (date) ORDER BY date;",
  selectCountryTotalHospitalizeQuery:
    "SELECT FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE iso_code = ?;",
  selectCountryTotalHospitalizeByDateQuery:
    "SELECT FORMAT(SUM(icu_patient),0) as total_icu_patient, FORMAT(SUM(hosp_patients),0) as total_hosp_patients FROM Hospitalize WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?;",

  selectCountryCovidTestByDateQuery:
    "WITH covid_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(SUM(new_case),0) as total_case, FORMAT(SUM(new_death),0) as total_death FROM NewCase WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m-%d')), test_query AS (SELECT DATE_FORMAT(`date`,'%Y-%m-%d') as date, FORMAT(new_tests,0) as new_tests,  FORMAT((positive_rate*new_tests),0) as total_positive_tests, positive_rate FROM Test WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ?) SELECT * FROM covid_query LEFT JOIN test_query USING (date) ORDER BY date;",
  selectTotalTestByDateQuery:
    "SELECT FORMAT(SUM(new_tests),0) as total_tests, FORMAT((SUM(positive_rate)*SUM(new_tests)),0) as total_positive_tests FROM Test WHERE DATE_FORMAT(`date`,'%Y-%m')=? AND iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m')",

  selectWorldCovidByPopulation:
    "WITH newCase_query AS (SELECT SUM(new_case) AS total_case, iso_code FROM NewCase GROUP BY iso_code), country_query AS (SELECT iso_code, location FROM Country), population_query AS (SELECT iso_code, population, population_density FROM Population) SELECT country_query.location AS country, FORMAT((newCase_query.total_case/population_query.population),10) AS total_covid_against_population, FORMAT(population,0) AS population, population_query.population_density, FORMAT(total_case,0) as total_case FROM newCase_query LEFT JOIN country_query USING (iso_code) LEFT JOIN population_query USING (iso_code) WHERE (newCase_query.total_case/population_query.population) > 0 ORDER BY (newCase_query.total_case/population_query.population);",
};

module.exports = function (app) {
  app.get("/", async function (_req, res) {
    const selectWorldTotalPopulationQuery =
      "SELECT FORMAT(SUM(population),0) as total_population FROM Population;";

    const [
      worldPopulation,
      covidVaccination,
      totalCovid,
      totalVaccination,
      covidHospitalize,
      totalCovidHospitalize,
      covidByPopulation,
    ] = await Promise.all([
      query(selectWorldTotalPopulationQuery),
      query(sqlQuery.selectWorldCovidVaccinationQuery),
      query(sqlQuery.selectWorldTotalCovidQuery),
      query(sqlQuery.selectWorldTotalVaccinationQuery),
      query(sqlQuery.selectWorldCovidHospitalizeQuery),
      query(sqlQuery.selectWorldTotalHospitalize),
      query(sqlQuery.selectWorldCovidByPopulation),
    ]);

    res.render("index.html", {
      population: worldPopulation[0],
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
      covidVaccination,
      covidHospitalize,
      totalCovidHospitalize: totalCovidHospitalize[0],
      covidByPopulation,
    });
  });

  app.get("/continent", async function (_req, res) {
    const selectContinentQuery = "SELECT id, continent FROM Continent;";
    const continents = await query(selectContinentQuery);

    const selectContinentPopulationQuery =
      "SELECT FORMAT(SUM(population),0) as total_population FROM Population WHERE iso_code IN (SELECT iso_code FROM Country WHERE continent_id=?);";

    const [
      continentPopulation,
      covidVaccination,
      totalCovid,
      totalVaccination,
      covidHospitalize,
      totalCovidHospitalize,
    ] = await Promise.all([
      query(selectContinentPopulationQuery, [continents[0].id]),
      query(sqlQuery.selectContinentCovidVaccinationQuery, [
        continents[0].id,
        continents[0].id,
      ]),
      query(sqlQuery.selectContinentTotalCovidQuery, [continents[0].id]),
      query(sqlQuery.selectContinentTotalVaccinationQuery, [continents[0].id]),
      query(sqlQuery.selectContinentCovidHospitalizeQuery, [
        continents[0].id,
        continents[0].id,
      ]),
      query(sqlQuery.selectContinentTotalHospitalizeQuery, [continents[0].id]),
    ]);

    res.render("continent.html", {
      continents,
      population: continentPopulation[0],
      covidVaccination,
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
      covidHospitalize,
      totalCovidHospitalize: totalCovidHospitalize[0],
    });
  });

  app.get("/country", async function (_req, res) {
    const selectCountryQuery =
      "SELECT iso_code, location FROM Country ORDER BY location;";
    const countries = await query(selectCountryQuery);

    const selectCountryPopulationQuery =
      "SELECT FORMAT((population),0) as total_population, population_density, aged_65_older, FORMAT((aged_65_older*population/100),0) as aged_65_older_population, life_expectancy FROM Population WHERE iso_code = ?;";

    const selectCountryTestDateListQuery =
      "SELECT DATE_FORMAT(`date`,'%Y-%m') as date FROM Test WHERE iso_code = ? GROUP BY DATE_FORMAT(`date`,'%Y-%m') ORDER BY date;";
    const [
      countryPopulation,
      covidVaccination,
      totalCovid,
      totalVaccination,
      covidTest,
      totalTest,
      testDateList,
      covidHospitalize,
      totalCovidHospitalize,
      totalCovidDaily,
    ] = await Promise.all([
      query(selectCountryPopulationQuery, [countries[0].iso_code]),
      query(sqlQuery.selectCountryCovidVaccinationQuery, [
        countries[0].iso_code,
        countries[0].iso_code,
      ]),
      query(sqlQuery.selectCountryTotalCovidQuery, [countries[0].iso_code]),
      query(sqlQuery.selectCountryTotalVaccinationQuery, [
        countries[0].iso_code,
      ]),
      query(sqlQuery.selectCountryCovidTestByDateQuery, [
        "2020-02",
        countries[0].iso_code,
        "2020-02",
        countries[0].iso_code,
      ]),
      query(sqlQuery.selectTotalTestByDateQuery, [
        "2020-02",
        countries[0].iso_code,
      ]),
      query(selectCountryTestDateListQuery, [countries[0].iso_code]),
      query(sqlQuery.selectCountryCovidHospitalizeQuery, [
        countries[0].iso_code,
        countries[0].iso_code,
      ]),
      query(sqlQuery.selectCountryTotalHospitalizeQuery, [
        countries[0].iso_code,
        countries[0].iso_code,
      ]),
      query(sqlQuery.selectCountryTotalCovidByDateQuery, [
        "2020-02",
        countries[0].iso_code,
      ]),
    ]);

    res.render("country.html", {
      countries,
      population: countryPopulation[0],
      covidVaccination,
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
      covidTest,
      totalTest: totalTest[0],
      testDateList,
      covidHospitalize,
      totalCovidHospitalize: totalCovidHospitalize[0],
      totalCovidDaily: totalCovidDaily[0],
    });
  });

  app.get("/api/covidVaccination/:type", async function (req, res) {
    let param = req.query;
    let selectTotalCovidQuery = [];
    let selectTotalVaccinationQuery = [];
    let selectCovidVaccinationQuery = [];

    switch (req.params.type) {
      case "continent":
        if (param.date === "all") {
          selectCovidVaccinationQuery = [
            sqlQuery.selectContinentCovidVaccinationQuery,
            [param.continentId, param.continentId],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectContinentTotalCovidQuery,
            [param.continentId],
          ];
          selectTotalVaccinationQuery = [
            sqlQuery.selectContinentTotalVaccinationQuery,
            [param.continentId],
          ];
        } else {
          selectCovidVaccinationQuery = [
            sqlQuery.selectContinentCovidVaccinationByMonthQuery,
            [param.date, param.continentId, param.date, param.continentId],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectContinentTotalCovidByDateQuery,
            [param.date, param.continentId],
          ];
          selectTotalVaccinationQuery = [
            sqlQuery.selectContinentTotalVaccinationByDateQuery,
            [param.date, param.continentId],
          ];
        }
        break;

      case "country":
        if (param.date === "all") {
          selectCovidVaccinationQuery = [
            sqlQuery.selectCountryCovidVaccinationQuery,
            [param.iso_code, param.iso_code],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectWorldTotalCovidQuery,
            [param.iso_code],
          ];
          selectTotalVaccinationQuery = [
            sqlQuery.selectWorldTotalVaccinationQuery,
            [param.iso_code],
          ];
        } else {
          selectCovidVaccinationQuery = [
            sqlQuery.selectCountryCovidVaccinationByMonthQuery,
            [
              param.date,
              param.iso_code,
              param.date,
              param.iso_code,
              param.date,
              param.iso_code,
            ],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectCountryTotalCovidByDateQuery,
            [param.date, param.iso_code],
          ];
          selectTotalVaccinationQuery = [
            sqlQuery.selectCountryTotalVaccinationByDateQuery,
            [param.date, param.iso_code],
          ];
        }
        break;

      default:
        if (param.date === "all") {
          selectCovidVaccinationQuery = [
            sqlQuery.selectWorldCovidVaccinationQuery,
            [],
          ];
          selectTotalCovidQuery = [sqlQuery.selectWorldTotalCovidQuery, []];
          selectTotalVaccinationQuery = [
            sqlQuery.selectWorldTotalVaccinationQuery,
            [],
          ];
        } else {
          selectCovidVaccinationQuery = [
            sqlQuery.selectWorldCovidVaccinationByMonthQuery,
            [param.date, param.date],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectWorldTotalCovidByDateQuery,
            [param.date],
          ];
          selectTotalVaccinationQuery = [
            sqlQuery.selectWorldTotalVaccinationByDateQuery,
            [param.date],
          ];
        }
        break;
    }

    const [covidVaccination, totalCovid, totalVaccination] = await Promise.all([
      query(...selectCovidVaccinationQuery),
      query(...selectTotalCovidQuery),
      query(...selectTotalVaccinationQuery),
    ]);

    return res.status(200).json({
      covidVaccination,
      totalCovid: totalCovid[0],
      totalVaccination: totalVaccination[0],
    });
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
          "SELECT FORMAT((population),0) as total_population, population_density, aged_65_older, FORMAT((aged_65_older*population/100),0) as aged_65_older_population, life_expectancy FROM Population WHERE iso_code=?;";
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
    let param = req.query;
    const [covidTest, totalTest, totalCovid] = await Promise.all([
      query(sqlQuery.selectCountryCovidTestByDateQuery, [
        param.date,
        param.iso_code,
        param.date,
        param.iso_code,
      ]),
      query(sqlQuery.selectTotalTestByDateQuery, [param.date, param.iso_code]),
      query(sqlQuery.selectCountryTotalCovidByDateQuery, [
        param.date,
        param.iso_code,
      ]),
    ]);

    res
      .status(200)
      .json({ covidTest, totalTest: totalTest[0], totalCovid: totalCovid[0] });
  });

  app.get("/api/hospitalize/:type", async function (req, res) {
    const param = req.query;
    let selectCovidHospitalizeQuery = [];
    let selectTotalCovidQuery = [];
    let selectTotalHospitalizeQuery = [];

    let selectHospitalizeQuery = "";
    // let selectTotalHospitalizeQuery = "";
    switch (req.params.type) {
      case "continent":
        if (param.date === "all") {
          selectCovidHospitalizeQuery = [
            sqlQuery.selectContinentCovidHospitalizeQuery,
            [param.continentId, param.continentId],
          ];
          selectTotalHospitalizeQuery = [
            sqlQuery.selectContinentTotalHospitalizeQuery,
            [param.continentId],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectContinentTotalCovidQuery,
            [param.continentId],
          ];
        } else {
          selectCovidHospitalizeQuery = [
            sqlQuery.selectContinentCovidHospitalizeByDateQuery,
            [param.date, param.continentId, param.date, param.continentId],
          ];
          selectTotalHospitalizeQuery = [
            sqlQuery.selectContinentTotalHospitalizeByDateQuery,
            [param.date, param.continentId],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectContinentTotalCovidByDateQuery,
            [param.date, param.continentId],
          ];
        }
        break;

      case "country":
        if (param.date === "all") {
          selectCovidHospitalizeQuery = [
            sqlQuery.selectCountryCovidHospitalizeQuery,
            [param.iso_code, param.iso_code],
          ];
          selectTotalHospitalizeQuery = [
            sqlQuery.selectCountryTotalHospitalizeQuery,
            [param.iso_code],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectCountryTotalCovidQuery,
            [param.iso_code],
          ];
        } else {
          selectCovidHospitalizeQuery = [
            sqlQuery.selectCountryCovidHospitalizeByMonthQuery,
            [param.date, param.iso_code, param.date, param.iso_code],
          ];
          selectTotalHospitalizeQuery = [
            sqlQuery.selectCountryTotalHospitalizeByDateQuery,
            [param.date, param.iso_code],
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectCountryTotalCovidByDateQuery,
            [param.date, param.iso_code],
          ];
        }
        break;
      default:
        if (param.date === "all") {
          selectCovidHospitalizeQuery = [
            sqlQuery.selectWorldCovidHospitalizeQuery,
            [],
          ];
          selectTotalHospitalizeQuery = [
            sqlQuery.selectWorldTotalHospitalize,
            [],
          ];
          selectTotalCovidQuery = [sqlQuery.selectWorldTotalCovidQuery, []];
        } else {
          selectCovidHospitalizeQuery = [
            sqlQuery.selectWorldCovidHospitalizeByDateQuery,
            [param.date, param.date],
          ];
          selectTotalHospitalizeQuery = [
            sqlQuery.selectWorldTotalHospitalizeByDate,
            param.date,
          ];
          selectTotalCovidQuery = [
            sqlQuery.selectWorldTotalCovidByDateQuery,
            [param.date],
          ];
        }
        break;
    }

    const [covidHospitalize, totalCovidHospitalize, totalCovid] =
      await Promise.all([
        query(...selectCovidHospitalizeQuery),
        query(...selectTotalHospitalizeQuery),
        query(...selectTotalCovidQuery),
      ]);
    return res.status(200).json({
      covidHospitalize,
      totalCovidHospitalize: totalCovidHospitalize[0],
      totalCovid: totalCovid[0],
    });
  });
};

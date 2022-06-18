const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports = function (app) {
  app.get("/", async function (_req, res) {
    const selectWorldTotalPopulation =
      "SELECT SUM(population) as total_population FROM Population;";
    const selectWorldTotalCovid =
      "SELECT CONCAT(YEAR(date),'-', MONTH(date)) as date, SUM(new_case) as total_case, SUM(new_death) as total_death FROM NewCase GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";
    const selectWorldTotalVaccination =
      "SELECT CONCAT(YEAR(date),'-', MONTH(date)) as date, SUM(new_vaccinations_smoothed) as total_vaccinations, SUM(new_people_vaccinated_smoothed) as total_unique_vaccinated_people FROM Vaccination GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date;";

    const selectWorldTotalCovidEntry =
      "SELECT COUNT(*) FROM (SELECT COUNT(id) FROM NewCase GROUP BY CONCAT(YEAR(date),'-', MONTH(date)) ORDER BY date) t;";
    const [
      worldTotalPopulation,
      worldTotalCovid,
      worldTotalVaccination,
      totalCovidEntry,
    ] = await Promise.all([
      query(selectWorldTotalPopulation),
      query(selectWorldTotalCovid),
      query(selectWorldTotalVaccination),
      query(selectWorldTotalCovidEntry),
    ]);
    console.log(totalCovidEntry);
    res.render("index.html", {
      totalPopulation: worldTotalPopulation[0],
      totalCovid: worldTotalCovid,
      totalVaccination: worldTotalVaccination,
    });
  });
};

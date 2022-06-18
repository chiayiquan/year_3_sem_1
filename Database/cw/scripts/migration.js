const mysql = require("mysql");
const connectionConfig = require("../dbconfig");
const util = require("util");
const data = require("fs").readFileSync(
  "./scripts/owid-covid-data.csv",
  "utf8"
);

const connection = mysql.createConnection(connectionConfig);
connection.connect();

const query = util.promisify(connection.query).bind(connection);

// run once to create table
async function createTable() {
  const createContinentTable = `CREATE TABLE IF NOT EXISTS \`Continent\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`continent\` varchar(255)
);`;

  const createCountryTable = `CREATE TABLE IF NOT EXISTS \`Country\` (
  \`iso_code\` varchar(255) PRIMARY KEY,
  \`location\` varchar(255),
  \`continent_id\` int
);`;

  const createCaseTable = `CREATE TABLE IF NOT EXISTS \`NewCase\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`date\` datetime,
  \`new_case\` int,
  \`new_death\` int,
  \`stringency_index\` double,
  \`iso_code\` varchar(255)
);`;

  const createHospitalizeTable = `CREATE TABLE IF NOT EXISTS \`Hospitalize\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`date\` datetime,
  \`icu_patient\` int,
  \`hosp_patients\` int,
  \`weekly_hosp_admissions\` int,
  \`iso_code\` varchar(255)
);`;

  const createTestTable = `CREATE TABLE IF NOT EXISTS \`Test\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`date\` datetime,
  \`new_tests\` int,
  \`positive_rate\` int,
  \`iso_code\` varchar(255)
);`;

  const createVaccinationTable = `CREATE TABLE IF NOT EXISTS \`Vaccination\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`date\` datetime,
  \`new_vaccinations_smoothed\` int,
  \`new_people_vaccinated_smoothed\` int,
  \`iso_code\` varchar(255)
);`;

  const createPopulationTable = `CREATE TABLE IF NOT EXISTS \`Population\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`population\` int,
  \`population_density\` int,
  \`aged_65_older\` double,
  \`life_expectancy\` double,
  \`iso_code\` varchar(255)
);`;

  const createFacilitiesTable = `CREATE TABLE IF NOT EXISTS \`Facilities\` (
  \`id\` int AUTO_INCREMENT PRIMARY KEY,
  \`handwashing_facilities\` double,
  \`hospital_beds_per_thousand\` double,
  \`iso_code\` varchar(255)
);`;

  await Promise.all([
    query(createContinentTable),
    query(createCountryTable),
    query(createCaseTable),
    query(createHospitalizeTable),
    query(createTestTable),
    query(createVaccinationTable),
    query(createPopulationTable),
    query(createFacilitiesTable),
  ]);

  console.log("Tables Created");

  const addFKToCountry =
    "ALTER TABLE `Country` ADD FOREIGN KEY (`continent_id`) REFERENCES `Continent` (`id`);";
  const addFKToCase =
    "ALTER TABLE `NewCase` ADD FOREIGN KEY (`iso_code`) REFERENCES `Country` (`iso_code`);";
  const addFKToHospitalize =
    "ALTER TABLE `Hospitalize` ADD FOREIGN KEY (`iso_code`) REFERENCES `Country` (`iso_code`);";
  const addFKToTest =
    "ALTER TABLE `Test` ADD FOREIGN KEY (`iso_code`) REFERENCES `Country` (`iso_code`);";
  const addFKToVaccination =
    "ALTER TABLE `Vaccination` ADD FOREIGN KEY (`iso_code`) REFERENCES `Country` (`iso_code`);";
  const addFKToPopulation =
    "ALTER TABLE `Population` ADD FOREIGN KEY (`iso_code`) REFERENCES `Country` (`iso_code`);";
  const addFKToFacilities =
    "ALTER TABLE `Facilities` ADD FOREIGN KEY (`iso_code`) REFERENCES `Country` (`iso_code`);";

  await Promise.all([
    query(addFKToCountry),
    query(addFKToCase),
    query(addFKToHospitalize),
    query(addFKToTest),
    query(addFKToVaccination),
    query(addFKToPopulation),
    query(addFKToFacilities),
  ]);

  return console.log("Foreign Key Added");
}

async function deleteTable() {
  const selectTableQuery =
    "SELECT table_name FROM information_schema.tables WHERE table_schema ='Covid';";
  const results = await query(selectTableQuery);

  await Promise.all([
    results.forEach((table) => {
      if (
        table["TABLE_NAME"] === "country" ||
        table["TABLE_NAME"] === "continent"
      )
        return;
      query(`DROP TABLE IF EXISTS ${table["TABLE_NAME"]}`);
    }),
  ]);
  await query("DROP TABLE IF EXISTS Country");
  await query("DROP TABLE IF EXISTS Continent");
  return console.log("Tables Deleted");
}
async function run() {
  await deleteTable();
  await createTable();

  const continents = new Set();
  let countryData = {};
  const caseData = [];
  const hospitalizeData = [];
  const testData = [];
  const vaccinationData = [];
  let populationData = {};
  let facilitiesData = {};

  data.split("\n").forEach((entry, index) => {
    // ignore header row and last row
    if (index === 0) return;
    const entryColumn = entry.split(",");

    // skip empty data
    if (entryColumn[0].length === 0) return;

    // skip all the contient data
    if (entryColumn[0].includes("OWID_")) return;

    continents.add(entryColumn[1]);

    countryData[entryColumn[0]] = [
      entryColumn[0],
      entryColumn[2],
      entryColumn[1],
    ];

    caseData.push([
      new Date(entryColumn[3]),
      parseInt(entryColumn[5]) || 0,
      parseInt(entryColumn[8]) || 0,
      parseFloat(entryColumn[47]) || 0,
      entryColumn[0],
    ]);
    hospitalizeData.push([
      new Date(entryColumn[3]),
      parseInt(entryColumn[17]) || 0,
      parseInt(entryColumn[19]) || 0,
      parseInt(entryColumn[23]) || 0,
      entryColumn[0],
    ]);
    testData.push([
      new Date(entryColumn[3]),
      parseInt(entryColumn[26]) || 0,
      parseInt(entryColumn[32]) || 0,
      entryColumn[0],
    ]);
    vaccinationData.push([
      new Date(entryColumn[3]),
      parseInt(entryColumn[39]) || 0,
      parseInt(entryColumn[45]) || 0,
      entryColumn[0],
    ]);

    populationData[entryColumn[0]] = [
      parseInt(entryColumn[48]) || 0,
      parseInt(entryColumn[49]) || 0,
      parseFloat(entryColumn[51]) || 0,
      parseFloat(entryColumn[61]) || 0,
      entryColumn[0],
    ];

    facilitiesData[entryColumn[0]] = [
      parseFloat(entryColumn[59]) || 0,
      parseFloat(entryColumn[60]) || 0,
      entryColumn[0],
    ];
  });

  const continentsArr = Array.from(continents).map((continent) => [continent]);

  const continentInsertQuery = "INSERT INTO Continent(continent) VALUES ?";

  await query(continentInsertQuery, [continentsArr]);

  const continentIdArr = await query("SELECT * FROM Continent");
  const continentObject = continentIdArr.reduce((accumulator, currentValue) => {
    accumulator[currentValue.continent] = currentValue.id;
    return accumulator;
  }, {});

  const countryInsertQuery =
    "INSERT INTO Country(iso_code, location, continent_id) VALUES ?";

  const countryDataWithoutKey = Object.keys(countryData).map((key) => {
    countryData[key][2] = continentObject[countryData[key][2]];
    return countryData[key];
  });

  // insert all country first because of foreign key used in other table
  await query(countryInsertQuery, [countryDataWithoutKey]);
  console.log("Country inserted");

  const caseInsertQuery =
    "INSERT INTO NewCase(date, new_case, new_death, stringency_index, iso_code) VALUES ?";
  const hospitalizeInsertQuery =
    "INSERT INTO Hospitalize(date, icu_patient, hosp_patients, weekly_hosp_admissions, iso_code) VALUES ?";
  const testInsertQuery =
    "INSERT INTO Test(date, new_tests, positive_rate, iso_code) VALUES ?";
  const vaccinationInsertQuery =
    "INSERT INTO Vaccination(date, new_vaccinations_smoothed, new_people_vaccinated_smoothed, iso_code) VALUES ?";
  const populationInsertQuery =
    "INSERT INTO Population(population, population_density, aged_65_older, life_expectancy, iso_code) VALUES ?";
  const facilitiesInsertQuery =
    "INSERT INTO Facilities(handwashing_facilities, hospital_beds_per_thousand, iso_code) VALUES ?";

  const populationDataWithoutKey = Object.keys(populationData).map(
    (key) => populationData[key]
  );

  const facilitiesDataWithoutKey = Object.keys(facilitiesData).map(
    (key) => facilitiesData[key]
  );

  await Promise.all([
    query(caseInsertQuery, [caseData]),
    query(hospitalizeInsertQuery, [hospitalizeData]),
    query(testInsertQuery, [testData]),
    query(vaccinationInsertQuery, [vaccinationData]),
    query(populationInsertQuery, [populationDataWithoutKey]),
    query(facilitiesInsertQuery, [facilitiesDataWithoutKey]),
  ]);

  // iso_code[0], location[2], cotinent[1] -> Country table
  // date[3],  new_case[5], new_death[8], stringency_index[47], iso_code[0] -> Cases table
  // date[3], icu_patient[17], hosp_patients[19], weekly_hosp_admissions[23], country pk -> Hospitalize table
  // date[3], new_tests[26], positive_rate[32], country pk -> Test table
  // date[3], new_vaccinations_smoothed[39], new_people_vaccinated_smoothed[45],total_boosters[37], country pk -> Vaccinated Table
  // population[48], population_density[49], aged_65_older[51], life_expectancy[61], country pk -> Population Table
  // handwashing_facilities[59], hospital_beds_per_thousand[60], country pk-> Facilities Table
  return connection.end();
}

run();

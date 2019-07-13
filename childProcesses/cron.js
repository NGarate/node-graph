const cron = require("node-cron");
const { dirname } = require("path");
const log = require("debug")("updateCities");
const { fork } = require("child_process");

cron.schedule("30 1 1 * *", () => startUpdateCities());

const updateCities = startUpdateCities();

updateCities.stdout.on("data", data => log(`stdout: ${data}`));
updateCities.stderr.on("data", data => log(`stderr: ${data}`));
updateCities.on("close", code => log(`Exited with code: ${code}`));

function startUpdateCities() {
    const MODULE = "./updateCities";
    const updateCitiesPath = dirname(require.resolve(MODULE));
    return fork(MODULE, null, { cwd: updateCitiesPath });
}

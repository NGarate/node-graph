const fs = require("fs");
const path = require("path");
const util = require("util");
const { convert } = require("../utils/tsvToJson");

const lstat = util.promisify(fs.lstat);

const inputFile = path.join(__dirname, "..", process.argv[2]);
const outputFile = path.join(__dirname, "..", process.argv[3]);

const convertFile = async () => {
    try {
        await convert(inputFile, outputFile);
    } catch (e) {
        console.error(e);
    }
};

async function checkArgsAndConvert() {
    const stat = await lstat(inputFile);
    if (!stat.isFile()) {
        throw new Error("First argument must be a existing file path");
    }
    convertFile(inputFile, outputFile);
}

checkArgsAndConvert();

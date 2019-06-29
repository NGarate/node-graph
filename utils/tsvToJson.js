const csv = require("csvtojson");
const fs = require("fs");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);

exports.convert = async (inputPath, outputPath) => {
    await writeFile(outputPath, "", "utf8");

    const readStream = fs.createReadStream(inputPath, "utf8");
    const writeStream = fs.createWriteStream(outputPath, "utf8");

    const parser = csv({
        delimiter: "\t",
        quote: "off"
    });

    // csv({
    //     delimiter: "\t",
    //     quote: "off"
    // })
    //     .fromStream()
    //     .subscribe(
    //         json => {
    //             return new Promise((resolve, reject) => {
    //                 // TODO save on MongoDB
    //             });
    //         },
    //         onError,
    //         onComplete
    //     );

    readStream.pipe(parser).pipe(writeStream);
};

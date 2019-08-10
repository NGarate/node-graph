const { City } = require("../utils/mongoose");

exports.setDeletedFalse = function(json, log) {
    try {
        return City.findOneAndUpdate(
            { geonameid: json.field1 },
            { geonameid: json.field1, deleted: false },
            {
                upsert: false,
                new: false,
                runValidators: false,
                lean: true,
                projection: { _id: 0 }
            }
        ).exec();
    } catch (error) {
        log(error);
    }
};

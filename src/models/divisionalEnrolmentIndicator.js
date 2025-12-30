const mongoose = require("mongoose")
const Schema = mongoose.Schema

const divisionalEnrolmentIndicatorsSchema = new Schema({
    division: {
        type: String,
        required: true
    },
    codes: [{
        code: String,
        name: String
    }]
});

const DivisionalEnrolmentIndicator = mongoose.model("DivisionalEnrolmentIndicator", divisionalEnrolmentIndicatorsSchema);

module.exports = DivisionalEnrolmentIndicator
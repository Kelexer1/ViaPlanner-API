const mongoose = require("mongoose")
const Schema = mongoose.Schema

const divisionalLegendsSchema = new Schema({
    division: {
        type: String,
        required: true
    },
    content: String
});

const DivisionalLegend = mongoose.model("DivisionalLegend", divisionalLegendsSchema);

module.exports = DivisionalLegend
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const divisionSchema = new Schema({
    label: String,
    value: String
})

const Division = mongoose.model("Division", divisionSchema)

module.exports = Division
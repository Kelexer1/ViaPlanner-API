const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sessionGroupSchema = new Schema({
    group: String,
    label: String,
    value: String,
    subsessions: [{
        label: String,
        value: String
    }]
})

const SessionGroup = mongoose.model("SessionGroup", sessionGroupSchema)

module.exports = SessionGroup
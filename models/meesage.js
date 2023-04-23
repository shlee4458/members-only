const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime } = require("luxon")

const MessageSchema = new Schema({
    username: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minLength: 10, maxLength: 150 },
    text: { type: String, require: true, minLength: 10, maxLength: 1000 },
    timestamp: { type: Date, default: Date.now() }
});

MessageSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("Message", MessageSchema)
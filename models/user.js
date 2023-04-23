const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, minLength: 10},
    member: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
});

UserSchema.virtual("name").get(function () {
    let fullname = ""

    if (this.first_name & this.last_name) {
        fullname = `${this.first_name}, ${this.last_name}`;
    }
    return fullname
})

module.exports = mongoose.model("User", UserSchema);
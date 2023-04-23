const Message = require("../models/meesage")
const User = require("../models/user")
const { body, validationResult } = require("express-validator")

exports.index = (req, res, next) => {
    res.render("indexfake",{})
}
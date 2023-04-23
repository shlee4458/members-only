const Message = require("../models/message")
const User = require("../models/user")
const { body, validationResult } = require("express-validator")

exports.index = async (req, res, next) => {
    try {
        const messages = await Message.find().sort([["timestamp", "descending"]]).populate("user")
        return res.render("index", { title: "The Jojo club", user: req.user, messages: messages })
    } catch (err) {
        return next(err);
    }
}
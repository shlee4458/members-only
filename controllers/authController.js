const Message = require("../models/message");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const user = require("../models/user");
const passport = require("passport");

// signup 
exports.signup_get = (req, res, next) => {
    res.render("signup_form", { title: "Sign up" })
}

exports.signup_post = [

    // sanitize and validate
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be at leat 6 characters"),

    body("password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Password must be at leat 6 characters"),

    body("confirmPassword")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Password must be at least 6 characters.")
        .custom(async (value, { req }) => {
            // Use the custom method w/ a CB func to ensure that both passwords match, return an error if so
            if (value !== req.body.password) throw new Error('Passwords must be the same');
            return true;
        }),
    
    // validate for the error
    asyncHandler(async (req, res, next) => {
        // extract error
        const errors = validationResult(req);
        
        // if errors - render the form with error
        if (!errors.isEmpty()) {
            return res.render("signup_form", {title: "Sign Up", passwordConfirmationError: "Password must be the same"})
        };

        // check if there already exists a username
        const isUserInDB = await User.find({username: req.body.username})
        if (isUserInDB.length > 0) { 
            return res.render("signup_form", {title: "Sing up", error: "User already exists"})
        };

        // Create a instance of a user
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) return next(err);
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
                member: false,
                admin: false
            }).save()
        });

        res.redirect('/')
    })
]

// login
exports.login_get = (req, res, next) => {
    // if the user is already logged in, return the homepage
    if (res.locals.currentUser) return res.redirect('/')
    res.render("login_form", {title: "Login"})
}

exports.login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
})

// logout
exports.logout_get = (req, res, next) => {
    res.send("Not Implemented yet")
}
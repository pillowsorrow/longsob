const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const config = process.env;

exports.ValidateLoggedin = (req, res, next) => {

    if (!req.session.isLoggedIn) {

    } else {

      req.session.nowInMinutes = Math.floor(Date.now() / 60e1); //3 hours
    }
    next();
  };

  exports.ifLoggedin = (req, res, next) => {

    if (req.session.isLoggedIn) {
      return res.redirect("/");
    }

    next();
  };

  exports.ifnotLoggedin = (req, res, next) => {

    if (!req.session.isLoggedIn) {
      return res.redirect("/");
    }
    next();
  };
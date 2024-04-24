const config = process.env;
const express = require("express");
const unirest = require('unirest');
const dayjs = require("dayjs");
const Recaptcha = require('express-recaptcha').RecaptchaV3
const {
  ifLoggedin
} = require("../middleware/auth");
const {
  sendemail
} = require("../middleware/mail");
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = process.env.PATH_SOURCE;
let PAGE;

const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, {
  hl: 'th',
  action: 'signup',
  callback: 'cb'
})

router.use(async function (req, res, next) {
  const page = req.baseUrl.split('/');
  ORIGINAL_SOURCE = config.PATH_SOURCE + '/' + page[1];
  PAGE = page[1];

  next();
});

router.post("/new", recaptcha.middleware.verify, async (req, res) => {
  //if (!req.recaptcha.error) {
  if (true) {
    let {
      user_type,
      username,
      password,
      //citizen_id,
      gender,
      firstname,
      middlename,
      lastname,
      pos_name,
      email,
      mobile,
      workplace,
      province_id,
      district_id,
      subdistrict_id,
      department,
      id_card_type,
      title_id_card,
      birthday,
      affiliation,
      school_org_id
    } = req.body;

    let bypass = 1;
    if (process.env.EMAIL_VALIDATE == 'true') {
      bypass = 0;
    }

    //fake ID Card
    let citizen_id = new Date().getTime();
    citizen_id = citizen_id + getRandomInt(3);

    birthday = null;
    if (birthday) {
      //let myArraybirthday = birthday.split("-");
      //birthday = (myArraybirthday[2] - 543) + '-' + myArraybirthday[1] + '-' + myArraybirthday[0];
      if (!dayjs(birthday).isValid()) {
        birthday = dayjs().format('YYYY-MM-DD');
      }
    }
    if (username !== undefined && username !== null) {
      username = username.replace(/^(?![เแโไใ])([ะ-๙])(.*)/, '$2'); //กรองภาษาไทย
      username = username.trim();

      if (middlename == '-') {
        middlename = null;
      }

      let data = {
        'user_type': user_type,
        'username': username,
        'password': password,
        'citizen_id': citizen_id,
        'gender': gender,
        'firstname': firstname,
        'middlename': middlename,
        'lastname': lastname,
        'pos_name': '',
        'email': email,
        'mobile': mobile,
        'workplace': workplace,
        'province_id': province_id,
        'district_id': district_id,
        'subdistrict_id': subdistrict_id,
        'department_id': 3,
        'birthday': birthday,
        'affiliation': '',
        'id_card_type': 0,
        'org_id': 0,
        'bypass': bypass
      }

      let to_mail = firstname + ' ' + middlename + ' ' + lastname + ' ' + '<' + email + '>';

      //login
      await unirest('POST', config.API + 'auth/login')
        .headers({
          'Content-Type': 'application/json'
        })
        .send(JSON.stringify({
          "name": PAGE
        }))
        .then(async function (result) {
          // if (result.error) {
          //   res.redirect(ORIGINAL_SOURCE + "/register");
          //   return;
          // } else {
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
              res.redirect(ORIGINAL_SOURCE + "/register");
              return;
            } else {

              await unirest('POST', config.API + 'register/new')
                .headers({
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + result.body.access_token
                })
                .send(JSON.stringify({
                  "name": PAGE,
                  "body": data
                }))
                .end(async function (result2) {
                  if (result2.body.result == 1) {
                    res.redirect(ORIGINAL_SOURCE + "/register/error-username");
                  } else if (result2.body.result == 2) {
                    res.redirect(ORIGINAL_SOURCE + "/register/error-idcard");
                  } else if (result2.body.result == 3) {
                    res.redirect(ORIGINAL_SOURCE + "/register/error-password");
                  } else if (result2.body.result == 4) {
                    res.redirect(ORIGINAL_SOURCE + "/register/error-database");
                  } else {
                    if (process.env.EMAIL_VALIDATE == 'true') {
                      let actvie_url = ORIGINAL_SOURCE + '/register/activate/' + result2.body.activate;
                      const mailOptions = {
                        from: config.EMAIL_SENDER,
                        to: to_mail,
                        subject: 'ยินดีต้อนรับสู่ระบบ ต้านทุจริตศึกษา Anti-corruption Education',
                        template: 'register',
                        context: {
                          name: to_mail,
                          url: actvie_url
                        }
                        // attachments: [
                        //   { filename: 'abc.jpg', path: path.resolve(__dirname, './image/abc.jpg')}
                        // ]
                      };

                      const promises = [];

                      promises.push(sendemail(mailOptions));

                      await Promise.all(promises).then(async (results) => {
                        res.redirect(ORIGINAL_SOURCE + "/register/successful");
                      });
                    } else {
                      res.render("pages/register-successful", {
                        title: req.i18n_texts.register_txt,
                        isLoggedIn: req.session.isLoggedIn,
                        isAdmin: req.session.role || 2,
                        breadcrumbs: [{
                          label: req.i18n_texts.register_txt,
                          url: "#",
                        }, ]
                      });
                    }
                  }
                });

            }
          //}
        })
        .catch(err => {
          console.error(err);
          res.redirect(ORIGINAL_SOURCE + "/register/error-database");
        })
    } else {
      res.redirect(ORIGINAL_SOURCE + "/register/error-username");
    }
  } else {
    //console.log(req.recaptcha.error);
    res.redirect(ORIGINAL_SOURCE + "/register/error-captcha");
  }
});
router.get(["/error-username", "/error-idcard", "/error-captcha", "/error-password", "/error-database"], recaptcha.middleware.render, async (req, res) => {

  let error_message;
  if (req.url == "/error-idcard") {
    error_message = req.i18n_texts.id_card_activated;
  } else if (req.url == "/error-captcha") {
    error_message = req.i18n_texts.error_captcha;
  } else if (req.url == "/error-password") {
    error_message = req.i18n_texts.error_password;
  } else if (req.url == "/error-database") {
    error_message = req.i18n_texts.error_database;
  } else {
    error_message = req.i18n_texts.email_already_exists
  }
  //res.setHeader("Cache-Control", "public, max-age=86400");
  res.render("pages/register", {
    title: req.i18n_texts.register_txt,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    department_page: global.department,
    breadcrumbs: [{
      label: req.i18n_texts.register_txt,
      url: "#",
    }, ],
    error: true,
    error_message: error_message,
    captcha: res.recaptcha
  });
});

router.get("/successful", async (req, res) => {

  //res.setHeader("Cache-Control", "public, max-age=86400");
  res.render("pages/register-successful", {
    title: req.i18n_texts.register_txt,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.register_txt,
      url: "#",
    }, ]
  });
});

router.get("/activate/:activateId", async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");
  let activateId = req.params.activateId;

  await unirest('POST', config.API + 'auth/login')
    .headers({
      'Content-Type': 'application/json'
    })
    .send(JSON.stringify({
      "name": PAGE
    }))
    .end(async function (result) {
      if (result.error) {
        res.redirect(ORIGINAL_SOURCE + "/");
      } else {


        await unirest('POST', config.API + 'register/activate')
          .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + result.body.access_token
          })
          .send(JSON.stringify({
            "name": PAGE,
            "activateId": activateId
          }))
          .end(async function (result2) {

            res.render("pages/register-activate", {
              title: req.i18n_texts.register_txt,
              isLoggedIn: req.session.isLoggedIn,
              isAdmin: req.session.role || 2,
              breadcrumbs: [{
                label: req.i18n_texts.register_txt,
                url: "../pdpa",
              }, {
                label: req.i18n_texts.activate,
                url: "#",
              }, ],
              error: result2.body.result
            });
          });

      }
    });
});

router.post("/", [ifLoggedin, recaptcha.middleware.render], async (req, res) => {

  //res.setHeader("Cache-Control", "public, max-age=86400");
  res.render("pages/register", {
    title: req.i18n_texts.register_txt,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    department_page: global.department,
    breadcrumbs: [{
      label: req.i18n_texts.register_txt,
      url: "#",
    }, ],
    error: false,
    captcha: res.recaptcha
  });
});

router.get("/", ifLoggedin, async (req, res) => {

  res.redirect(ORIGINAL_SOURCE + "/pdpa");
});

module.exports = router;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
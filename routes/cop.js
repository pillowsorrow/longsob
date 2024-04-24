const config = process.env;
const express = require("express");
const bodyParser = require("body-parser");
const unirest = require('unirest');
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;
router.use(async function (req, res, next) {
  if (global.department == 0) {
    res.redirect(process.env.HOME_PAGE);
  } else {
  const page = req.originalUrl.split('/');
  ORIGINAL_SOURCE = process.env.PATH_SOURCE +'/'+ page[1];

  //login
  await unirest('POST', config.API + 'auth/login')
    .headers({
      'Content-Type': 'application/json'
    })
    .send(JSON.stringify({
      "name": global.this_page
    }))
    .then(async function (result) {
      access_token = result.body.access_token;
      next();
    });
  }
});

router.get(["/", "/live", "/live/:id([0-9]{0,11})"], async (req, res) => {
  let cat_id = +req.params.id || 0;
  //console.log(req.session);
  await unirest('POST', config.API + 'live/home')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  })
  .send(JSON.stringify({
    "lang": req.i18n_lang,
    "department": global.department,
    "useragent": req.useragent,
    "category": cat_id,
    "type": 1
  }))
  .end(async function (result) {

    let data = result.body.data;
    let sidebar_data = result.body.sidebar_data;

    res.render("pages/live", {
        title: req.i18n_texts.title_live,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        datas: data,
        sidebar_datas: sidebar_data,
        sidebar_href: 'live',
        title_page: result.body.title_page,
        total: result.body.total,
        breadcrumbs: [
          {
            label: req.i18n_texts.menu_text_cop,
            url: ORIGINAL_SOURCE+"/cop/live",
          },
          {
            label: req.i18n_texts.title_live,
            url: "#",
          },
        ]
      });
    });
});

router.get(["/meeting", "/meeting/:id([0-9]{0,11})"], async (req, res) => {

  let cat_id = +req.params.id || 0;

  await unirest('POST', config.API + 'live/home')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  })
  .send(JSON.stringify({
    "lang": req.i18n_lang,
    "department": global.department,
    "useragent": req.useragent,
    "category": cat_id,
    "type": 2
  }))
  .end(async function (result) {

    let data = result.body.data;
    let sidebar_data = result.body.sidebar_data;

    res.render("pages/live", {
        title: req.i18n_texts.menu_text_meeting,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        datas: data,
        sidebar_datas: sidebar_data,
        sidebar_href: 'meeting',
        title_page: result.body.title_page,
        total: result.body.total,
        breadcrumbs: [
          {
            label: req.i18n_texts.menu_text_cop,
            url: ORIGINAL_SOURCE+"/cop/meeting",
          },
          {
            label: req.i18n_texts.menu_text_meeting,
            url: "#",
          },
        ]
      });
    });

});

module.exports = router;
const config = process.env;
const express = require("express");
const unirest = require('unirest');
const Recaptcha = require('express-recaptcha').RecaptchaV3
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;
let profileID;
let PAGE;

const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, { hl: 'th', action: 'survey' , callback: 'cb' })

router.use(async function (req, res, next) {
    profileID = req.session.userID || 0;

    //const page = req.url.split('/');
    const page = req.originalUrl.split('/');
    ORIGINAL_SOURCE = process.env.PATH_SOURCE + '/' + page[1];
    PAGE = page[1];
    let assessment = page[3] || 'not_assessment';
    if (profileID == 0) {

        if(assessment == 'not_assessment'){
            res.redirect(ORIGINAL_SOURCE);
        }else{

            //login assessment page
            await unirest('POST', config.API + 'auth/login')
                .headers({
                    'Content-Type': 'application/json'
                })
                .send(JSON.stringify({
                    "name": PAGE
                }))
                .then(async function (result) {
                    access_token = result.body.access_token;
                    next();
                });

        }
    } else {

        //login
        await unirest('POST', config.API + 'auth/login')
            .headers({
                'Content-Type': 'application/json'
            })
            .send(JSON.stringify({
                "name": PAGE
            }))
            .then(async function (result) {
                access_token = result.body.access_token;
                next();
            });
    }
});

router.get(["/:id([0-9]{0,11})","/:cid([0-9]{0,11})/:id([0-9]{0,11})/:score([0-9]{0,11})"], async (req, res) => {
    const {
        lang,
        profileID
    } = req.body;

    const score_id = +req.params.score || 0;
    const courseID = +req.params.cid || 0;
    const pageID = +req.params.id;

    await unirest('POST', config.API + 'survey/posttest')
        .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
            "lang": 'th', //req.i18n_lang,
            "name": PAGE,
            "profileID": profileID,
            "pageID": pageID,
            "useragent": req.useragent
        }))
        .end(async function (result) {
            let survey = []
            for (const [key, value] of Object.entries(result.body.survey)) {
                survey.push({
                    id: value.id || null, 
                    title: value.title || null, 
                    type: value.type || null,
                    choice: value.choice || null, 
                });
            }

            let data = {
                subject_title: result.body.data[0].title || null,
                surveys: survey,
                pageID: pageID
            }
            res.render("subject/survey", {
                title: req.i18n_texts.title_home,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                isForm: 'true',
                data: data,
                score_id: score_id,
                courseID: courseID,
                captcha: ''
            });

        });

});


router.post("/:id([0-9]{0,11})/savesurvey", recaptcha.middleware.verify, async (req, res) => {
    //console.log(req.body)
    var survey_response = [];
    for (var k in req.body) {
        let response_result = '';
        if(k.indexOf("][") >= 0){
            let response_array = k.split("][");
            response_result = response_array[0] + ']';
        }else{
            response_result = k;
        }
        var m = response_result.match(/response\[(\d+)\]/);
        if (m !== null && m.length > 1) {
            survey_response.push({ [m[1]]: req.body[k] });

        }
    }

    const mergedData = survey_response.reduce((acc, obj) => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
      
        if (acc.hasOwnProperty(key)) {
          if (Array.isArray(acc[key])) {
            acc[key].push(value);
          } else {
            acc[key] = [acc[key], value];
          }
        } else {
          acc[key] = value;
        }
      
        return acc;
      }, {});

      const pageID = +req.params.id;
      const score_id = req.body.score_id || 0;
      const courseID = req.body.courseID || 0;

      if(score_id == 'page'){

        if (!req.recaptcha.error) {
            await unirest('POST', config.API + 'survey/save2')
                .headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                })
                .send(JSON.stringify({
                "lang": 'th', //req.i18n_lang,
                    "name": PAGE,
                    "profileID": profileID,
                    "pageID": pageID,
                    "useragent": req.useragent,
                    "survey_response": mergedData
                }))
                .end(async function (result) {
    
                let data = {
                    subject_title: result.body.data[0].title || null,
                    pageID: pageID,
                    subject_id: result.body.data[0].subject_id || null,
                }
    
                res.render("subject/survey", {
                    title: req.i18n_texts.title_home,
                    isLoggedIn: req.session.isLoggedIn,
                    isAdmin: req.session.role || 2,
                    isForm: 'false',
                    score_id: score_id,
                    courseID: 0,
                    data: data,
                    captcha: '',
                    survey: 'form'
                });
                });
        }else{
            //console.log('error',req.recaptcha.error);
            res.redirect(ORIGINAL_SOURCE);
        }
      }else{

      await unirest('POST', config.API + 'survey/save')
          .headers({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + access_token
          })
          .send(JSON.stringify({
            "lang": 'th', //req.i18n_lang,
              "name": PAGE,
              "profileID": profileID,
              "pageID": pageID,
              "useragent": req.useragent,
              "survey_response": mergedData
          }))
          .end(async function (result) {

            let data = {
                subject_title: result.body.data[0].title || null,
                pageID: pageID,
                subject_id: result.body.data[0].subject_id || null,
            }

            res.render("subject/survey", {
                title: req.i18n_texts.title_home,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                isForm: 'false',
                score_id: score_id,
                courseID: courseID,
                data: data,
                captcha: ''
            });
          });
        }
});

router.get("/assessment/:id([0-9]{0,11})",recaptcha.middleware.render,  async (req, res) => {

        const profileID =  req.body.profileID || 0;
        const pageID = +req.params.id;

        await unirest('POST', config.API + 'survey/page')
            .headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            })
            .send(JSON.stringify({
                "lang": 'th', //req.i18n_lang,
                "name": PAGE,
                "profileID": profileID,
                "pageID": pageID,
                "useragent": req.useragent
            }))
            .end(async function (result) {

                let survey = []
                for (const [key, value] of Object.entries(result.body.survey)) {
                    survey.push({
                        id: value.id || null, 
                        title: value.title || null, 
                        type: value.type || null,
                        choice: value.choice || null, 
                    });
                }

                let data = {
                    subject_title: result.body.data[0].title || null,
                    surveys: survey,
                    pageID: pageID
                }
                res.render("subject/survey", {
                    title: req.i18n_texts.title_home,
                    isLoggedIn: req.session.isLoggedIn,
                    isAdmin: req.session.role || 2,
                    isForm: 'true',
                    data: data,
                    score_id: 'page',
                    courseID: 0,
                    captcha: res.recaptcha,
                    survey: 'form'
                });

            });
});
module.exports = router;

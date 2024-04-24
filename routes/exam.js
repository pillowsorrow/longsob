const config = process.env;
const express = require("express");
const unirest = require('unirest');
const bodyParser = require("body-parser");
const {
  validate_path,
  seo_url
} = require("../middleware/path_validate");
const useragent = require('express-useragent');
const validUrl = require('valid-url');
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;
let profileID;
let PAGE;

router.use(async function (req, res, next) {
  profileID = req.session.userID || 0;

  req.i18n_lang = 'th';
  //const page = req.url.split('/');
  const page = req.originalUrl.split('/');
  ORIGINAL_SOURCE = process.env.PATH_SOURCE + '/' + page[1];
  PAGE = page[1];

  if (profileID == 0) {

    res.redirect(ORIGINAL_SOURCE);
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
      })
      .catch(err => {
        console.error(err);
        res.redirect(ORIGINAL_SOURCE);
      })
  }
});

router.get(["/:pre_post_test/:cid([0-9]{0,11})/:id([0-9]{0,11})/:text"], async (req, res , next) => {
  const {
    lang
  } = req.body;

  const pageID = +req.params.id;
  let courseID = +req.params.cid || 0;
  let type_test = req.params.pre_post_test

  if(type_test == 'exercise'){
    type_test = 'exercise'
  }else if(type_test == 'chapter'){
    type_test = 'chapter'
  }else if((type_test != 'pretest') && (type_test != 'posttest') ){
    res.redirect(ORIGINAL_SOURCE);
  } 

  await unirest('POST', config.API + 'exam/' + type_test)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": 'th', //req.i18n_lang,
      "name": PAGE,
      "profileID": profileID,
      "pageID": pageID,
      "courseID": courseID,
      "useragent": req.useragent,
      "type_test": type_test
    }))
    .end(async function (result) {

      let data = {
        subject_title: result.body.title || null,
        exams: result.body.data || null,
        exam_id: result.body.exam_id || null,
        question_original: result.body.exam_data,
        exam_status: result.body.exam_status,
        pageID: result.body.pageID,
        courseID: courseID,
        timer: result.body.timer
      };

      res.render("subject/exam", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        type_test: type_test,
        data: data
      });
    });

});

router.post("/:cid([0-9]{0,11})/:id([0-9]{0,11})/savescore", async (req, res) => {
  const {
    answer,
    exam_id,
    score_id,
    exam_type
  } = req.body;
  const pageID = +req.params.id;
  let courseID = +req.params.cid || 0;

  const answers = req.body; // ไม่ต้องใช้ req.body.answer เพราะ radio input มาทั้งหมดใน req.body
  let array_answers = {};

  for (const key in answers) {
    if (key.startsWith('answer[')) {
      // const questionId = key.match(/\[(\d+)\]/)[1]; // หาตัวเลขระหว่าง [ และ ]
      // const value = answers[key];
      // array_answers[questionId] = value;
      const match = key.match(/\[(\d+)\](?:\[(\d+)\])?/);
    if (match) {
      const questionId = match[1];
      const index = match[2];
      const value = answers[key];

      if (index) {
        // ถ้ามี index ระบุ
        if (!array_answers[questionId]) {
          array_answers[questionId] = {};
        }
        array_answers[questionId][index] = value;
      } else {
        // ถ้าไม่มี index ระบุ
        array_answers[questionId] = value;
      }
    }
    }
  }
  //validate null
  let json_validate_null = JSON.parse(answers.question_original);
  for (const [key, value] of Object.entries(json_validate_null)) {
    if(array_answers[key] == undefined){
      array_answers[key] = "0";
    }
  }


  await unirest('POST', config.API + 'exam/save')
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
      "exam_id": exam_id,
      "score_id": score_id,
      "answers": array_answers,
      "test_type": exam_type
    }))
    .end(async function (result) {

      let score = +result.body.score;
      let full_score = +result.body.full_score;
      let percent = Math.round(((score * 100) / full_score)) || 0;

      let exam_type = result.body.exam_type;
      
      if(exam_type > 0){
        let path = '/survey/' + courseID + '/' + exam_type + '/' + score_id;
        res.redirect(ORIGINAL_SOURCE + path);

      }else{

        let url = await seo_url(result.body.lesson[0].title)
        let url2 = await seo_url(result.body.title)
        let data = {
          subject_title: result.body.title || null,
          score: score,
          full_score: full_score,
          percent: percent,
          pageID: pageID,
          courseID: courseID,
          lesson_id: result.body.lesson[0].id,
          lesson_title: url,
          redirect: result.body.exam_redirect,
          redirect_url: url2,
          pass_score: result.body.pass_score,
        };

        res.render("subject/showscore", {
          title: req.i18n_texts.title_home,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          data: data
        });
      }
    });


});


router.get("/:cid([0-9]{0,11})/:id([0-9]{0,11})/savescore", async (req, res) => {
  
  const pageID = +req.params.id;
  let courseID = +req.params.cid || 0;
  let path = '/subject/' + courseID + "/" + pageID +'/course';
  res.redirect(ORIGINAL_SOURCE + path);
});

router.get("/:cid([0-9]{0,11})/:pageid([0-9]{0,11})/displayscore/:id([0-9]{0,11})", async (req, res) => {

  const {
    answer,
    exam_id
  } = req.body;
  const score_id = +req.params.id;
  const pageID = +req.params.pageid;
  let courseID = +req.params.cid || 0;

  await unirest('POST', config.API + 'exam/show')
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
    "score_id": score_id
  }))
  .end(async function (result) {
    let score = +result.body.score;
    let full_score = +result.body.full_score;
    let percent = Math.round(((score * 100) / full_score)) || 0;

      let data = {
        subject_title: result.body.title || null,
        score: score,
        full_score: full_score,
        percent: percent,
        pageID: pageID,
        courseID: courseID,
        lesson_id: 0,
        redirect: result.body.exam_redirect,
        redirect_url: 0
      };

      res.render("subject/showscore", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        data: data
      });
    //res.status(200).send('greats');
  });  
});


router.post("/:cid([0-9]{0,11})/:id([0-9]{0,11})/savechapter", async (req, res) => {
  const {
    answer,
    exam_id,
    score_id,
    exam_type
  } = req.body;
  const pageID = +req.params.id;
  let courseID = +req.params.cid || 0;

  const answers = req.body; // ไม่ต้องใช้ req.body.answer เพราะ radio input มาทั้งหมดใน req.body
  let array_answers = {};

  for (const key in answers) {
    if (key.startsWith('answer[')) {
      // const questionId = key.match(/\[(\d+)\]/)[1]; // หาตัวเลขระหว่าง [ และ ]
      // const value = answers[key];
      // array_answers[questionId] = value;
      const match = key.match(/\[(\d+)\](?:\[(\d+)\])?/);
    if (match) {
      const questionId = match[1];
      const index = match[2];
      const value = answers[key];

      if (index) {
        // ถ้ามี index ระบุ
        if (!array_answers[questionId]) {
          array_answers[questionId] = {};
        }
        array_answers[questionId][index] = value;
      } else {
        // ถ้าไม่มี index ระบุ
        array_answers[questionId] = value;
      }
    }
    }
  }
  //validate null
  let json_validate_null = JSON.parse(answers.question_original);
  for (const [key, value] of Object.entries(json_validate_null)) {
    if(array_answers[key] == undefined){
      array_answers[key] = "0";
    }
  }


  await unirest('POST', config.API + 'exam/savechapter')
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
      "exam_id": exam_id,
      "score_id": score_id,
      "answers": array_answers,
      "test_type": exam_type
    }))
    .end(async function (result) {

      let score = +result.body.score;
      let full_score = +result.body.full_score;
      let percent = Math.round(((score * 100) / full_score)) || 0;

      let exam_type = result.body.exam_type;    

        let url = await seo_url(result.body.lesson[0].title)
        let url2 = await seo_url(result.body.title)
        let data = {
          subject_title: result.body.title || null,
          score: score,
          full_score: full_score,
          percent: percent,
          pageID: pageID,
          courseID: courseID,
          lesson_id: result.body.lesson[0].id,
          lesson_title: url,
          redirect: result.body.exam_redirect,
          redirect_url: url2,
          pass_score: result.body.pass_score,
        };

        res.render("subject/showscore", {
          title: req.i18n_texts.title_home,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          data: data
        });
      
    });


});

module.exports = router;
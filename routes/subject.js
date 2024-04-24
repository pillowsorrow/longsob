const config = process.env;
const express = require("express");
const unirest = require('unirest');
const bodyParser = require("body-parser");
const { validate_path , seo_url } = require("../middleware/path_validate");
const useragent = require('express-useragent');
const dayjs = require('dayjs');
const validUrl = require('valid-url');
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;
let PAGE;

router.use(async function (req, res, next) {
  let profileID = req.session.userID || 0;

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
        "name": global.this_page
      }))
      .then(async function (result) {
        if (result.body && result.body.access_token) {
          access_token = result.body.access_token;
          next();
        } else {
          console.error('Missing access_token in the response body. | SUBJECT Page');
          res.redirect(ORIGINAL_SOURCE);
        }
      })
      .catch(err => {
        console.error(err);
        res.redirect(ORIGINAL_SOURCE);
      })
  }
});

router.get("/:cid([0-9]{0,11})/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let pageID = +req.params.id || 0;
  let courseID = +req.params.cid || 0;
  let banner , url;
  if(pageID > 0){
  await unirest('POST', config.API + 'subject/page')
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
      
      banner = await validate_path(result.body.data.banner , config.FILE_PATH);
      url = await seo_url(result.body.data.subject_title);

      result.body.teachers.forEach((teacher) => {
        teacher.name = teacher.name.replace(/null/g, '');
        teacher.name = teacher.name.trim();
      });

      let data = {
        subject_title: result.body.data.subject_title || null,        
        process: result.body.process || 0,
        banner: banner || '',
        description: result.body.data.description_title || null,
        objectives: result.body.data.objectives || null,
        evaluation: result.body.data.evaluation || null,
        schedule: result.body.data.schedule || null,
        teachers: result.body.teachers || null,
        url: url
      };

      res.render("subject/main", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        data: data,
        pageID: pageID,
        courseID: courseID,
        aside: 1
      });
    });
  }else{
    res.render("home/404");
  }
});

router.get(["/:cid([0-9]{0,11})/:id([0-9]{0,11})/lesson/:lessonID/:text" , "/:cid([0-9]{0,11})/:id([0-9]{0,11})/lesson/:text" ] , async (req, res) => {

    let profileID = req.session.userID;
    let pageID = +req.params.id || 0;
    let courseID = +req.params.cid || 0;
    let lessonID = req.params.lessonID || 0;
    let title_page = req.params.text;

    if(pageID > 0){
    if(lessonID == 'pretest'){
      res.redirect(ORIGINAL_SOURCE + '/exam/pretest/' + courseID + '/' + pageID + '/' + title_page);
    }else if(lessonID == 'posttest'){
      res.redirect(ORIGINAL_SOURCE + '/exam/posttest/' + courseID + '/' + pageID + '/' + title_page);
    }else{

    await unirest('POST', config.API + 'subject/lesson')
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
        "lessonID": lessonID,
        "useragent": req.useragent
      }))
      .then(async function (result) {
        if(result.body.result == 0){
          res.redirect(ORIGINAL_SOURCE + '/exam/pretest/' + courseID + '/' + pageID + '/' + title_page);
          return ;
        // }else if(lessonID == 1){
        //   res.redirect(ORIGINAL_SOURCE + '/exam/pretest/' + pageID + '/' + title_page);
        // }else if(lessonID == 999999){
        //   res.redirect(ORIGINAL_SOURCE + '/exam/posttest/' + pageID + '/' + title_page);
        }else{
          const supplymentary = result.body.data.supplymentary;
          let supplymentary_data = {
            "ebook": [],
            "multimedia":[],
            "link": [],
            "digitallibrary": [],
            "document": [],
          };
          if(supplymentary.total > 0){

            for (const [key, value] of Object.entries(supplymentary.item)) {
              let target_path = value.path;
              if(value.type != 4){
                target_path = await validate_path(target_path , config.FILE_PATH);
              }
              let data = {
                title: value.title,
                id: value.id,
                path: target_path,
                cover: value.cover,
                author: value.author
              }
              // if(value.type == 2){
              //   supplymentary_data['ebook'].push(data);
              // }else if(value.type == 3){
              //   supplymentary_data['multimedia'].push(data);
              // }else if(value.type == 4){
              //   supplymentary_data['link'].push(data);
              // }else if(value.type == 5){
              //   supplymentary_data['digitallibrary'].push(data);
              // }else if(value.type == 6){
              //   supplymentary_data['document'].push(data);
              // }
              if((value.type == 2 || value.type == 5)){
                supplymentary_data['digitallibrary'].push(data);
              }else if(value.type == 3){
                supplymentary_data['multimedia'].push(data);
              }else if(value.type == 4){
                supplymentary_data['link'].push(data);
              }else if(value.type == 6){
                supplymentary_data['document'].push(data);
              }
            }

          }
          let lesson = result.body.data.lesson;
          for (const [key, value] of Object.entries(lesson)) {
            if(key == 'video'){
              if (!validUrl.isUri(value)){
                lesson['video'] =  value;
              }
              if(value === null){
                lesson['type'] = 11;
              }
            }
            
          } 

          url = await seo_url(result.body.data.subject_title);
          let next_page , back_page;
          if(result.body.data.back_page == 0){
            back_page = 'subject/' + courseID + '/' + pageID + '/' + url;
          }else{
            back_page = 'subject/' + courseID + '/' + pageID + '/lesson/' + result.body.data.back_page + '/' + url;
          }
          if(result.body.data.lesson.exercise == 1){
            let chapter_url = await seo_url(result.body.data.lesson.title);
            next_page = 'exam/chapter/' + courseID + '/' + result.body.data.lesson.id + '/'+chapter_url;
          }else if(result.body.data.next_page == 0){
            next_page = 'subject/' + courseID + '/' + pageID + '/' + url;
          }else {
            next_page = 'subject/' + courseID + '/' + pageID + '/lesson/' + result.body.data.next_page + '/' + url;
          }

          let aside_obj = result.body.data.lesson_aside;

          // const new_aside_obj = JSON.parse(
          //   JSON.stringify(aside_obj).replaceAll('Pretest', req.i18n_texts.exam_pre_test ).replaceAll('Posttest', req.i18n_texts.exam_post_test)
          // );
          let new_aside_obj = []    
          let lesson_first = 0; 
          let lesson_first_url = '';
          for (const [key, value] of Object.entries(aside_obj)) {
            let lesson_title;
            let lesson_url;        

            if(value.lesson_id == 1){
              lesson_title = value.lesson_title.replaceAll('Pretest', req.i18n_texts.exam_pre_test )
              lesson_url = 'subject/' + courseID + '/' + pageID + '/lesson/pretest/' + result.body.data.subject_title_seo;
            }else if(value.lesson_id == 999999999){
              lesson_title = value.lesson_title.replaceAll('Posttest', req.i18n_texts.exam_post_test )
              lesson_url = 'subject/' + courseID + '/' + pageID + '/lesson/posttest/' + result.body.data.subject_title_seo;
              if(result.body.data.next_page == 0){
                next_page = lesson_url;
              }
            }else{
              lesson_title = value.lesson_title;
              lesson_url = value.url;
              if(lesson_first == 0){
                lesson_first = value.lesson_id;
                lesson_first_url = value.url;
              }
            }

            new_aside_obj.push({
              lesson_id: value.lesson_id || null,
              lesson_title: lesson_title,
              status: value.status || null,
              url: lesson_url,
              id_ref: value.id_ref
            })
          }
          //console.log(lesson_first_url,new_aside_obj);

          let data = {
            subject_title: result.body.data.subject_title || null,          
            lesson: lesson,
            lesson_aside: new_aside_obj,
            lesson_active: result.body.data.lesson_active,
            supplymentary: supplymentary_data,
            back_page: back_page,
            next_page: next_page,
          };

          //console.log(result.body.data.lesson_active)
          if(result.body.data.lesson_active > 0){
            res.render("subject/lesson", {
              title: req.i18n_texts.title_home,
              isLoggedIn: req.session.isLoggedIn,
              isAdmin: req.session.role || 2,
              data: data,
              pageID: pageID,
              courseID: courseID
            });
          }else{
            
            res.redirect(ORIGINAL_SOURCE + '/' + lesson_first_url);

          }
        }

        })
        .catch(err => {
          res.redirect(ORIGINAL_SOURCE + '/subject/' + courseID + '/' + pageID + '/' + title_page);
        })
      }
    }else{
      res.render("home/404");
    }
  });

router.get("/exercise/:cid([0-9]{0,11})/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let pageID = +req.params.id || 0;
  let courseID = +req.params.cid || 0;

  await unirest('POST', config.API + 'subject/exercise')
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

      url = await seo_url(result.body.data.subject_title);
      let data = {
        subject_title: result.body.data.subject_title || null,
        url: url
      };     

      let data_exam = []
      for (const [key, value] of Object.entries(result.body.exam)) {   

        let num_questions = value.exam_data;
        if(value.exam_select == 0){
          let array_questions = value.exam_data.split(',');
          num_questions = array_questions.length;
        }

        let url = await seo_url(value.exam_title);
        data_exam.push({
            exam_id: value.exam_id || null,
            exam_title: value.exam_title,
            exam_url: url,
            num_questions: num_questions,
            exam_status: value.exam_status
        });
      }


      res.render("subject/exercise", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        data: data,
        exams: data_exam,
        pageID: pageID,
        courseID: courseID,
        aside: 3
      });
    });
});

router.get("/teacher/:cid([0-9]{0,11})/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let pageID = +req.params.id || 0;
  let courseID = +req.params.cid || 0;

  await unirest('POST', config.API + 'subject/teacher')
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

      url = await seo_url(result.body.data.subject_title);
      let data = {
        subject_title: result.body.data.subject_title || null,
        url: url
      };


      let teachers = [];
      for (const [key, value] of Object.entries(result.body.teacher)) {   
        avatar = await validate_path(value.avatar , config.FILE_PATH);
        teachers.push({
          name: value.name,
          avatar: avatar,
          id: value.id
        });
      }

      res.render("subject/otherpage", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        data: data,
        pageID: pageID,
        courseID: courseID,
        teachers: teachers,
        aside: 4
      });
    });
});

router.get("/score/:cid([0-9]{0,11})/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let pageID = +req.params.id || 0;
  let courseID = +req.params.cid || 0;

  await unirest('POST', config.API + 'subject/score')
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

      url = await seo_url(result.body.data.subject_title);
      let data = {
        subject_title: result.body.data.subject_title || null,
        url: url
      };

      let score = [];
      for (const [key, value] of Object.entries(result.body.exam)) {   
        let score_data = [];
        let score_pass = value.score_pass;

        for (const [key, value2] of Object.entries(value.scores)) {
          
          let ordinal = (+key) + 1;
          //if (req.i18n_lang == "th") {
            ordinal = req.i18n_texts.text_score_ordinal + ' ' + ordinal;
          //} else { เหลทอภาษาเดียว
            //ordinal = ordinal_suffix_of(ordinal);
          //}
          let percent = Math.ceil((value2.score * 100) / value2.fullscore);
          
          let exam_status = req.i18n_texts.text_score_unpass;
          if(percent >= score_pass){
            exam_status = req.i18n_texts.text_score_pass;
          }
          score_data.push({
            ordinal: ordinal,
            score: value2.score, 
            fullscore: value2.fullscore,
            percent: percent,
            exam_status: exam_status,
            startdate: value2.startdate
          });
          
        }

        score.push({
          exam_type: value.exam_type,
          score_data: score_data
        });
      }

      res.render("subject/otherpage", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        data: data,
        pageID: pageID,
        courseID: courseID,
        scores: score,
        aside: 5
      });
    });
});

router.get("/history/:cid([0-9]{0,11})/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let pageID = +req.params.id || 0;
  let courseID = +req.params.cid || 0;

  const duration = require('dayjs/plugin/duration')
  dayjs.extend(duration)

  await unirest('POST', config.API + 'subject/history')
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

      let dayjs_format = 'H [h] m [m]';
      //if(req.i18n_lang == 'th'){
        dayjs_format = 'H [ชั่วโมง] m [นาที]';
      //}
      
      let histories = [];
      let total_learn = 0
      for (const [key, value] of Object.entries(result.body.histories)) {   

        let  duration_convert = value.lesson_duration + ' ' + req.i18n_texts.course_duration_second;
        if(value.lesson_duration > 59){
          duration_convert = dayjs.duration(value.lesson_duration, 'seconds').format(dayjs_format);
        }
        total_learn += value.lesson_duration;

        histories.push({
          lesson_title: value.lesson_title,
          lesson_duration: value.lesson_duration,
          lesson_duration_convert: duration_convert
        });
      }

      url = await seo_url(result.body.data.subject_title);
      let data = {
        subject_title: result.body.data.subject_title || null,
        url: url,
        total_learn: dayjs.duration(total_learn, 'seconds').format(dayjs_format)
      };


      res.render("subject/otherpage", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        data: data,
        pageID: pageID,
        courseID: courseID,
        histories: histories,
        aside: 6
      });
    });
});

  module.exports = router;

  function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
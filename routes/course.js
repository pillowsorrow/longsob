const config = process.env;
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const unirest = require('unirest');
const {
  ValidateLoggedin
} = require("../middleware/auth");
const {
  logaction
} = require("../middleware/log");
const {
  validate_path,
  seo_url
} = require("../middleware/path_validate");
const router = express.Router();

router.get(["/", "/:id([0-9]{0,11})/group"], ValidateLoggedin, async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");

  let course_group = +req.params.id || 0;

  res.render("home/ttnewnewnew", {
    title: req.i18n_texts.title_course,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    course_group: course_group,
    breadcrumbs: [{
      label: req.i18n_texts.title_course,
      url: "#",
    }, ]
  });
});

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;

router.use(async function (req, res, next) {

  if (global.department == 0) {
    res.redirect(process.env.HOME_PAGE);
  } else {
    const page = req.originalUrl.split('/');
    ORIGINAL_SOURCE = process.env.PATH_SOURCE + '/' + page[1];
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
          console.error('Missing access_token in the response body.');
          res.redirect(ORIGINAL_SOURCE);
        }
      })
      .catch(err => {
        console.error(err);
        res.redirect(ORIGINAL_SOURCE);
      })
  }
});

router.get(["/:id([0-9]{0,11})/detail", "/:id([0-9]{0,11})/detail/successful", "/:id([0-9]{0,11})/detail/uploadpayment"], ValidateLoggedin, async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");
  req.i18n_lang = 'th';
  let data = {};

  let original_Url = req.originalUrl.split("/");
  let displaySuccessful = '';

  if (original_Url[original_Url.length - 1] == 'successful') {
    displaySuccessful = 'show';
  }else if (original_Url[original_Url.length - 1] == 'uploadpayment') {
    displaySuccessful = 'show2';
  }



  await unirest('POST', config.API + 'course/page-detail')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "page_id": req.params.id,
      "profileID": req.session.userID || 0
    }))
    .then(async function (result_page) {
      await logaction(req, res, 'course', 1, 0, req.params.id);
      // if (result_page.error) {
      //   console.log(ORIGINAL_SOURCE + '/course');
      //   res.render("home/404");
      // } else {

        data.group = result_page.body.data[0].group || null;
        data.course_subject = result_page.body.data[0].course_subject;
        data.paymentstatus = result_page.body.data[0].paymentstatus;
        data.discount = result_page.body.data[0].discount;
        data.teachers = result_page.body.data[0].teachers;
        data.user_paymentstatus = result_page.body.data[0].user_paymentstatus;
        data.paymentdetail = result_page.body.data[0].paymentdetail
      
        let course_duration_hours = result_page.body.data[0].course_duration_hours;
        let course_duration_days = result_page.body.data[0].course_duration_days;
        if (course_duration_hours == 0 && course_duration_days == 0) {
          data.course_duration = req.i18n_texts.course_duration_no_limit;
        } else {
          data.course_duration = '';
          if (course_duration_days > 0) {
            data.course_duration += course_duration_days + ' ' + req.i18n_texts.course_duration_day + ' ';
          }
          if (course_duration_hours > 0) {
            data.course_duration += course_duration_hours + ' ' + req.i18n_texts.course_duration_hour;
          }
        }
        if (data.paymentstatus == 1) {
          data.paymentstatus = result_page.body.data[0].price.toLocaleString("en-US") + ' ' + req.i18n_texts.baht;
          data.paymentstatus_key = 1;
        } else {
          data.paymentstatus = req.i18n_texts.course_registration_no_fee;
          data.paymentstatus_key = 0;
        }
        if (data.discount.status == 1) {
          let discount_text = req.i18n_texts.course_discount + ' ' + data.discount.data + ' ';
          let cal_discount;
          if (data.discount.type == 'percent') {
            cal_discount = result_page.body.data[0].price;
            cal_discount = cal_discount - ((cal_discount * data.discount.data) / 100);
            discount_text += '%';

          } else if (data.discount.type == 'price') {
            cal_discount = result_page.body.data[0].price;
            cal_discount = cal_discount - data.discount.data;
            discount_text += req.i18n_texts.baht;

          }
          data.discount = discount_text + ' ' + req.i18n_texts.course_registration_fee + ' ' + Math.ceil(cal_discount).toLocaleString("en-US") + ' ' + req.i18n_texts.baht;
        } else {
          data.discount = 0;
        }
        if (result_page.body.data[0].course_language == 'thai') {
          data.course_language = req.i18n_texts.thai_language;
        }
        let subjectlist = [];
        let first_subject = '';
        for (const [key, value] of Object.entries(result_page.body.data[0].subjectlist)) {

          let cover = await validate_path(value['cover'], config.FILE_PATH);
          if (first_subject == '') {
            first_subject = value['subject_id'] + '/';
            first_subject += await seo_url(value['subject']);
          }

          subjectlist.push({
            subject: value['subject'],
            cover: cover
          });
        }

        res.render("pages/course_detail", {
          title: data['course_subject'] + '::' + req.i18n_texts.title_course,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          breadcrumbs: [{
              label: req.i18n_texts.title_course,
              url: ORIGINAL_SOURCE + "/course/" + data['group'] + "/group",
            },
            {
              label: data['course_subject'],
              url: "#",
            },
          ],
          heading: {
            subject: data['course_subject'],
            code: result_page.body.data[0].course_code,
            duration: data['course_duration'],
            paymentstatus: data['paymentstatus'],
            paymentstatus_key: data['paymentstatus_key'],            
            user_paymentstatus: data['user_paymentstatus'],
            paymentdetail: data['paymentdetail'],
            language: data['course_language'],
            discount: data['discount'],
          },
          body: {
            description: result_page.body.data[0].course_description,
            learning_objectives: result_page.body.data[0].learning_objectives,
            qualification: result_page.body.data[0].qualification,
            evaluation: result_page.body.data[0].evaluation,
            result_learn: result_page.body.data[0].result_learn,
            subjectlists: subjectlist,
            teachers: result_page.body.data[0].teachers,
            congratulation: result_page.body.data[0].congratulation,
            favorites: result_page.body.data[0].favorites,
            can_register: result_page.body.data[0].can_register
          },
          course_id: req.params.id,
          displaySuccessful: displaySuccessful,
          seo_url: first_subject
        });
      //}
    })
    .catch(err => {
      console.error(err);
      res.redirect(ORIGINAL_SOURCE + '/course');
    })

});


const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  "image/tiff",
  "application/pdf"
]
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const path = '../longsobdi-bn/public/upload/payment/' + dayjs().format('YYYY_MM');

    fs.mkdirSync(path, {
      recursive: true
    })
    return callback(null, path)
  },
  filename: function (req, file, callback) {
    let r = (Math.random() + 1).toString(36).substring(2);
    callback(null, '/' + r + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/tiff" || file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('Only .pdf, .png, .jpg and .tiff format allowed!'));
    }
  }
}).any();

router.post(["/payment"], ValidateLoggedin, async (req, res) => {

  let profileID = req.session.userID;
  await upload(req, res, async function (err) {
    const {
      course_id,
    } = req.body;

    if (req.fileValidationError) {
      res.redirect(ORIGINAL_SOURCE + '/course/'+ course_id +'/detail');
    } else {

      let filename = 0;
      if (req.files[0] != undefined) {
        filename = '/upload/payment/' + dayjs().format('YYYY_MM') + req.files[0].filename;
      }
      await unirest('POST', config.API + 'course/payment')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
          "lang": req.i18n_lang,
          "profileID": profileID,
          "course": course_id,
          "attach": filename
        }))
        .end(async function (result) {
          res.redirect(ORIGINAL_SOURCE + '/course/'+ course_id +'/detail/uploadpayment');
        });
      
    }
  });
  
});

module.exports = router;
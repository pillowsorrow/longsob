const config = process.env;
const express = require("express");
const bodyParser = require("body-parser");
const unirest = require('unirest');
const multer = require("multer");
const dayjs = require('dayjs');
const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require('path');
const {
  ifLoggedin,
  ifnotLoggedin
} = require("../middleware/auth");
const {
  validate_path,
  seo_url
} = require("../middleware/path_validate");
const {
  sendemail
} = require("../middleware/mail");
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = process.env.PATH_SOURCE;
let PAGE;

router.use(async function (req, res, next) {
  if (global.department == 0) {
    res.redirect(process.env.HOME_PAGE);
  } else {
    let profileID = req.session.userID || 0;
    const page = req.baseUrl.split('/');
    ORIGINAL_SOURCE = config.PATH_SOURCE + '/' + page[1];
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
  }
});

router.get(["/log"], async (req, res) => {
  let profileID = req.session.userID;
  await unirest('POST', config.API + 'lms/log')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "project": PAGE,
      "department": global.department,
      "profileID": profileID
    }))
    .end(async function (result) {

      let data = [];
      for (let i = 0; i < result.body.total; i++) {

        data.push({
          log_name: result.body.data[i].log_name || null,
          logdate: result.body.data[i].logdate || null,
          logip: result.body.data[i].logip || null,
          logagents: result.body.data[i].logagents || null,
          logplatform: result.body.data[i].logplatform || null
        });
      }

      res.render("pages/lms-log", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: 'log',
        logs: data
      });
    });
});

router.get(["/history"], async (req, res) => {
  let profileID = req.session.userID;

  await unirest('POST', config.API + 'lms/history')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": 'th', //req.i18n_lang,
      "department": global.department,
      "profileID": profileID
    }))
    .end(async function (result) {

      let data = [];
      for (let i = 0; i < result.body.total; i++) {


        let file_cetificate = result.body.data[i].file_cetificate;
        let old_system = result.body.data[i].old_system;

        if(!old_system){
          let dirPath = 'public/upload/certificate';
          let filePath = 'public/'+file_cetificate
  
          try {
            await fs.promises.mkdir(dirPath, { recursive: true });

            fs.access(filePath, fs.constants.F_OK, async(err) => {
              if (err) {
                let url = config.REMOTESERVER_PATH + '/' + file_cetificate;
                let destinationPath = filePath;

                await downloadFile(url, destinationPath)
                .then(() => {
                  //console.log('File downloaded successfully.');
                })
                .catch((error) => {
                  console.error("Error downloading file:", error);
                  // ทำสิ่งที่คุณต้องการทำเมื่อเกิดข้อผิดพลาดในการดาวน์โหลด
                });
              }
            }) 
          } catch (err) {
            if (err.code === 'EEXIST') {
              console.log('Directory already exists:', filePath);
            } else {
              console.error('Error creating directory:', err);
            }
          }         
        }
        data.push({
          course_id: result.body.data[i].course_id || null,
          course_subject: result.body.data[i].course_subject || null,
          score: result.body.data[i].score || null,
          congratulation: result.body.data[i].congratulation || null,
          realcongratulationdate: result.body.data[i].realcongratulationdate || null,
          cetificate: result.body.data[i].cetificate || null,
          old_system: old_system,
          file_cetificate: file_cetificate,
          learner_id: result.body.data[i].learner_id || null,
        });
      }

      res.render("pages/lms-history", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: 'history',
        histories: data,
        server_path: process.env.MAINSERVER_PATH
      });
    });
});


router.get(["/inbox"], async (req, res) => {
  let profileID = req.session.userID;
  await unirest('POST', config.API + 'lms/inbox')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "profileID": profileID
    }))
    .end(async function (result) {

      let data = [];
      for (let i = 0; i < result.body.total; i++) {
        let read  = 'success';
        if( result.body.data[i].read == 0){
          read  = 'danger';
        }
        data.push({
          invite_id: result.body.data[i].invite_id || null,
          fullname: result.body.data[i].fullname || null,
          course_subject: result.body.data[i].course_subject || null,
          message: result.body.data[i].message || null,
          read: read
        });
      }

      res.render("pages/lms-inbox", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: 'inbox',
        inboxs: data
      });
    });
});

router.get(["/register/favorites", "/register/desc", "/register/asc", "/register"], async (req, res) => {

  let original_Url = req.originalUrl.split("/");
  let displayRow = 'asc';

  if (original_Url[original_Url.length - 1] == 'favorites') {
    displayRow = 'fav';
  } else if (original_Url[original_Url.length - 1] == 'desc') {
    displayRow = 'desc';
  }

  let profileID = req.session.userID;
  await unirest('POST', config.API + 'lms/register')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": 'th', //req.i18n_lang,
      "project": PAGE,
      "type": displayRow,
      "profileID": profileID,
      "department": global.department
    }))
    .end(async function (result) {

      let data = [];

      for (let i = 0; i < result.body.total; i++) {


        let cover = await validate_path(result.body.data[i].cover, config.FILE_PATH);

        data.push({
          course_id: result.body.data[i].course_id || null,
          cover: cover || null,
          course_subject: result.body.data[i].course_subject || null,
          lesson: result.body.data[i].lesson || null,
          favorites: result.body.data[i].favorites || 0,
          learner: result.body.data[i].learner || 0,
          expired: result.body.data[i].expired || 0
        });
      }

      res.render("pages/lms-register", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: 'register',
        classroom_data: data
      });
    });
});

router.get(["/", "/classroom"], async (req, res) => {

  let profileID = req.session.userID;
  await unirest('POST', config.API + 'lms/classroom')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": 'th', //req.i18n_lang,
      "department": global.department,
      "profileID": profileID
    }))
    .end(async function (result) {

      let data = [];
      for (let i = 0; i < result.body.total; i++) {
        let cover = await validate_path(result.body.data[i].cover, config.FILE_PATH);
        //let url = result.body.data[i].course_id + '/' + seo_url(result.body.data[i].lesson);

        data.push({
          course_id: result.body.data[i].course_id || null,
          cover: cover || null,
          course_subject: result.body.data[i].course_subject || null,
          lesson: result.body.data[i].lesson || null,
          paymentstatus: result.body.data[i].paymentstatus || null,
          user_paymentstatus: result.body.data[i].user_paymentstatus || null
        });
      }

      res.render("pages/lms", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: 'classroom',
        classroom_data: data
      });
    });
});

router.get(["/training"], async (req, res) => {
  let profileID = req.session.userID;
  await unirest('POST', config.API + 'lms/training')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "project": PAGE,
      "profileID": profileID,
      "department": global.department,
      "training": 0
    }))
    .end(async function (result) {

      let data = [];
      for (let i = 0; i < result.body.total; i++) {

        
        let image_originalname = result.body.data[i].attach;
        if(image_originalname != '-'){
        
          
          let dirPath = 'public/upload/upload-users/'+profileID + '/training';
          let filePath = 'public/upload/' + image_originalname

          try {
            await fs.promises.mkdir(dirPath, { recursive: true });
 
            fs.access(filePath, fs.constants.F_OK, async(err) => {
              if (err) {
                let url = config.REMOTESERVER_PATH + '/upload/' + image_originalname;
                let destinationPath = filePath;
    
                await downloadFile(url, destinationPath)
                .then(() => {
                  //console.log('File downloaded successfully.');
                })
                .catch((error) => {
                  console.error("Error downloading file:", error);
                  // ทำสิ่งที่คุณต้องการทำเมื่อเกิดข้อผิดพลาดในการดาวน์โหลด
                });
              }
            })
          } catch (err) {
            if (err.code === 'EEXIST') {
              console.log('Directory already exists:', filePath);
            } else {
              console.error('Error creating directory:', err);
            }
          }     
        }

        data.push({
          id: result.body.data[i].id || null,
          title: result.body.data[i].title || null,
          institution: result.body.data[i].institution || null,
          attach: image_originalname || null,
          startdate: result.body.data[i].startdate || null,
          enddate: result.body.data[i].enddate || null
        });
      }

      res.render("pages/lms-training", {
        title: req.i18n_texts.title_home,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: 'training',
        trainings: data
      });
    });
});

router.get(["/training/:id([0-9]{0,11})/edit", "/training/:id([0-9]{0,11})/edit/:text"], async (req, res) => {
  let profileID = req.session.userID;
  let training_id = +req.params.id || 0;
  if (training_id > 0) {
    let status_text = req.params.text || '-';

    await unirest('POST', config.API + 'lms/training')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      })
      .send(JSON.stringify({
        "lang": req.i18n_lang,
        "project": PAGE,
        "profileID": profileID,
        "training": training_id
      }))
      .end(async function (result) {

        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        let image_originalname = result.body.data[0].attach || null;
        let memetype = null;


          let dirPath = 'public/upload/upload-users/'+profileID + '/training';
          let filePath = 'public/upload/' + image_originalname

          try {
            await fs.promises.mkdir(dirPath, { recursive: true });
              fs.access(filePath, fs.constants.F_OK, async(err) => {
                if (err) {
                  let url = config.REMOTESERVER_PATH + '/upload/' + image_originalname;
                  let destinationPath = filePath;

                  await downloadFile(url, destinationPath)
                  .then(() => {
                    //console.log('File downloaded successfully.');
                  })
                  .catch((error) => {
                    console.error("Error downloading file:", error);
                    // ทำสิ่งที่คุณต้องการทำเมื่อเกิดข้อผิดพลาดในการดาวน์โหลด
                  });
                }
              })     
          } catch (err) {
            if (err.code === 'EEXIST') {
              console.log('Directory already exists:', filePath);
            } else {
              console.error('Error creating directory:', err);
            }
          }       
        
          

        if (image_originalname != '-') {
          // Get the extension of the uploaded file
          const file_extension = image_originalname.slice(
            ((image_originalname.lastIndexOf('.') - 1) >>> 0) + 2
          );

          // Check if the uploaded file is allowed
          if (!array_of_allowed_files.includes(file_extension)) {
            memetype = 'iframe';
          } else {
            memetype = 'image';
          }
        }


        let postpath = 'lms/training/' + result.body.data[0].id + '/edit';
        let data = {
          id: result.body.data[0].id || null,
          title: result.body.data[0].title || null,
          institution: result.body.data[0].institution || null,
          attach: image_originalname,
          memetype: memetype,
          startdate: result.body.data[0].startdate || null,
          enddate: result.body.data[0].enddate || null,
          postpath: postpath
        };


        res.render("pages/lms-training-form", {
          title: req.i18n_texts.title_home,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          breadcrumbs: 'training',
          training: data,
          displayError: status_text
        });
      });
  }
});
router.get(["/training/insert"], async (req, res) => {

  let postpath = 'lms/training/insert';
  let data = {
    id: 0,
    title: '',
    institution: '',
    startdate: dayjs().format('DD MMM YYYY'),
    enddate: dayjs().format('DD MMM YYYY'),
    postpath: postpath
  };

  res.render("pages/lms-training-form", {
    title: req.i18n_texts.title_home,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: 'training',
    training: data,
    displayError: null
  });
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
    const path = config.UPLOAD_PATH + '/upload-users/' + req.session.userID + '/training'
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

router.post(["/training/:id([0-9]{0,11})/edit"], async (req, res) => {

  let profileID = req.session.userID;
  let training_id = +req.params.id;

  await upload(req, res, async function (err) {

    if (req.fileValidationError) {
      res.redirect(ORIGINAL_SOURCE + '/lms/training/' + training_id + '/edit/error');
    } else {

      let filename = 0;
      if (req.files[0] != undefined) {
        filename = 'upload-users/' + profileID + '/training' + req.files[0].filename;
      }
      const {
        startdate,
        enddate,
        title,
        institution,
        status_attach,
        old_file
      } = req.body;

      if (status_attach == 'true') {
        filename = '';
      }
      if (old_file != '') {
        if (fs.existsSync('public/upload/' + old_file)) {
          fs.truncate('public/upload/' + old_file, 0, function () {
            fs.unlinkSync('public/upload/' + old_file);
          })
        }
      }


      await unirest('POST', config.API + 'lms/training-edit')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
          "lang": req.i18n_lang,
          "project": PAGE,
          "profileID": profileID,
          "training": training_id,
          "startdate": startdate,
          "enddate": enddate,
          "title": title,
          "institution": institution,
          "attach": filename
        }))
        .end(async function (result) {

          let postpath = ORIGINAL_SOURCE + '/lms/training/' + training_id + '/edit/sucess?clang='+req.i18n_lang;

          res.redirect(postpath);
        });

    }
  });
});

router.post(["/training/insert"], async (req, res) => {
  let profileID = req.session.userID;
  let training_id = +req.params.id || 0;
  await upload(req, res, async function (err) {

    if (req.fileValidationError) {
      //console.log(ORIGINAL_SOURCE + '/lms/training/' + training_id + '/edit/error')
      res.redirect(ORIGINAL_SOURCE + '/lms/training/' + training_id + '/edit/error?clang='+req.i18n_lang);
    } else {

      let filename = 0;
      if (req.files[0] != undefined) {
        filename = 'upload-users/' + profileID + '/training' + req.files[0].filename;
      }
      const {
        startdate,
        enddate,
        title,
        institution,
        status_attach,
        old_file
      } = req.body;

      if (status_attach == 'true') {
        filename = '';
      }
      if (old_file != '') {
        fs.truncate('public/upload/' + old_file, 0, function () {
          fs.unlinkSync('public/upload/' + old_file);
        })

      }


      await unirest('POST', config.API + 'lms/training-insert')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
          "lang": req.i18n_lang,
          "project": PAGE,
          "profileID": profileID,
          "startdate": startdate,
          "enddate": enddate,
          "title": title,
          "institution": institution,
          "attach": filename
        }))
        .end(async function (result) {
          let postpath = ORIGINAL_SOURCE + '/lms/training/' + result.body.trainingid + '/edit/new?clang='+req.i18n_lang;

          res.redirect(postpath);
        });

    }
  });
});

router.post(["/congratulation"], async (req, res) => {
  let profileID = req.session.userID;
  const {
    pageID,
    lessonID
  } = req.body;

  await unirest('POST', config.API + 'lms/congratulation')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  })
  .send(JSON.stringify({
    "profileID": profileID,
    "pageID": pageID
  }))
  .end(async function (result) {
    let result_status = result.body.result;
    let email = result.body.email;
    let to_mail = result.body.name;
    let course = result.body.course;
    
    if (result_status === 0 && isValidEmail(email)) {
      const promises = [];

      const mailOptions = {
        from: config.EMAIL_SENDER,
        to: email,
        subject: 'ยินดีกับผลการศึกษา ต้านทุจริตศึกษา Anti-corruption Education',
        template: 'congratulation',
        context: {
          name: to_mail,
          course: course
        }
      };
      promises.push(sendemail(mailOptions));

      await Promise.all(promises).then(async (results) => {

        res.status(200).send('congratulation');

      });
    }else{
      res.status(200).send('no email');
    }
    
  });

});

router.get(["/certificate/:id([0-9]{0,11})" , "/history/certificate/:id([0-9]{0,11})"], async (req, res) => {
  let profileID = req.session.userID;
  let course_id = +req.params.id;
  dayjs.locale('th');
  await unirest('POST', config.API + 'lms/certificate')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "profileID": profileID,
      "course_id": course_id
    }))
    .end(async function (result) {

      const input = result.body.name;
      const input2 = result.body.subject;

      let th_date = dayjs(result.body.congratulationdate).locale('th').format('DD MMMM YYYY');
      const th_date_Array = th_date.split(" ");
      let th_day = +th_date_Array[0];
      let th_month = ' เดือน ' +th_date_Array[1];
      let th_year;
      if(th_date_Array[2] > 2500){
        th_year = ' พ.ศ. ' + th_date_Array[2]; 
      }else{
        th_year = ' พ.ศ. ' + (+th_date_Array[2] + 543); 
      }
      
      const input3 = 'ให้ไว้ ณ วันที่ ' + th_day + th_month + th_year;

      const url = await validate_path(result.body.file, config.FILE_PATH );
      let signature = null;
      if(result.body.signature.file != null){
        signature = await validate_path(result.body.signature.file, config.FILE_PATH );
      }
      let signatures = {
        url: signature || null,
        name: result.body.signature.name || null,
        position: result.body.signature.position || null
      }

      //const url = 'http://localhost:3000/upload/upload-signa/certificate_1.png';
      //get the image buffer
      const image = await makeMeme({ url, input, input2 , input3 , signatures});

      //create headers object
      const headers = {
        "Content-Type": "image/jpg",
        "quality": 0.95
      };

      //set status code and headers
      res.writeHead(200, headers);

      //end by sending image
      res.end(image);
    });
});
router.get(["/certificate-review/:id([0-9]{0,11})/:lid([0-9]{0,11})" , "/history/certificate-review/:id([0-9]{0,11})/:lid([0-9]{0,11})"], async (req, res) => {
  let profileID = req.session.userID;
  let course_id = +req.params.id;
  let learner_id = +req.params.lid;

  await unirest('POST', config.API + 'lms/certificate-review')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  })
  .send(JSON.stringify({
    "lang": req.i18n_lang,
    "department": global.department,
    "profileID": profileID,
    "course_id": course_id,
    "learner_id": learner_id
  }))
  .end(async function (result) {
    let name = result.body.name;
        name = name.split(" ");
    let first_name = result.body.name_array.firstname;
    let mid_name = result.body.name_array.middlename;
    let last_name = result.body.name_array.lastname;

    let mid_name_url = mid_name;
    if(mid_name == null || mid_name == 'null'){
      mid_name = '';
      mid_name_url = '-';
    }

    res.render("pages/certificate-review", {
      title: req.i18n_texts.title_home,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      sample_file: ORIGINAL_SOURCE + '/lms/certificate-review/' + course_id + '/' + learner_id + '/' + first_name + '/' + mid_name_url + '/' + last_name,
      //sample_file: process.env.MAINSERVER_PATH + '/' + PAGE + '/lms/certificate-review/' + course_id + '/' + learner_id + '/' + first_name + '/' + mid_name + '/' + last_name,
      first_name: first_name,
      mid_name: mid_name,
      last_name: last_name,
      course_id: course_id,
      learner_id: learner_id
    });
  });
});

router.get(["/certificate-review/:id([0-9]{0,11})/:lid([0-9]{0,11})/:name/:midname/:surname","/certificate-save/:id([0-9]{0,11})/:lid([0-9]{0,11})/:name/:midname/:surname"], async (req, res) => {
  let profileID = req.session.userID;
  let course_id = +req.params.id;
  let learner_id = +req.params.lid;
  let name = req.params.name;
  let midname = req.params.midname;
  let surname = req.params.surname;


  let action_type;
  if (req.path.startsWith("/certificate-review")) {
    action_type = 'review';
  } else if (req.path.startsWith("/certificate-save")) {
    action_type = 'save';
  }

  dayjs.locale('th');
  await unirest('POST', config.API + 'lms/certificate-review')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "profileID": profileID,
      "course_id": course_id,
      "learner_id": learner_id,
      "action_type": action_type,
      "localserver_path": config.LOCALSERVER_PATH
    }))
    .end(async function (result) {

      
      let full_name = result.body.name;
      if(name != null){
        full_name = name;
      }
      if(midname != null && midname != '-'){
 
        full_name = full_name + ' ' + midname;
      }

      if(surname != null){
        full_name = full_name + ' ' + surname;
      }
      
      const input = full_name;
      const input2 = result.body.subject;

      
      let th_date = dayjs(result.body.congratulationdate).locale('th').format('DD MMMM YYYY');
      
      const th_date_Array = th_date.split(" ");
      let th_day = +th_date_Array[0];
      let th_month = ' เดือน ' +th_date_Array[1];
      let th_year;
      if(th_date_Array[2] > 2500){
        th_year = ' พ.ศ. ' + th_date_Array[2]; 
      }else{
        th_year = ' พ.ศ. ' + (+th_date_Array[2] + 543); 
      }

      const input3 = 'ให้ไว้ ณ วันที่ ' + th_day + th_month + th_year;
      const input4 = result.body.cerf_code;
      const url = await validate_path(result.body.file, config.FILE_PATH );
      
      let signature = null;
      if(result.body.signature.file != null){
        signature = await validate_path(result.body.signature.file, config.FILE_PATH );
      }
      let signatures = {
        url: signature || null,
        name: result.body.signature.name || null,
        position: result.body.signature.position || null
      }

      const image = await makeMeme({ url, input, input2 , input3 , input4 , signatures});

      if(action_type == 'review'){
        //create headers object
        const headers = {
          "Content-Type": "image/jpg",
          "quality": 0.95
        };

        //set status code and headers
        res.writeHead(200, headers);

        //end by sending image
        res.end(image);
      }else if(action_type == 'save'){
        const filePath = 'public/upload/certificate/' + result.body.cerf_name;

        // ใช้ fs เพื่อเขียนไฟล์
        fs.writeFileSync(filePath, image);
    
        // ส่ง response กลับ
        res.json({ success: true, message: "Image saved successfully" });
      }
    });
});


module.exports = router;


function getLines(ctx, text, maxWidth) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
          currentLine += " " + word;
      } else {
          lines.push(currentLine);
          currentLine = word;
      }
  }
  lines.push(currentLine);
  return lines;
}
const makeMeme = async ({
  //the url of the image to put the text on
  url,
  //the text to put on the image
  input,input2,input3,input4,
  //signatures image
  signatures
}) => {
  registerFont('source/font/THSarabunNew.ttf', {
    family: 'TH Sarabun New'
  })
  registerFont('source/font/THSarabunNewBold.ttf', { family: 'TH Sarabun New bold' })
  //if there's no image to work with
  //don't try anything

  if (!url) return undefined;

  const canvas = createCanvas(200, 200);
  const context = canvas.getContext("2d");

  const fontSetting = '110px "TH Sarabun New"';
  context.font = fontSetting;

  let text = context.measureText(input);
  let textWidth = text.width;
  
  //loadImage is a function from node-canvas that loads an image
  const image = await loadImage(url);

  //set the canvas to the same size as the image
  canvas.width = image.width;
  canvas.height = image.height;

  //changing the canvas size resets the font
  //so use the fontSetting again
  context.font = fontSetting;
  context.fillStyle = "#CF8C3F";
  //do some math to figure out where to put the text
  //indent the text in by half of the extra space to center it
  let center = Math.floor((canvas.width - textWidth) / 2) | 5;
  //put the text 30 pixels up from the bottom of the canvas
  let top = (canvas.height / 3) * 1.35;

  //put the image into the canvas first
  //x: 0, y: 0 is the upper left corner
  context.drawImage(image, 0, 0);

  //draw the outline in black
  context.fillText(input, center, top);

  //end text 1
  //start text 2
  let subject_name = input2;
  context.font = '78px "TH Sarabun New"';
  context.fillStyle = "#000000";
  text = context.measureText(subject_name);
  textWidth = text.width;

  let linesResult;
  let widtheightypercent = canvas.width * 0.8;
  if (textWidth >= widtheightypercent) {

      linesResult  = getLines(context, input2, widtheightypercent);

      let newline1 = context.measureText(linesResult[0]);
      let newline2 = context.measureText(linesResult[1]);
      textWidth = newline1.width;
      // if(newline2.width > newline1.width){
      //   textWidth = newline2.width;
      // }
      subject_name = linesResult[0];


      //second line
      center = Math.floor((canvas.width - newline2.width) / 2) | 5;
      top = (canvas.height / 4) * 2.50;
      context.fillText(linesResult[1], center, top);
  }

  center = Math.floor((canvas.width - textWidth) / 2) | 5;
  top = (canvas.height / 4) * 2.27;
  context.fillText(subject_name, center, top);

  //start text 3
  context.font = '70px "TH Sarabun New"';
  text = context.measureText(input3);
  textWidth = text.width;
  center = Math.floor((canvas.width - textWidth) / 2) | 5;

  top = (canvas.height / 3) * 2.24;
  context.fillText(input3, center, top);

  //start text 4
  context.font = '60px "TH Sarabun New"';
  text = context.measureText(input4);
  textWidth = text.width;

  rigth = Math.floor(canvas.width - (textWidth+40));
  bottom = canvas.height - 20;
  context.fillStyle = "#ffffff"; // Set text color to white
  context.fillText(input4, rigth, bottom);
  // Set up the style for white highlight
  context.fillStyle = "#000000"; // Set text color to white

  // Draw the highlight text with some offset for the highlight effect
  context.fillText(input4, rigth - 3, bottom - 3);

  //context.strokeText(input2, center, 100);

  //signatures

  if(signatures.name != null) {
    context.font = '66px "TH Sarabun New"';
    context.fillStyle = "#000000";
    text = context.measureText(signatures.name);
    textWidth = text.width;
    center = Math.floor((canvas.width - textWidth) / 2) | 5;

    top = (canvas.height / 3) * 2.67;
    context.fillText(signatures.name, center, top);

  }
  if(signatures.position != null) {
    context.font = '66px "TH Sarabun New"';
    context.fillStyle = "#000000";
    text = context.measureText(signatures.position);
    textWidth = text.width;
    center = Math.floor((canvas.width - textWidth) / 2) | 5;
    if(signatures.name != null) {
      top = (canvas.height / 3) * 2.81;
    }else{
      top = (canvas.height / 3) * 2.67;
    }
    context.fillText(signatures.position, center, top);

  }

  if(signatures.url != null) {
    const signaturesImage = await loadImage(signatures.url);

    // Calculate position for signatures (60px from the bottom, centered)
    const signaturesX = (canvas.width - signaturesImage.width) / 2;
    const signaturesY = (canvas.height / 3) * 2.40;

    // Draw the signatures image on the canvas
    context.drawImage(signaturesImage, signaturesX, signaturesY);
  }


  //return the buffer
  return canvas.toBuffer();
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



const downloadFile = async (url, destinationPath) => {
  return new Promise(async (resolve) => {
    unirest.get(url)
        .encoding(null) // Added
        .end(async (res) => {

          if (res.error || !res.raw_body) {
            //console.log("Error when downloading page : " + destinationPath, " ", res.error)
            resolve();
          }else{
            const data = Buffer.from(res.raw_body);
            fs.writeFileSync(destinationPath, data, 'binary'); // Modified or fs.writeFileSync(pageName + '.png', data);
            resolve();
          }
        });
});
};
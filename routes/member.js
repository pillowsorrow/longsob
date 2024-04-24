const config = process.env;
const express = require("express");
const unirest = require('unirest');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const {
  ifLoggedin , ifnotLoggedin
} = require("../middleware/auth");
const {
  sendemail
} = require("../middleware/mail");
const router = express.Router();

router.get("/forgot", async (req, res) => {

  res.render("pages/register-fotgot", {
    title: req.i18n_texts.menu_text_login_forgot,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2
  });
});

let access_token;
let ORIGINAL_SOURCE = process.env.PATH_SOURCE;
let PAGE;

router.use(async function (req, res, next) {
  const page = req.baseUrl.split('/');
  ORIGINAL_SOURCE = config.PATH_SOURCE + '/'+ page[1];
  PAGE = page[1];
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
    
});

router.get("/forgot/:id", async (req, res) => {
  let id = req.params.id.trim() || null;
  if ((id == '') || (id == null)) {
    res.redirect("/");
  } else {

        await unirest('POST', config.API + 'member/forgot-validate')
          .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
          })
          .send(JSON.stringify({
            "name": PAGE,
            "id": id
          }))
          .end(async function (result2) {
            let error = result2.body.result
            if (error == 0) {
              res.render("pages/register-fotgot-form", {
                title: req.i18n_texts.menu_text_login_forgot,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                uid: result2.body.uid
              });
            } else {

              res.render("pages/register-fotgot-status", {
                title: req.i18n_texts.menu_text_login_forgot,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                error: 2
              });
            }
          });


  }
});

router.post("/forgot-update", async (req, res) => {
  let {
    password1,
    password2,
    uid
  } = req.body;

  let comparePassword = 0;
  if (password1 !== undefined && password2 !== undefined) {
    comparePassword = password1.localeCompare(password2);
  }

  if (comparePassword == 0) {


        await unirest('POST', config.API + 'member/update-password')
          .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
          })
          .send(JSON.stringify({
            "name": PAGE,
            "password": password2,
            "uid": uid
          }))
          .end(async function (result2) {
            res.render("pages/register-fotgot-form", {
              title: req.i18n_texts.menu_text_login_forgot,
              isLoggedIn: req.session.isLoggedIn,
              isAdmin: req.session.role || 2,
              uid: 0
            });
          });

  } else {

    res.render("pages/register-fotgot-status", {
      title: req.i18n_texts.menu_text_login_forgot,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      error: 3
    });
  }


});

router.post("/forgot", async (req, res) => {

  if(process.env.EMAIL_VALIDATE == 'true'){

    let email = req.body.recoveremail;

      await unirest('POST', config.API + 'member/forgot')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
          "name": PAGE,
          "email": email
        }))
        .end(async function (result2) {
          let error = result2.body.result

          if (error == 0) {
            let email_path = ORIGINAL_SOURCE + '/member/forgot/' + result2.body.email_path;

            const mailOptions = {
              from: config.EMAIL_SENDER,
              to: email,
              subject: 'ลืมรหัสผ่าน',
              template: 'forgot',
              context: {
                url: email_path
              }
            };

            const promises = [];

            promises.push(sendemail(mailOptions));

            await Promise.all(promises).then(async (results) => {

              res.render("pages/register-fotgot-status", {
                title: req.i18n_texts.menu_text_login_forgot,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                error: 0
              });

            });
          } else {

            res.render("pages/register-fotgot-status", {
              title: req.i18n_texts.menu_text_login_forgot,
              isLoggedIn: req.session.isLoggedIn,
              isAdmin: req.session.role || 2,
              error: 1
            });

          }

        });
  }else{

    let idcard = req.body.recoveridcard;
    let user_name = req.body.recoveruname;
    //console.log(idcard,user_name);

    await unirest('POST', config.API + 'member/forgot-withoutmail')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "idcard": idcard,
      "user_name": user_name
    }))
    .end(async function (result2) {
      if(result2.body.result == 0){

        res.render("pages/register-fotgot-status", {
          title: req.i18n_texts.menu_text_login_forgot,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          error: 4
        });

      }else{
        res.render("pages/register-fotgot-form", {
          title: req.i18n_texts.menu_text_login_forgot,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          uid: result2.body.user_id
        });
      }
    });
    

  }
  
});

router.get(["/profile/error" , "/profile/successful" , "/profile" ] ,ifnotLoggedin, async (req, res) => {
  
  let original_Url = req.originalUrl.split("/");
  let displayError = '';

  if(original_Url[original_Url.length-1] == 'error'){
    displayError = 'show';
  }else if(original_Url[original_Url.length-1] == 'successful'){
    displayError = 'successful';
  }

  let userID = req.session.userID;
  await unirest('POST', config.API + 'member/profile')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  })
  .send(JSON.stringify({
    "name": PAGE,
    "uid": userID
  }))
  .end(async function (result) {
    if (result.error){
      res.redirect(ORIGINAL_SOURCE + "/member/profile");
    }   

    //let user = result.body.user;

    let {
      avatar,
      gender,
      username,
      firstname,
      middlename,
      lastname,
      citizen_id,
      mobile,
      email,
      affiliation,
      organization
    } = result.body.user;
    //console.log(result.body.user);

    //let avatar = user.avatar || null;

    if(avatar == null) {
      avatar = process.env.PATH_SOURCE + '/images/icon_user-01.png';
    }else{
      if (avatar.indexOf('http://') === 0 || avatar.indexOf('https://') === 0){
        avatar = avatar;

        let copy_avatar = avatar.split("/upload/");
        let dirPath = 'public/upload/upload-users/'+userID;
        let filePath = 'public/upload/'+copy_avatar[1]

        try {
          await fs.promises.mkdir(dirPath, { recursive: true });
          
          fs.access(filePath, fs.constants.F_OK, async(err) => {
            if (err) {
              let url = config.REMOTESERVER_PATH + '/upload/' + copy_avatar[1];
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

      }else{
        if((avatar != null) && (avatar != '')){
          avatar = process.env.PATH_SOURCE + 'upload/' + avatar;          
        }else{
          avatar = process.env.PATH_SOURCE + '/images/avatar.png';
        }
      }
    }

    res.render("pages/member-edit-form", {
      title: req.i18n_texts.profile_titles,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      displayError: displayError,
      profile: {
        gender: gender,
        username: username,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        citizen_id: citizen_id,
        mobile: mobile,
        email: email,
        avatar: avatar,
        affiliation: affiliation,
        organization: +organization
      }
    });
  });
});

router.post("/saveprofile",  async (req, res) => {

  const {
    citizen_id,
    gender,
    firstname,
    middlename,
    lastname,
    email,
    mobile
  } = req.body;
  const userID = req.session.userID;

  await unirest('POST', config.API + 'member/saveprofile')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      })
      .send(JSON.stringify({
        "name": PAGE,
        "uid": userID,
        "citizen_id": citizen_id || null,
        "gender": gender || null,
        "firstname": firstname || null,
        "middlename": middlename || null,
        "lastname": lastname || null,
        "email": email || null,
        "mobile": mobile || null
      }))
      .end(async function (result) {
        res.redirect(ORIGINAL_SOURCE + "/member/profile/successful");
      });
});

router.post("/savepassword",  async (req, res) => {

  const { password } = req.body;
  const userID = req.session.userID;

  await unirest('POST', config.API + 'member/savepassword')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      })
      .send(JSON.stringify({
        "name": PAGE,
        "uid": userID,
        "password": password
      }))
      .end(async function (result) {
        res.redirect(ORIGINAL_SOURCE + "/member/profile/successful");
      });
});

const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
]
const storage = multer.diskStorage({
  destination: (req, file, callback) => {    
    const path = config.UPLOAD_PATH + '/upload-users/' + req.session.userID
    fs.mkdirSync(path, { recursive: true })
    return callback(null, path)
  },
  filename: function (req, file, callback) {
    callback(null,  '/avatar' + path.extname(file.originalname) );
  },
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  } }).any();


router.post("/saveavatar",  async (req, res) => {

  await upload(req, res, async function (err) {

    if (req.fileValidationError) {
      res.redirect(ORIGINAL_SOURCE + "/member/profile/error");
    } else {
      if (req.files && req.files.length > 0) {

        const { destination , filename } = req.files[0];
        const userID = req.session.userID;
        const user_avatar = process.env.PATH_SOURCE + '/upload/upload-users/' + userID + filename;
        
        await unirest('POST', config.API + 'member/saveavatar')
        .headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
          "name": PAGE,
          "uid": userID,
          "avatar": user_avatar
        }))
        .end(async function (result) {

          res.cookie("cookieProfileAvatar", user_avatar, {
            maxAge: 10800000,
            httpOnly: false,
            sameSite: 'strict'
          });
          
          res.redirect(ORIGINAL_SOURCE + "/member/profile/successful");
        });
      }else{
        res.redirect(ORIGINAL_SOURCE + "/member/profile/error");
      }
    }
  });
});

router.get("/", ifLoggedin, async (req, res) => {
  res.redirect(ORIGINAL_SOURCE );
});

module.exports = router;



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
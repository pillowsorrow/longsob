require("dotenv").config();
const compression = require("compression");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require('express-session')
const minify = require("express-minify");
const uglifyjs = require("uglify-js");
const i18n = require("i18n-express");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const Keygrip = require("keygrip");
const unirest = require('unirest');
const useragent = require('express-useragent');
const Recaptcha = require('express-recaptcha').RecaptchaV3
const port = process.env.PORT || 3000;

const {
  ValidateLoggedin,
  ifLoggedin
} = require("./middleware/auth");
const {
  logaction
} = require("./middleware/log");
const {
  fetchThemeColorFromDatabase
} = require("./middleware/theme");

const copRouter = require("./routes/cop");
const activityRouter = require("./routes/activity");
const knowledgeRouter = require("./routes/knowledge");
const courseRouter = require("./routes/course");
const registerRouter = require("./routes/register");
const memberRouter = require("./routes/member");
const lmsRouter = require("./routes/lms");
const subjectRouter = require("./routes/subject");
const examRouter = require("./routes/exam");
const surveyRouter = require("./routes/survey");
const helpRouter = require("./routes/help");
const apiRouter = require("./routes/api");

const app = express();
const DIR = process.env.DIR;
let ORIGINAL_SOURCE = process.env.PATH_SOURCE;

app.set("view engine", "ejs");
app.use(compression());
app.use(
  minify({
    uglifyJsModule: uglifyjs,
    cache: __dirname + "/public/cache",
  })
);
app.use(
  express.static(__dirname + "/public", {
    //maxAge: 31557600
  })
);

const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, { hl: 'th', action: 'login' , callback: 'cb' })

app.use(cookieParser());
//app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(useragent.express());
app.use(
  i18n({
    translationsPath: path.join(__dirname, "/source/locales"),
    siteLangs: ["th", "en"],
    textsVarName: "translation",
    browserEnable: false,
    defaultLang: "th"
  })
);

app.use(async function (req, res, next) {
  let page = req.url.split('/');
  if (global.themeColor == undefined || global.this_page != page[1]) {
    department = await fetchThemeColorFromDatabase(page[1]);
    const departments = department.split('|');
    global.this_page = page[1];
    global.themeColor = departments[0];
    global.department = departments[1];
    global.main_logo = departments[2];
  }

  next();
});

app.use(function (req, res, next) {

  const page = req.url.split('/');
  ORIGINAL_SOURCE = process.env.PATH_SOURCE + '/' + page[1];

  res.locals.project = page[1];
  res.locals.api = process.env.API_EXT;
  res.locals.original_source = ORIGINAL_SOURCE;
  res.locals.path_source = process.env.PATH_SOURCE;
  res.locals.file_path = process.env.FILE_PATH;
  //res.locals.i18n_lang = req.i18n_lang;
  res.locals.i18n_lang = 'th';
  res.locals.themcolor = global.themeColor;
  res.locals.main_logo = global.main_logo;
  res.locals.from_email_validate = process.env.EMAIL_VALIDATE;
  res.locals.project_id = global.department;
  res.locals.recaptcha_key = process.env.RECAPTCHA_SITE_KEY;
  res.locals.vc_path = process.env.VC_PATH;

  next();
});

app.use(function (req, res, next) {
  let cookies = {};

  if (!req.headers.cookie) {
    next();
  } else {

    const cookiesArray = req.headers.cookie.split(';');

    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.trim().split('=');
      cookies[key] = value;
    });

    req.cookies = cookies;
    if (req.cookies.cookieProfileID != undefined) {
      if (!req.session.isLoggedIn) {
        req.session.isLoggedIn = true;
        req.session.userID = req.cookies.cookieProfileID;
        req.session.role = req.cookies.cookieProfileR
      }
    }
    next();
  }
});

app.use(bodyParser.urlencoded({
  extended: true
}));



app.use("/api", apiRouter);
app.use(DIR + ":site/cop", copRouter);
app.use(DIR + ":site/news", activityRouter);
app.use(DIR + ":site/knowledge", knowledgeRouter);
app.use(DIR + ":site/course", courseRouter);
app.use(DIR + ":site/register", registerRouter);
app.use(DIR + ":site/member", memberRouter);
app.use(DIR + ":site/lms", lmsRouter);
app.use(DIR + ":site/subject", subjectRouter);
app.use(DIR + ":site/survey", surveyRouter);
app.use(DIR + ":site/exam", examRouter);
app.use(DIR + ":site/help", helpRouter);


app.get(DIR + ":site/tt", async (req, res) => {
  res.render("home/tt", {
    title: req.i18n_texts.term_and_condition_breadcrumb,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.term_and_condition_breadcrumb,
      url: "#",
    }, ]
  });
});

app.get(DIR + ":site/aa", async (req, res) => {
  res.render("home/aa", {
    title: req.i18n_texts.term_and_condition_breadcrumb,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.term_and_condition_breadcrumb,
      url: "#",
    }, ]
  });
});

app.get(DIR + ":site/bb", async (req, res) => {
  res.render("home/bb", {
    title: req.i18n_texts.term_and_condition_breadcrumb,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.term_and_condition_breadcrumb,
      url: "#",
    }, ]
  });
});

app.get(DIR + ":site/gg", async (req, res) => {
  res.render("home/gg", {
    title: req.i18n_texts.term_and_condition_breadcrumb,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.term_and_condition_breadcrumb,
      url: "#",
    }, ]
  });
});









app.get(DIR + ":site/pdpa", ifLoggedin, async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");

  res.render("pages/pdpa", {
    title: req.i18n_texts.term_and_condition_breadcrumb,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.term_and_condition_breadcrumb,
      url: "#",
    }, ]
  });
});

app.get(DIR + ":site/calendar", async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");

  res.render("pages/calendar", {
    title: req.i18n_texts.title_calendar,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.title_calendar,
      url: "#",
    }, ]
  });
});

app.get(DIR + ":site/contactus", async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");
  res.render("pages/contactus", {
    title: req.i18n_texts.title_contactus,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.role || 2,
    breadcrumbs: [{
      label: req.i18n_texts.title_contactus,
      url: "#",
    }, ]
  });
});

app.get([DIR + ":site/login", DIR + ":site/login-error"], [ifLoggedin , recaptcha.middleware.render], async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");

  if (req.session.isLoggedIn) {
    res.redirect(ORIGINAL_SOURCE + '/');
  } else {

    let error = false;
    if ((req.originalUrl == DIR + ":site/login-error")) {
      error = true;
    }

    res.render("pages/login", {
      title: req.i18n_texts.title_signin,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      error_page: error,
      ldap: false,
      captcha: res.recaptcha
    });
  }
});

app.post(DIR + ":site/signin", recaptcha.middleware.verify, (req, res) => {

  
      const {
        username,
        password,
        sidebar
      } = req.body;

    if (!req.recaptcha.error || sidebar == 'true') {
      unirest('POST', process.env.API + 'auth/signin')
        .headers({
          'Content-Type': 'application/json'
        })
        .send(JSON.stringify({
          "username": username,
          "password": password,
          "project": global.this_page
        }))
        .end(async function (result) {

          //if (result.error) throw new Error(result.error); 
          if (result.error) {

            if (req.body.page === undefined) {
              res.status(400).send("False");
            } else {

              res.redirect(ORIGINAL_SOURCE + '/login-error?clang=th');
            }

          } else {

            req.session.isLoggedIn = true;
            req.session.userID = result.body.id;
            req.session.role = +result.body.role;
            //console.log(result.body.role);
            //console.log(req.session);
            let realname = result.body.firstname + '  ' + result.body.lastname;

            res.cookie("cookieProfileID", result.body.id, {
              maxAge: 10800000,
              httpOnly: false,
              sameSite: 'strict'
            });
            res.cookie("cookieProfileName", result.body.user, {
              maxAge: 10800000,
              httpOnly: false,
              sameSite: 'strict'
            });
            res.cookie("cookieProfileAvatar", result.body.avatar, {
              maxAge: 10800000,
              httpOnly: false,
              sameSite: 'strict'
            });
            res.cookie("cookieProfileRealName", realname, {
              maxAge: 10800000,
              httpOnly: false,
              sameSite: 'strict'
            });
            res.cookie("cookieProfileR",  +result.body.role, {
              maxAge: 10800000,
              httpOnly: false,
              sameSite: 'strict'
            });

            await logaction(req, res, 'login', 0, 0, 0);

            if (req.body.page === undefined) {
              res.status(200).send("Login");
            } else {

              res.redirect(ORIGINAL_SOURCE + '/?clang=th');
            }

          }
        });
    } else {
        // error code
      res.redirect(ORIGINAL_SOURCE + '/login-error?clang=th');
    }

});


app.get([DIR + ":site/ldap"], ifLoggedin, async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");

  if (req.session.isLoggedIn) {
    res.redirect(ORIGINAL_SOURCE + '/');
  } else {
    res.render("pages/login", {
      title: req.i18n_texts.title_signin,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      error_page: false,
      ldap: true,
      captcha: ''
    });
  }
});
app.get([DIR + ":site/ldap-login-error"], ifLoggedin, async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");

  if (req.session.isLoggedIn) {
    res.redirect(ORIGINAL_SOURCE + '/');
  } else {
    res.render("pages/login", {
      title: req.i18n_texts.title_signin,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      error_page: true,
      ldap: true,
      captcha: ''
    });
  }
});


app.post([DIR + ":site/ldap"], ifLoggedin, async (req, res) => {
  //res.setHeader("Cache-Control", "public, max-age=86400");
  const { authenticate } = require('ldap-authentication')
  const {
    username,
    password
  } = req.body;

    // auth with regular user
    options = {
      ldapOpts: {
        url: process.env.LDAP_HOST,
        // tlsOptions: { rejectUnauthorized: false }
      },
      userDn: `cn=${username},ou=users,dc=nacc,dc=go,dc=th`,
      userPassword: password,
      userSearchBase: 'dc=nacc,dc=go,dc=th',
      usernameAttribute: 'cn',
      username: username,
      // starttls: false
    }
  try {
    ldapUser = await authenticate(options)
    
    await unirest('POST', process.env.API + 'auth/ldap-signin')
    .headers({
      'Content-Type': 'application/json'
    })
    .send(JSON.stringify({
      "username": username,
      "password": password,
      "ldapUser": ldapUser,
      "project": global.this_page
    }))
    .end(async function (result) {

      //if (result.error) throw new Error(result.error); 
      if (result.error) {
        if (req.body.page === undefined) {
          res.status(400).send("False");
        } else {
          res.redirect(ORIGINAL_SOURCE + '/ldap-login-error');
        }
      } else {
        //console.log(result.body , result.body.id)

        req.session.isLoggedIn = true;
        req.session.userID = result.body.id;
        req.session.role = +result.body.role;

        let realname = result.body.firstname + '  ' + result.body.lastname;
        
        res.cookie("cookieProfileID", result.body.id, {
          maxAge: 10800000,
          httpOnly: false,
          sameSite: 'strict'
        });
        res.cookie("cookieProfileName", result.body.user, {
          maxAge: 10800000,
          httpOnly: false,
          sameSite: 'strict'
        });
        res.cookie("cookieProfileAvatar", result.body.avatar, {
          maxAge: 10800000,
          httpOnly: false,
          sameSite: 'strict'
        });
        res.cookie("cookieProfileRealName", realname, {
          maxAge: 10800000,
          httpOnly: false,
          sameSite: 'strict'
        });
        res.cookie("cookieProfileR",  +result.body.role, {
          maxAge: 10800000,
          httpOnly: false,
          sameSite: 'strict'
        });

        await logaction(req, res, 'login', 0, 0, 0);

        if (req.body.page === undefined) {
          res.status(200).send("Login");
        } else {
          res.redirect(ORIGINAL_SOURCE + '/');
        }
      }
    });
  } catch (e) {
    res.redirect(ORIGINAL_SOURCE + '/ldap-login-error');
  }

});

app.get(DIR + ":site/", ValidateLoggedin, async(req, res) => {
  let site = req.params.site;
  //res.setHeader("Cache-Control", "public, max-age=86400");
  if (global.department == 0) {
    //console.log(global.department);

      res.redirect(process.env.HOME_PAGE);

  } else {

    res.render("pages/main", {
      title: req.i18n_texts.title_home,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.role || 2,
      breadcrumb: []
    });
  }
});

// LOGOUT
app.get(DIR + ":site/logout", ValidateLoggedin, async (req, res) => {
  await logaction(req, res, 'lout', 0, 0, 0);
  //session destroy
  req.session.isLoggedIn = false;
  req.session.userID = 0
  req.session.nowInMinutes = 0;
  req.session.role = 2;
  res.clearCookie("cookieProfileID");
  res.clearCookie("cookieProfileName");
  res.clearCookie("cookieProfileAvatar");
  //console.log(req.session );
  //res.status(200).send("Logout");
  res.redirect(ORIGINAL_SOURCE);
});

// app.get("/", (req, res) => {

//   if (DIR != '') {
//     res.redirect(ORIGINAL_SOURCE);
//   }
// });

app.get("/", async (req, res) => {
  const { department_display} = require("./middleware/home");

  let display = await department_display();
    res.render("home/index", {
      mobile: req.useragent.isMobile,
      department_display: display
    });

});

// Middleware เพื่อป้องกันการเข้าถึงหน้าที่ไม่ถูกต้อง
app.use((req, res, next) => {
  const error = new Error('ไม่พบหน้าที่คุณต้องการ');
  error.status = 404;
  next(error);
});

// Error Handling Middleware เพื่อแสดงหน้า 404 หรือข้อความข้อผิดพลาด
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send('เกิดข้อผิดพลาด: ' + err.message);
  //res.render("home/404");
});

app.listen(port, function () {
  const currentDate = new Date(); 
  console.log("CORS-enabled web server listening on port " + port + " Time at "+ currentDate);
});

app
const config = process.env;
const express = require("express");
const bodyParser = require("body-parser");
const unirest = require('unirest');
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;

router.post("/auth/login", async (req, res, next) => {
  let {
    name
  } = req.body;

  let target_api_path = config.API + 'auth/login';

  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json'
    })
    .send(JSON.stringify({
      'name': name
    }))
    .then(async function (result) {

      res.status(200).json({
        access_token: result.body.access_token,
        refresh_token: result.body.refresh_token
      });


    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.post("/auth/refresh", async (req, res, next) => {

  let authorization = req.headers["authorization"];

  let target_api_path = config.API + 'auth/refresh';

  await unirest('POST', target_api_path)
    .headers({
      "Content-Type": "application/json",
      "Authorization": authorization,
    })
    .then(async function (result) {
      console.log(result.body);
      res.status(200).json({
        access_token: result.body.access_token,
        refresh_token: result.body.refresh_token
      });

    })    
    .catch(err => {
      console.error(err);
      res.status(500);
    })


});

router.use(async function (req, res, next) {

  const {
    project
  } = req.body;
  let token = req.headers.authorization;

  if (token != null) {
    access_token = token.replace('Bearer ', '');

    next();
  } else {

    //login
    await unirest('POST', config.API + 'auth/login')
      .headers({
        'Content-Type': 'application/json'
      })
      .send(JSON.stringify({
        "name": project
      }))
      .then(async function (result) {

        if (result.body && result.body.access_token) {
          access_token = result.body.access_token;
          next();
        } else {
          console.error('Missing access_token in the response body.');
          res.status(500);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500);
      })
  }
});


router.post(["/course/pop_course", "/course/recommend", "/course/aside", "/web/highlight", "/web/link", "/survey/recommended", "/news/recommended"], async (req, res) => {

  let {
    lang,
    project
  } = req.body;


  let target_api_path = config.API + 'course/recommend';
  if (req.originalUrl == '/api/course/pop_course') {
    target_api_path = config.API + 'course/pop_course';
  } else if (req.originalUrl == '/api/course/aside') {
    target_api_path = config.API + 'course/aside';
  } else if (req.originalUrl == '/api/web/highlight') {
    target_api_path = config.API + 'web/highlight';
  } else if (req.originalUrl == '/api/web/link') {
    target_api_path = config.API + 'web/link';
  } else if (req.originalUrl == '/api/survey/recommended') {
    target_api_path = config.API + 'survey/recommended';
  } else if (req.originalUrl == '/api/news/recommended') {
    target_api_path = config.API + 'news/recommended';
  }


  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'project': project,
      'lang': lang
    }))
    .then(async function (result) {

      res.status(200).json({
        result: result.body.result,
        data: result.body.data,
        total: result.body.total
      });


    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.post("/web/logs", async (req, res) => {
  let {
    lang,
    project
  } = req.body;

  let target_api_path = config.API + 'web/logs';

  await unirest('GET', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'project': project,
      'lang': lang
    }))
    .then(async function (result) {
      res.status(200).json({
        logs_today: result.body.logs_today,
        logs_month: result.body.logs_month,
        logs_all: result.body.logs_all
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })
});

router.post("/course/page", async (req, res) => {
  let {
    lang,
    project,
    group,
    profileID
  } = req.body;

  let target_api_path = config.API + 'course/page';

  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'lang': lang,
      'project': project,
      'group': group,
      'profileID': profileID
    }))
    .then(async function (result) {
      res.status(200).json({
        result: result.body.result,
        data: result.body.data,
        total: result.body.total,
        group: result.body.group
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })
});

router.post(["/news/like", "/ebook/like"], async (req, res) => {

  let {
    lang,
    project,
    id,
    profile
  } = req.body;

  let target_api_path = config.API + 'news/like';
  if (req.originalUrl == '/api/ebook/like') {
    target_api_path = config.API + 'ebook/like';
  }


  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'project': project,
      'lang': lang,
      'id': id,
      'profile': profile
    }))
    .then(async function (result) {

      res.status(200).json({
        status: result.body.status,
        total: result.body.total
      });

    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.post(["/web/provinces", "/web/districts", "/web/subdistricts"], async (req, res) => {

  let {
    lang
  } = req.body;

  let province = 0;
  let district = 0;
  let target_api_path = config.API + 'web/provinces';
  if (req.originalUrl == '/api/web/districts') {
    target_api_path = config.API + 'web/districts';
    province = req.body.province;
  } else if (req.originalUrl == '/api/web/subdistricts') {
    target_api_path = config.API + 'web/subdistricts';
    district = req.body.district;
  }


  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'lang': lang,
      'province': province,
      'district': district
    }))
    .then(async function (result) {

      res.status(200).json({
        result: result.body.result,
        data: result.body.data,
        total: result.body.total
      });


    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.post(["/course/favorites", "/course/register"], async (req, res) => {

  let {
    lang,
    project,
    course,
    profileID
  } = req.body;

  let target_api_path = config.API + 'course/favorites';
  if (req.originalUrl == '/api/course/register') {
    target_api_path = config.API + 'course/register';
    province = req.body.province;
  }

  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'project': project,
      'lang': lang,
      'course': course,
      'profileID': profileID
    }))
    .then(async function (result) {
      res.status(200).json({
        result: result.body.result
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.patch("/lms/contact-status", async (req, res) => {
  let {
    contact,
    status
  } = req.body;

  let target_api_path = config.API + 'lms/contact-status';

  await unirest('PATCH', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'contact': contact,
      "department": global.department,
      'profileID': req.session.userID,
      'status': status
    }))
    .then(async function (result) {
      res.status(200).json({
        result: result.body.result
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.patch(["/lms/contact"], async (req, res) => {

  let {
    contact,
    msg,
    pageID,
    profileID
  } = req.body;


  let target_api_path = config.API + 'lms/contact';

  await unirest('PATCH', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'contact': contact,
      'msg': msg,
      "department": global.department,
      'pageID': pageID,
      'profileID': profileID
    }))
    .then(async function (result) {
      res.status(200).json({
        result: result.body.result
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.post("/switcher/updatevidtime/:time", async (req, res) => {
  let {
    lessonID,
    pageID,
    ProfileID
  } = req.body;

  let time = req.params.time || 0;

  let target_api_path = config.API + 'switcher/updatevidtime/' + time;

  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'lessonID': lessonID,
      'pageID': pageID,
      'ProfileID': ProfileID
    }))
    .then(async function (result) {
      res.status(200).send('greats');
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })
});

router.get(["/switcher/videomuted/:time"], async (req, res) => {

  let time = req.params.time || 0;

  let target_api_path = config.API + 'switcher/videomuted/' + time;

  await unirest('GET', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .then(async function (result) {
      res.status(200).send('greats');
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.get(["/switcher/videospeed/:time"], async (req, res) => {

  let time = req.params.time || 0;

  let target_api_path = config.API + 'switcher/videospeed/' + time;

  await unirest('GET', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .then(async function (result) {
      res.status(200).send('greats');
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })

});

router.put("/switcher/updatelog", async (req, res) => {
  let {
    duration,
    lessonID,
    pageID,
    ProfileID
  } = req.body;

  let time = req.params.time || 0;

  let target_api_path = config.API + 'switcher/updatelog';

  await unirest('PUT', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'lessonID': lessonID,
      'pageID': pageID,
      'ProfileID': ProfileID,
      'duration': duration
    }))
    .then(async function (result) {
      res.status(200).send('greats');
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })
});

router.post("/switcher/success", async (req, res) => {
  let {
    courseID,
    lessonID,
    pageID,
    ProfileID
  } = req.body;

  let target_api_path = config.API + 'switcher/success';

  await unirest('POST', target_api_path)
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      'lessonID': lessonID,
      'pageID': pageID,
      'ProfileID': ProfileID,
      'courseID': courseID
    }))
    .then(async function (result) {
      res.status(200).send('greats');
    })
    .catch(err => {
      console.error(err);
      res.status(500);
    })
});


router.post("/news/calendar", async (req, res) => {
const {
  lang,
  project,
  start,
  end
} = req.body;
let target_api_path = config.API + 'news/calendar';

await unirest('POST', target_api_path)
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  })
  .send(JSON.stringify({
    'lang': lang,
    'project': project,
    'start': start,
    'end': end
  }))
  .then(async function (result) {
    console.log(result.body);
    res.status(200).json(result.body);    
  })
  .catch(err => {
    console.error(err);
    res.status(500);
  })
});

module.exports = router;
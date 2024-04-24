const config = process.env;
const express = require("express");
const bodyParser = require("body-parser");
const unirest = require('unirest');
const dayjs = require('dayjs');
const {
  validate_path
} = require("../middleware/path_validate");
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

router.get(["/", "/:id([0-9]{0,11})", "/:id([0-9]{0,11})/:page([0-9]{0,11})"], async (req, res) => {

  let category_group = +req.params.id || 0;
  let page = +req.params.page || 1;
  let per_page = parseInt(config.NEWS_PERPAGE);

  await unirest('POST', config.API + 'news/list')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "useragent": req.useragent,
      "category_group": category_group,
      "page_number": page,
      "perpage": config.NEWS_PERPAGE
    }))
    .end(async function (result) {

      let sidebar = result.body.sidebar_data;
      let breadcrumbs_label = '';
      let breadcrumbs_url = 0;
      for (let i = 0; i < sidebar.length; i++) {
        if (result.body.category_group == sidebar[i].category_id) {
          breadcrumbs_label = sidebar[i].category_title;
          breadcrumbs_url = sidebar[i].category_id
        }
      }
      let total_news = +result.body.total_news;
      let pagination = Math.ceil(total_news / per_page);

      let web_data = [];
      for (const [key, value] of Object.entries(result.body.data)) {
       
        let cover;
        if(value['news_cover'] == null){
          cover = config.PATH_SOURCE + '/images/thumb_news.png'
        }else{
          cover = await validate_path(value['news_cover'], config.FILE_PATH );
        }

        web_data.push({
          id: value['news_id'],
          subject: value['news_title'],
          cover: cover,
          news_numlike: value['news_numlike'],
          news_numview: value['news_numview'],
          news_detail: value['news_detail'],
          createby: value['createby'],
          web_date: dayjs(value['web_date']).format('DD MMM YYYY'),
          news_url: value['news_url']
        });
      }

      let breadcrumbs_path_url = "../news";
      let nd2_breadcrumbs = '/' + breadcrumbs_url + '/' + page;

      if (req._parsedUrl.pathname === nd2_breadcrumbs) {
        breadcrumbs_path_url = "../../news";
      } else if (req._parsedUrl.pathname === '/') {
        breadcrumbs_path_url = "./news";
      }

      let pagination_url = breadcrumbs_path_url + "/" + breadcrumbs_url;

      res.render("pages/news", {
        title: breadcrumbs_label,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        breadcrumbs: [{
          label: req.i18n_texts.menu_text_activity2,
          url: breadcrumbs_path_url,
        }, {
          label: breadcrumbs_label,
          url: breadcrumbs_path_url + "/" + breadcrumbs_url,
        }],
        category_active: breadcrumbs_label,
        pagination_url: pagination_url,
        sidebar_datas: sidebar,
        many_news: web_data,
        total_news: total_news,
        pagination: pagination,
        page_active: page,
      });
    });
});

router.get("/detail/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let web_id = +req.params.id || 0;
  
  let view_insert = 0;
  if(req.cookies["view"+web_id] == undefined){
    res.cookie("view"+web_id, 1, {
      maxAge: 10800000,
      httpOnly: false,
      sameSite: 'strict'
    });
    view_insert = 1;
  }


  await unirest('POST', config.API + 'news/detail')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "useragent": req.useragent,
      "web_id": web_id,
      "view": view_insert,
      "profileID": profileID || 0
    }))
    .end(async function (result) {

      if (result.body.total == 0) {
        res.redirect(ORIGINAL_SOURCE);
      } else {

        let web_data = [];  
        let cover;
        if(result.body.data[0].news_cover == null){
          cover = config.PATH_SOURCE + '/images/thumb_news.png'
        }else{
          cover = await validate_path(result.body.data[0].news_cover, config.FILE_PATH );
        }


          web_data = {
            web_id: web_id,
             category_title: result.body.data[0].category_title,
             category_id: result.body.data[0].category_id,
             news_url: result.body.data[0].news_url,
             news_title: result.body.data[0].news_title,
             news_detail: result.body.data[0].news_detail,
             news_numlike: result.body.data[0].news_numlike,
             news_numview: result.body.data[0].news_numview,
             cover: cover,
             likeAction: result.body.data[0].likeAction
          }; 
          //console.log(web_data);
          
        res.render("pages/news_detail", {
          title: web_data.news_title,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          breadcrumbs: [{
              label: req.i18n_texts.menu_text_activity2,
              url: "../../../news",
            },
            {
              label: web_data.category_title,
              url: "./../../../news/" + web_data.category_id,
            }, {
              label: web_data.news_title,
              url: '#',
            }],
            web_data: web_data,
            relate_news: result.body.relate_news,
            page_owner: 'news'
        });
      }
    });
});

module.exports = router;
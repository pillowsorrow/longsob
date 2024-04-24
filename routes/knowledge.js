const config = process.env;
const express = require("express");
const bodyParser = require("body-parser");
const unirest = require('unirest');
const dayjs = require('dayjs');
const locale_th = require('dayjs/locale/th')
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
    ORIGINAL_SOURCE = process.env.PATH_SOURCE + page[1];

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

router.get(["/", "/ebook", "/ebook/:id([0-9]{0,11})", "/ebook/:id([0-9]{0,11})/:page([0-9]{0,11})"], async (req, res) => {
  let category_group = +req.params.id || 0;
  let page = +req.params.page || 1;
  let per_page = parseInt(config.NEWS_PERPAGE);
  let search = req.query.search || 0;

  await unirest('POST', config.API + 'ebook/list')
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
      "perpage": config.NEWS_PERPAGE,
      "search": search
    }))
    .end(async function (result) {
      //console.log(result.body);

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

        let cover = await validate_path(value['book_cover'], config.FILE_PATH );
        let location = await validate_path(value['book_url'], config.FILE_PATH );

        // BOOKFILE
        // let location = 'upload/book/' + value['book_id'];
        // if(value['book_type'] == 1){
        //   location += '/book.pdf';
        // }
        web_data.push({
          id: value['book_id'],
          subject: value['book_title'],
          cover: cover,
          book_detail: value['book_detail'],
          createby: value['createby'],
          web_date: dayjs(value['web_date']).format('DD MMM YYYY'),
          location: location,
          author: config.OWNER_PAGE
        });
      }

      let breadcrumbs_path_url = "../knowledge/ebook";
      let nd2_breadcrumbs = '/ebook/' + category_group;
      let th3_breadcrumbs = nd2_breadcrumbs + '/' + page;

      if (req._parsedUrl.pathname === nd2_breadcrumbs) {
        breadcrumbs_path_url = "../ebook";
      } else if (req._parsedUrl.pathname === th3_breadcrumbs) {
        breadcrumbs_path_url = "../../ebook";
      } else if (req._parsedUrl.pathname === '/ebook') {
        breadcrumbs_path_url = "./ebook";
      }

      let search_path = {
        category_id: 'ebook/' + breadcrumbs_url,
        query: search
      }

      res.render("pages/ebook", {
        title: req.i18n_texts.menu_text_e_book,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        search_placeholder: req.i18n_texts.menu_text_e_book,
        breadcrumbs: [{
          label: req.i18n_texts.menu_text_e_book,
          url: breadcrumbs_path_url,
        }, {
          label: breadcrumbs_label,
          url: breadcrumbs_path_url + "/" + breadcrumbs_url,
        }],
        category_active: breadcrumbs_label,
        sidebar_datas: sidebar,
        many_ebook: web_data,
        total_ebook: total_news,
        pagination: pagination,
        page_active: page,
        search_path: search_path
      });
    });
});

router.get(["/blog", "/blog/:id([0-9]{0,11})", "/blog/:id([0-9]{0,11})/:page([0-9]{0,11})"], async (req, res) => {

  let category_group = +req.params.id || 0;
  let page = +req.params.page || 1;
  let per_page = parseInt(config.NEWS_PERPAGE);
  let search = req.query.search || 0;

  await unirest('POST', config.API + 'ebook/blog')
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
      "perpage": config.NEWS_PERPAGE,
      "search": search
    }))
    .end(async function (result) {
      //console.log(result.body);

      let sidebar = result.body.sidebar_data;

      let breadcrumbs_label = '';
      let breadcrumbs_url = 0;
      for (let i = 0; i < sidebar.length; i++) {
        if (result.body.category_group == sidebar[i].category_id) {
          breadcrumbs_label = sidebar[i].category_title;
          breadcrumbs_url = sidebar[i].category_id
        }

        sidebar[i].category_cover = await validate_path(sidebar[i].category_cover, config.FILE_PATH );
        
      }

      let total_news = +result.body.total_news;
      let pagination = Math.ceil(total_news / per_page);

      let web_data = [];
      dayjs.locale('th')
      for (const [key, value] of Object.entries(result.body.data)) {
        //console.log(value['blog_date']);
        let webdate = dayjs(value['blog_date']).locale('th').format('DD MMMM');
        let web_year = dayjs(value['blog_date']).format('YYYY');
            webdate = webdate + ' ' + (+web_year + 543);

        web_data.push({
          id: value['blog_id'],
          subject: value['blog_title'],
          blog_detail: value['blog_detail'],
          createby: value['createby'],
          web_date: webdate,
          web_time: dayjs(value['blog_date']).locale('th').format('HH:mm'),
          blog_numlike: value['blog_numlike'],
          blog_numview: value['blog_numview'],
          blog_url: value['blog_url'],
          author: value['createby'] || config.OWNER_PAGE
        });
      }

      let breadcrumbs_path_url = "../knowledge/blog";
      let nd2_breadcrumbs = '/blog/' + category_group;
      let th3_breadcrumbs = nd2_breadcrumbs + '/' + page;

      if (req._parsedUrl.pathname === nd2_breadcrumbs) {
        breadcrumbs_path_url = "../blog";
      } else if (req._parsedUrl.pathname === th3_breadcrumbs) {
        breadcrumbs_path_url = "../../blog";
      } else if (req._parsedUrl.pathname === '/blog') {
        breadcrumbs_path_url = "./blog";
      }

      let search_path = {
        category_id: 'blog/' + breadcrumbs_url,
        query: search
      }

      res.render("pages/blog", {
        title: req.i18n_texts.menu_text_e_learning,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.role || 2,
        search_placeholder: req.i18n_texts.menu_text_e_learning,
        breadcrumbs: [{
          label: req.i18n_texts.menu_text_e_learning,
          url: breadcrumbs_path_url,
        }, {
          label: breadcrumbs_label,
          url: breadcrumbs_path_url + "/" + breadcrumbs_url,
        }],
        category_active: breadcrumbs_label,
        sidebar_datas: sidebar,
        many_blog: web_data,
        total_blog: total_news,
        pagination: pagination,
        page_active: page,
        search_path: search_path
      });
    });

});

router.get("/detail/:id([0-9]{0,11})/:text", async (req, res) => {
  let profileID = req.session.userID;
  let web_id = +req.params.id || 0;

  let view_insert = 0;
  if (req.cookies["blog" + web_id] == undefined) {
    res.cookie("blog" + web_id, 1, {
      maxAge: 10800000,
      httpOnly: false,
      sameSite: 'strict'
    });
    view_insert = 1;
  }


  await unirest('POST', config.API + 'ebook/blog_detail')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "useragent": req.useragent,
      "blog_id": web_id,
      "view": view_insert,
      "profileID": profileID || 0
    }))
    .end(async function (result) {

      if (result.body.total == 0) {
        res.redirect(ORIGINAL_SOURCE);
      } else {

        let web_data = [];

        web_data = {
          web_id: web_id,
          category_title: result.body.data[0].category_title,
          category_id: result.body.data[0].category_id,
          news_url: result.body.data[0].news_url,
          news_title: result.body.data[0].news_title,
          news_detail: result.body.data[0].news_detail,
          news_numlike: result.body.data[0].news_numlike,
          news_numview: result.body.data[0].news_numview,
          cover: null,
          likeAction: result.body.data[0].likeAction
        };

        res.render("pages/news_detail", {
          title: req.i18n_texts.menu_text_e_learning,
          isLoggedIn: req.session.isLoggedIn,
          isAdmin: req.session.role || 2,
          breadcrumbs: [{
              label: req.i18n_texts.menu_text_e_learning,
              url: '../../blog/',
            },
            {
              label: web_data.category_title,
              url: "../../blog/" + web_data.category_id,
            }, {
              label: web_data.news_title,
              url: '#',
            }
          ],
          web_data: web_data,
          relate_news: result.body.relate_news,
          page_owner: 'blog'
        });
      }
    });
});

router.post("/couter/:id([0-9]{0,11})", async (req, res) => {
  let ebookID = +req.params.id || 0;
  let profileID = req.session.userID || 0;

  if (req.cookies["ebook" + ebookID] == undefined) {
    res.cookie("ebook" + ebookID, 1, {
      maxAge: 10800000,
      httpOnly: false,
      sameSite: 'strict'
    });

    await unirest('POST', config.API + 'ebook/couter')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    })
    .send(JSON.stringify({
      "lang": req.i18n_lang,
      "department": global.department,
      "useragent": req.useragent,
      "ebookID": ebookID,
      "profileID": profileID || 0
    }))
    .end(async function (result) {
      res.status(200).send('count');
    });
  }else{
    res.status(200).send('greats');
  }
});

module.exports = router;
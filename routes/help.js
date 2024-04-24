const config = process.env;
const express = require("express");
const unirest = require('unirest');
const bodyParser = require('body-parser')
const router = express.Router();

let access_token;
let ORIGINAL_SOURCE = config.PATH_SOURCE;
router.use(async function (req, res, next) {
    profileID = req.session.userID || 0;
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
            access_token = result.body.access_token;
            next();
        });

});

router.get("/", async (req, res) => {
    await unirest('POST', config.API + 'web/manual')
        .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
            "lang": req.i18n_lang,
            "name": global.this_page,
            "useragent": req.useragent,
            "department": global.department
        }))
        .end(async function (result) {

            res.render("pages/manual", {
                title: req.i18n_texts.title_manual,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                breadcrumbs: [{
                    label: req.i18n_texts.title_manual,
                    url: "#",
                }, ],
                data: result.body.data,
                author: config.OWNER_PAGE
            });
        });
});

router.get("/claim", async (req, res) => {

    await unirest('POST', config.API + 'web/claim')
        .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
            "lang": req.i18n_lang,
            "profileID": profileID
        }))
        .end(async function (result) {


            res.render("pages/claim", {
                title: req.i18n_texts.menu_claim,
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.role || 2,
                breadcrumbs: [{
                    label: req.i18n_texts.menu_claim,
                    url: "#",
                }, ],
                departments: result.body.departments,
                department_action: result.body.department_action,
                certificates: result.body.certificate
            });
        });
});

router.use(bodyParser.urlencoded({
    extended: true
}));

router.post("/claim", async (req, res) => {
    const editdata = [];
    const action = req.body.action;

    if(action == 'department'){
        const selectedDepartments = [];
        // วนลูปทุก property ใน req.body
        for (const key in req.body) {
            // ตรวจสอบว่า key เริ่มต้นด้วย 'departments[' และ value เป็น '1'
            if (key.startsWith('departments[') && req.body[key] === '1') {
                // ดึงเลขรหัสแผนกจากชื่อ property และเพิ่มลงในอาร์เรย์
                const departmentId = parseInt(key.match(/\d+/)[0]);
                selectedDepartments.push(departmentId);
            }
        }
        editdata.push(selectedDepartments)
    }else if(action == 'certificate'){
        const selectedCertificate = [];
        // วนลูปทุก property ใน req.body
        for (const key in req.body) {
            // ตรวจสอบว่า key เริ่มต้นด้วย 'departments[' และ value เป็น '1'
            if (key.startsWith('certificate[') && req.body[key] === '1') {
                // ดึงเลขรหัสแผนกจากชื่อ property และเพิ่มลงในอาร์เรย์
                const certificateId = parseInt(key.match(/\d+/)[0]);
                selectedCertificate.push(certificateId);
            }
        }
        editdata.push(selectedCertificate)

    }


    await unirest('POST', config.API + 'web/claim-edit')
        .headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        })
        .send(JSON.stringify({
            "lang": req.i18n_lang,
            "profileID": profileID,
            "editdata": editdata,
            "action": action
        }))
        .end(async function (result) {
            res.redirect(ORIGINAL_SOURCE + "/help/claim");
        });
});
module.exports = router;
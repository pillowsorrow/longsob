const config = process.env;
const express = require("express");
const unirest = require('unirest');

exports.fetchThemeColorFromDatabase = async (req, res, next) => {
    let color_return = '#ED008C';
    await unirest('POST', config.API + 'auth/login')
        .headers({
            'Content-Type': 'application/json'
        })
        .send(JSON.stringify({
            "name": req
        }))
        .then(async function (result) {
  
            access_token = result.body.access_token;
            await unirest('POST', config.API + 'web/color')
                .headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                })
                .send(JSON.stringify({
                    "name": req
                }))
                .then(async function (result) {
  
                    color_return = result.body.color;
                    id_return = result.body.department_id || 0;
                    main_logo = result.body.main_logo || 0;
                });
        });
        
        return color_return + '|' + id_return + '|' + main_logo;

};
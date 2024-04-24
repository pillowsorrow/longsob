const config = process.env;
const express = require("express");
const unirest = require('unirest');

exports.department_display = async (req, res, next) => {
    let department;
    //access_token = result.body.access_token;
    await unirest('POST', config.API + 'web/department')
        .headers({
            'Content-Type': 'application/json'
        })
        .send(JSON.stringify({
            "name": 'PSN'
        }))
        .then(async function (result) {
            department = result.body.data;
        });
        
        return department;

};
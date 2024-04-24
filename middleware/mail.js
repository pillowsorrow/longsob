const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const viewPath = path.resolve(__dirname, '../source/templates/views/');
const partialsPath = path.resolve(__dirname, '../source/templates/partials');
const config = process.env;

exports.sendemail = async (req, res, next) => {
    return new Promise(async (resolve) => {
        var mailOptions = req;
        var transporter = nodemailer.createTransport({
            host: config.EMAIL_HOST,
            secure: config.EMAIL_SECURE,
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS,
            }
        });
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                // partialsDir: viewPath,
                layoutsDir: viewPath,
                defaultLayout: false,
                partialsDir: partialsPath,
                express
            },
            viewPath: viewPath,
            extName: '.handlebars',
        }))

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                resolve();
            } else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });


    });
};
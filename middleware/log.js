const config = process.env;
const unirest = require('unirest');

exports.logaction = async (req, res, type, action, ref, subject) => {

    const userID = res.req.session.userID || 0;

    if (userID > 0) {

        if (req.useragent.isDesktop) {
            agent = req.useragent.browser + ' ' + req.useragent.version;
        } else if (req.useragent.isBot) {
            agent = req.useragent.source;
        } else if (req.useragent.isMobile) {
            agent = req.useragent.os + ' ' + req.useragent.browser + ' ' + req.useragent.version;
        } else {
            agent = 'Unidentified User Agent';
        }
        const platform = req.useragent.platform;


        await unirest('POST', config.API + 'web/logs-insert')
            .headers({
                'Content-Type': 'application/json'
            })
            .send(JSON.stringify({
                "name": global.department,
                "logid": type,
                "logaction": action,
                "idref": ref,
                "logdetail": '',
                "subject_id": subject,
                "uid": userID,
                "platform": platform,
                "agent": agent,
            }))
            .then(async function (result) {

                res.status(200);
            });
    } else {
        res.status(200);
    }

};
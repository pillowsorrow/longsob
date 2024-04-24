var isoffline = false;/*set offline*/
var islinear = false;/*set linear learning*/
var completedWhenDoAllMasteryscore = true;/*set complete condition do all exam, that have masteryscore greater than 0 */
var isResume = true;/* set resume last page when exit */
var treeArray = [
{ parent : "#", id : "chapter1", ispage : false, state : { opened : true }, text : "k2", detail : ""}

,{ parent : "chapter1", id : "chapter1page1", ispage : true, url : "data/k01_2_1/index.html", text : "หน่วยที่ 2 ความละอายและความไม่ทนต่อการทุจริต<br>- เล่นของเล่นอย่างไรดี", detail : "", activity : true, atcp : false,  playicon : true, duration : ""}
,{ parent : "chapter1", id : "chapter1page2", ispage : true, url : "data/k01_2_2/index.html", text : "หน่วยที่ 2 ความละอายและความไม่ทนต่อการทุจริต<br>- คนไหนน่าละอาย", detail : "", activity : true, atcp : false,  playicon : true, duration : ""}

,{ parent : "chapter1", id : "posttest", ispage : true, url : "data/posttest/index.html", text : "แบบทดสอบท้ายบท", detail : "", activity : true, masteryscore : 70, playicon : false, duration : ""}

];/*change here*/

Content = {};

Content.CourseActivity = {
    id: "https://nacc.mylearntime.com/lrs_nacc/k2",/*change here*/
    definition: {
        type: "http://adlnet.gov/expapi/activities/course",
        name: {
            "th-TH": "“รายวิชาเพิ่มเติม การป้องกันการทุจริต” ระดับปฐมวัย "/*change here*/
        },
        description: {
            "th-TH": "“รายวิชาเพิ่มเติม การป้องกันการทุจริต” ระดับปฐมวัย "/*change here*/
        }
    }
};

Content.getContext = function(parentActivityId) {
var ctx = {
contextActivities: {
/*grouping: {
id: Content.CourseActivity.id
}*/
}
};
/*if (parentActivityId !== undefined && parentActivityId !== null) {*/
ctx.contextActivities.parent = {
id: Content.CourseActivity.id,
definition: {
name: Content.CourseActivity.definition.name,
description: Content.CourseActivity.definition.description
}
};
/*}*/
return ctx;
};
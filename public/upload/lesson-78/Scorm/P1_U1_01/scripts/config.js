var isoffline = false;/*set offline*/
var islinear = false;/*set linear learning*/
var completedWhenDoAllMasteryscore = true;/*set complete condition do all exam, that have masteryscore greater than 0 */
var isResume = true;/* set resume last page when exit */
var treeArray = [
{ parent : "#", id : "chapter1", ispage : false, state : { opened : true }, text : "poo1_1", detail : ""}


,{ parent : "chapter1", id : "chapter1page1", ispage : true, url : "data/P01_1_1/index.html", text : "หน่วยที่ 1 การคิดแยกแยะระหว่างผลประโยชน์ส่วนตนและผลประโยชน์ส่วนรวม<br>- ของใช้ส่วนตน", detail : "", activity : true, atcp : false,  playicon : true, duration : ""}
,{ parent : "chapter1", id : "chapter1page2", ispage : true, url : "data/P01_1_2/index.html", text : "หน่วยที่ 1 การคิดแยกแยะระหว่างผลประโยชน์ส่วนตนและผลประโยชน์ส่วนรวม<br>- ของใช้ส่วนรวมภายในบ้าน", detail : "", activity : true, atcp : false,  playicon : true, duration : ""}
,{ parent : "chapter1", id : "chapter1page3", ispage : true, url : "data/P01_1_3/index.html", text : "หน่วยที่ 1 การคิดแยกแยะระหว่างผลประโยชน์ส่วนตนและผลประโยชน์ส่วนรวม<br>- ของใช้ส่วนตน ของใช้ส่วนรวม", detail : "", activity : true, atcp : false,  playicon : true, duration : ""}





,{ parent : "chapter1", id : "posttest", ispage : true, url : "data/posttest/index.html", text : "แบบทดสอบท้ายบท", detail : "", activity : true, masteryscore : 70, playicon : false, duration : ""}

];/*change here*/

Content = {};

Content.CourseActivity = {
    id: "https://nacc.mylearntime.com/lrs_nacc/poo1_1",/*change here*/
    definition: {
        type: "http://adlnet.gov/expapi/activities/course",
        name: {
            "th-TH": "หลักสูตรการป้องกันการทุจริต ระดับประถมศึกษาปีที่ 1 หน่วยที่ 1 "/*change here*/
        },
        description: {
            "th-TH": "หลักสูตรการป้องกันการทุจริต ระดับประถมศึกษาปีที่ 1 หน่วยที่ 1 "/*change here*/
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
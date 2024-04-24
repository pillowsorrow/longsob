var isoffline = false;/*set offline*/
var islinear = true;/*set linear learning*/
var completedWhenDoAllMasteryscore = false;/*set complete condition do all exam, that have masteryscore greater than 0 */
var isResume = true;/* set resume last page when exit */
var treeArray = [


{ parent : "#", id : "chapter1", ispage : false, state : { opened : true }, text : "หลักสูตรสร้างวิทยากรผู้นำการเปลี่ยนแปลงสู่สังคมที่ไม่ทนต่อการทุจริต", detail : ""}

,{ parent : "chapter1", id : "page1", ispage : true, url : "data/m01/index.html", text : "วิขาที่ 3 การประยุกต์หลักความพอเพียงด้วยโมเดล STRONG : จิตพอเพียงต้านทุจริต", detail : "", activity : true, atcp : false, playicon : false, duration : ""}

,{ parent : "chapter1", id : "posttest", ispage : true, url : "data/posttest/index.html", text : "แบบทดสอบหลังเรียน", detail : "", activity : true, masteryscore : 70,  playicon : true, duration : ""}


];/*change here*/

Content = {};

Content.CourseActivity = {
	
    id: "https://www.mylearntime.com/lrs_nacc/lec_03",/*change here*/
    definition: {
        type: "http://adlnet.gov/expapi/activities/course",
        name: {
            "th-TH": "หลักสูตรสร้างวิทยากรผู้นำการเปลี่ยนแปลงสู่สังคมที่ไม่ทนต่อการทุจริต"/*change here*/
        },
        description: {
            "th-TH": "หลักสูตรสร้างวิทยากรผู้นำการเปลี่ยนแปลงสู่สังคมที่ไม่ทนต่อการทุจริต"/*change here*/
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
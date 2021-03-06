const db = require('../services/db');
const date = require('../services/utils/date');

function postSession(request, callback){
    db.query(`INSERT INTO Session (date, studentId, courseId, temperature, luminosity, noise, humidity) VALUES ('${date.convertDate()}','${request.studentId}', '${request.courseId}', '${request.temperature}', '${request.luminosity}', '${request.noise}', '${request.humidity}')`, (response) => {
        return callback(response);
    });
}

function getSessionsByStudent(request, callback){
    db.query(`SELECT * FROM Session WHERE studentId=${request.studentId} AND courseId=${request.courseId}`, (response) => {
        return callback(response);
    });
}

function getLastTenSessionByStudent(request, callback){
    db.query(`SELECT studentId, courseId, noise FROM Session WHERE studentId=${request.studentId} AND courseId=${request.courseId} AND date >= '${date.convertSessionDate(request.sessionDate)}'
             ORDER BY date DESC LIMIT 10`, (response) => {
        var total = 0;
        var avg = response.forEach((element) => {
            total = total + element.noise;
        });
        var data = {
            "studentId": request.studentId,
            "courseId": request.courseId,
            "mean": total / response.length
        }
        return callback(data);
    });
}

function getLastSessionsByStudent(request, callback){
    console.log(date.convertSessionDate(request.sessionDate));
    db.query(`SELECT * FROM Session WHERE studentId=${request.studentId} AND courseId=${request.courseId} AND date >= '${date.convertSessionDate(request.sessionDate)}'`, (response) => {
        return callback(response);
    });
}

module.exports = { postSession, getSessionsByStudent, getLastSessionsByStudent, getLastTenSessionByStudent }

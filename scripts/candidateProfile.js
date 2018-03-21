const async = require("async");
const database = require("./database.js");

/* Returns the candidates info */
exports.getInfo = async function(id) {
    let candidate = await database.select("*", "CandidateProfile", "Candidate_ID", `${id}`);
    let name = candidate[0].First_Name + " " + candidate[0].Last_Name;
    let email = candidate[0].Candidate_Email;
    let technicalSkills = candidate[0].Skills_Technical.split(",");
    let businessSkills = candidate[0].Skills_Business.split(",");
    let culturalSkills = candidate[0].Skills_Cultural.split(",");
    var profileInfo = {
        Name:            `${name}`,
        Email:           `${email}`,
        TechnicalSkills: `${technicalSkills}`,
        BusinessSkills:  `${businessSkills}`,
        CulturalSkills:  `${culturalSkills}`,
    };

    /* Returns the array */
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(profileInfo), 0);
    })
}
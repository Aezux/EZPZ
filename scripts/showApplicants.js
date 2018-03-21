const async = require("async");
const database = require("./database.js");

/* Returns the applicants that applied */
exports.applicantSearch = async function (jobID) {
    let result = [];
    let searchResult = await database.select("*", "ApplicationResults", "Job_Posting_ID", `${jobID}`);

    /* Displays the results */
    for (let i = 0; i < searchResult.length; ++i) {
        let applicant = await database.select("*", "CandidateProfile", "Candidate_ID", `${searchResult[i].Candidate_ID}`);
        let name = applicant[0].First_Name + " " + applicant[0].Last_Name;
        let email = applicant[0].Candidate_Email;
        let technicalSkills = applicant[0].Skills_Technical.split(",");
        let businessSkills = applicant[0].Skills_Business.split(",");
        let culturalSkills = applicant[0].Skills_Cultural.split(",");
        var applicantInfo = {
            Name: `${name}`,
            Email: `${email}`,
            TechnicalSkills: `${technicalSkills}`,
            BusinessSkills: `${businessSkills}`,
            CulturalSkills: `${culturalSkills}`,
        };

        /* Adds the set to the array */
        result.push(applicantInfo);
    }

    /* Returns the array */
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(result), 0);
    })
}

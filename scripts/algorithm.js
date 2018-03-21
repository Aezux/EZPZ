const async = require("async");
const database = require("./database.js");

/* Calculates the score */
async function getScore(array1, array2) {
    return new Promise((resolve, reject) => {
        let score = 0;
        let set = new Set();
        for (let i = 0; i < 5; ++i) {
            score += (array1[i] === array2[i]);
            set.add(array1[i]);
            set.add(array2[i]);
        }
        score += 5 - (set.size - 5);
        setTimeout(() => resolve(score), 0); // Returns the score
    })
}

/* returns an array of the best fit companies */
exports.searchCompanies = async function(candidateID) {
    var posts = [];
    var postScore = [];
    var result = [];

    let candidate = await database.select("*", "CandidateProfile", "Candidate_ID", `${candidateID}`);
    let candidateTechnical = candidate[0].Skills_Technical.split(",");
    let candidateBusiness  = candidate[0].Skills_Business.split(",");
    let candidateCultural  = candidate[0].Skills_Cultural.split(",");

    let posting = await database.select("*", "JobPosting", "", "");
    for (let i = 0; i < posting.length; ++i) {
        let companyName = await database.select("Company_Name", "EmployerProfile", "Employer_ID", `${posting[i].Employer_ID}`);
        let companyPosting = {
            Company: `${companyName[0].Company_Name}`,
            Title: `${posting[i].Job_Title}`,
            Description: `${posting[i].Job_Description}`,
            Salary: `${posting[i].Salary}`,
            Location: `${posting[i].Destination}`
        };

        posts.push(companyPosting);

        let companyTechnical = posting[i].Skills_Technical.split(",");
        let companyBusiness = posting[i].Skills_Business.split(",");
        let companyCultural = posting[i].Skills_Cultural.split(",");

        let score1 = await getScore(candidateTechnical, companyTechnical);
        let score2 = await getScore(candidateBusiness, companyBusiness);
        let score3 = await getScore(candidateCultural, companyCultural);
        postScore.push(Math.ceil(((score1 * 0.50) + (score2 * 0.30) + (score3 * 0.20)) * 10));
    }

    /* Gets the top 5 results */
    for (let i=0; i<5; ++i) {
        let indexOfMaxValue = postScore.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        result.push(posts[indexOfMaxValue]);
        postScore.splice(indexOfMaxValue, 1);
        posts.splice(indexOfMaxValue, 1);
    }

    /* Returns the top 5 results */
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(result), 0);
    })
}

/* Returns an array for best candidates for a job posting */
exports.searchCandidates = async function(postingID) {
    var candidates = [];
    var candidateScore = [];
    var result = [];

    let post = await database.select("*", "JobPosting", "Job_Posting_ID", `${postingID}`);
    let postTechnical = post[0].Skills_Technical.split(",");
    let postBusiness = post[0].Skills_Business.split(",");
    let postCultural = post[0].Skills_Cultural.split(",");

    let candidateList = await database.select("*", "CandidateProfile", "", "");
    for (let i = 0; i < candidateList.length; ++i) {
        let name = candidate[0].First_Name + " " + candidate[0].Last_Name;
        let candidateInfo = {
            Name: `${name}`,
            Email: `${candidate[0].Candidate_Email}`,
            Skills_Business: `${candidate[0].Skills_Business}`,
            Skills_Cultural: `${candidate[0].Skills_Cultural}`,
            Skills_Technical: `${candidate[0].Skills_Technical}`
        };

        candidates.push(candidateInfo);

        let candidateTechnical = candidateList[i].Skills_Technical.split(",");
        let candidateBusiness = candidateList[i].Skills_Business.split(",");
        let candidateCultural = candidateList[i].Skills_Cultural.split(",");

        let score1 = await getScore(postTechnical, candidateTechnical);
        let score2 = await getScore(postBusiness, candidateBusiness);
        let score3 = await getScore(postCultural, candidateCultural);
        candidateScore.push(Math.ceil(((score1 * 0.50) + (score2 * 0.30) + (score3 * 0.20)) * 10));
    }

    /* Gets the top 5 results */
    for (let i = 0; i < 5; ++i) {
        let indexOfMaxValue = candidateScore.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        result.push(candidates[indexOfMaxValue]);
        candidateScore.splice(indexOfMaxValue, 1);
        candidates.splice(indexOfMaxValue, 1);
    }

    /* Returns the top 5 results */
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(result), 0);
    })
}

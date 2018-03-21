const async = require("async");
const database = require("./database.js");

/* Returns the search result */
exports.search = async function(searchOption) {
    let result = [];
    let searchResult = await database.select("*", "JobPosting", "Job_Title", `${searchOption}`);

    /* Displays the results */
    for (let i = 0; i < searchResult.length; ++i) {
        let companyName = await database.select("Company_Name", "EmployerProfile", "Employer_ID", `${searchResult[i].Employer_ID}`);
        var companyPosting = {
            Company: `${companyName[0].Company_Name}`,
            Title: `${searchResult[i].Job_Title}`,
            Description: `${searchResult[i].Job_Description}`,
            Salary: `${searchResult[i].Salary}`,
            Location: `${searchResult[i].Destination}`
        };

        /* Adds the set to the array */
        result.push(companyPosting);
    }

    /* Returns the array */
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(result), 0);
    })
}
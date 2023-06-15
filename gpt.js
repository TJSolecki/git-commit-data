const axios = require('axios');
const fs = require('fs');

// GitHub API endpoint and authentication
const baseURL = 'https://api.github.com';
const owner = "FasterXML";
const repo = "jackson-databind";
const accessToken = process.env.GITHUB_API_KEY;

const headers = {
  auth: `${accessToken}`,
};

async function getCommitCounts() {
  try {
    // Step 3: Retrieve branch information
    const branchesURL = `${baseURL}/repos/${owner}/${repo}/branches`;
    const branchesResponse = await axios.get(branchesURL, { headers });
    const branches = branchesResponse.data;

    console.log(branches);
    // Step 5-7: Retrieve commits and count commits per author
    const commitCounts = {};
    for (const branch of branches) {
      const branchName = branch.name;
      const commitsURL = `${baseURL}/repos/${owner}/${repo}/commits?sha=${branchName}&per_page=100`;
      const commitsResponse = await axios.get(commitsURL, { headers });
      const commits = commitsResponse.data;
      for (const commit of commits) {
        const author = commit.commit.author.name;
        if (author in commitCounts) {
          commitCounts[author]++;
        } else {
          commitCounts[author] = 1;
        }
      }
    }

    // Create JSON object with authors and commit counts
    const commitCountsJSON = JSON.stringify(commitCounts, null, 2);
    fs.writeFileSync("data.json", commitCountsJSON);
    console.log(commitCountsJSON);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getCommitCounts();


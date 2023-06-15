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
      const commitsURL = `${baseURL}/repos/${owner}/${repo}/commits?sha=${branchName}&per_page=100&page=1`;
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
      // if there is more than one page then call a recursive function that will get the commits on subsequent pages
      // so long as there are more pages to check
      // edge case: there is 100 commits on a page but there is no next page
      if(commits.length >= 100) {
        recursiveGetCommitsFromPage(commitCounts, branchName, 2);
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

async function recursiveGetCommitsFromPage(commitCounts, branchName, pageNum) {
  try {
    const commitsURL = `${baseURL}/repos/${owner}/${repo}/commits?sha=${branchName}&per_page=100&page=${pageNum}`;
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

    // Create JSON object with authors and commit counts
    const commitCountsJSON = JSON.stringify(commitCounts, null, 2);
    fs.writeFileSync("data.json", commitCountsJSON);
    console.log(commitCountsJSON);

    // if there is more than one page then call a recursive function that will get the commits on subsequent pages
    // so long as there are more pages to check
    // edge case: there is 100 commits on a page but there is no next page
    if(commits.length >= 100) {
      recursiveGetCommitsFromPage(commitCounts, branchName, pageNum+1);
    }
  } catch (error) {
    console.log(`There is no next page #${pageNum}, error = ${error}`);
  }

}

getCommitCounts();


const { Octokit } = require("octokit");
const githubApiKey = process.env.API_KEY_2;

const authorAndCommitsMade = {};

const octokit = new Octokit({
  auth: githubApiKey
});

const getBranchesOfRepo = async () => {
  const result = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: "FasterXML",
    repo: "jackson-databind",
  }).then( (responce) => {
    const branches = [];
    const branchesMetaData = responce.data;
    for (const branchData of branchesMetaData) {
      // Get the branch
      const branch = branchData.name;
      branches.push(branch)
    }
    console.log(branches);
  for(const b of branches) {
    console.log(b)
    getTitleAndAuthor(b);
  }
  }).catch( (error) => {
    return `There was an error: ${error}`;
  })

}

const getTitleAndAuthor = async (branch) => {
  const result = await octokit.request("GET /repos/{owner}/{repo}/commits/", {
    owner: "FasterXML",
    repo: "jackson-databind",
    branch: branch,
  }).then( (responce) => {
    console.log(`hey from ${branch}`)
    const commits = responce.data;
    console.log(commits);
    for (const commit of commits) {
      // Get the author
      console.log(commit);
      const name = commit.author.login;
      if(authorAndCommitsMade[name] != null){
        authorAndCommitsMade[name]++;
      }
      else {
        authorAndCommitsMade[name] = 1;
      }
    }
    console.log(authorAndCommitsMade);
    return authorAndCommitsMade
  }).catch( (error) => {
    return `There was an error: ${error}`;
  })
};

// getTitleAndAuthor()
async function main() {
  const branches = await getBranchesOfRepo();
  console.log(branches);
  // for(const branch in branches) {
  //   getTitleAndAuthor(branch);
  // }
  // console.log(authorAndCommitsMade);
  // getTitleAndAuthor("master");
}
main();


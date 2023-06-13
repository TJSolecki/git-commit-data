const { Octokit } = require("octokit");
const githubApiKey = process.env.GITHUB_API_KEY;

const octokit = new Octokit({
  auth: githubApiKey
});

const getTitleAndAuthor = async () => {
  const result = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: "FasterXML",
    repo: "jackson-databind",
  }).then( (responce) => {
    const authorAndCommitsMade = {};
    const commits = responce.data;
    for (const commit of commits) {
      // Get the author
      const name = commit.committer.login;
      if(authorAndCommitsMade[name] != null){
        authorAndCommitsMade[name]++;
      }
      else {
        console.log('a')
        authorAndCommitsMade[name] = 1;
      }
    }
    console.log(authorAndCommitsMade);
  }).catch( (error) => {
    return `There was an error: ${error}`;
  })
};

console.log(getTitleAndAuthor());

'use strict';

const github = require('octonode');
const util = require('util');
const fs = require('fs');
const config = require('./config.json');

// Convert fs.readFile into Promise version of the same
const readFile = util.promisify(fs.readFile);

let generateEntryForPr = function (prNumber, sort) {
    return "- id: PR-" + prNumber + "\n" +
        "  name: " + util.format(config.entryName, prNumber) + "\n" +
        "  authority: " + config.entryAuthority + "\n" +
        "  sort: " + sort + "\n" +
        "  keyValues:\n" +
        "  - key: " + config.entryKeyValueKey + "\n" +
        "    value: " + util.format(config.entryKeyValueValue, prNumber) + "\n";
}

exports.fetchConfig = async function (req, res) {
    const client = github.client(config.githubPersonAccessToken)
    const repo = client.repo(config.githubRepository)
    const prsResult = await repo.prsAsync();
    const allPullRequests = prsResult[0];
    let filteredPullRequests = allPullRequests.filter(function (item) {
        return item.state === "open";
    });
    let pullRequestNumbers = filteredPullRequests.map(function (item) {
        return item.number;
    });

    let generatedOutput = "";
    let sort = 110; // start above 100 to leave space for local entries
    pullRequestNumbers
        .sort(function (a, b) {
            // reverse
            return b - a;
        })
        .forEach(function (item) {
            generatedOutput += generateEntryForPr(item, sort++);
        });

    try {
        const fileData = await readFile(config.preconfiguredEntriesFile);
        res.send(fileData + generatedOutput);
    } catch (e) {
        console.log("file '" + config.preconfiguredEntriesFile + "' not found. ", e)
        // file not found so just return generated output
        res.send(generatedOutput);
    }
};

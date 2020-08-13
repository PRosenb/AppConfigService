'use strict';

import github = require('octonode');
import util = require('util');
import fs = require('fs');

let config = require('./config.json');

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

exports.fetchConfig = function (req, res, next) {
    fetchConfigAsync(req, res)
        .catch((reason) => next(reason));
}

const fetchConfigAsync = async function (req, res) {
    let client = github.client(config.githubPersonAccessToken)
    let repo = client.repo(config.githubRepository)
    let prsResult;
    try {
        // noinspection JSUnresolvedFunction
        prsResult = await repo.prsAsync();
    } catch (e) {
        res.status(500).send('Error fetching PRs: ' + e);
        return;
    }

    let allPullRequests = prsResult[0];
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
        let fileData = await readFile(config.preconfiguredEntriesFile);
        res.send(fileData + generatedOutput);
    } catch (e) {
        console.log("file '" + config.preconfiguredEntriesFile + "' not found. ", e)
        // file not found so just return generated output
        res.send(generatedOutput);
    }
};

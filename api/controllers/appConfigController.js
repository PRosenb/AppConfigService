'use strict';

const github = require('octonode');
const util = require('util');
const fs = require('fs');
const config = require('./config.json');

let generateEntryForPr = function (prNumber, sort) {
    return "- id: PR-" + prNumber + "\n" +
        "  name: " + util.format(config.entryName, prNumber) + "\n" +
        "  authority: " + config.entryAuthority + "\n" +
        "  sort: " + sort + "\n" +
        "  keyValues:\n" +
        "  - key: " + config.entryKeyValueKey + "\n" +
        "    value: " + util.format(config.entryKeyValueValue, prNumber) + "\n";
}

exports.fetchConfig = function (req, res) {
    const client = github.client(config.githubPersonAccessToken)
    const repo = client.repo(config.githubRepository)
    repo.prs(function (err, data) {
        if (err != null) {
            console.log(err);
            return
        }

        let filteredPullRequests = data.filter(function (item) {
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

        fs.readFile(config.preconfiguredEntriesFile, 'utf8',
            function (err, data) {
                if (err) {
                    // file not found so just return generated output
                    res.send(generatedOutput);
                } else {
                    res.send(data + generatedOutput);
                }
            });
    });
};

'use strict';

// @ts-ignore
import github = require('octonode');
import util = require('util');
import fs = require('fs');

export class Config {
    githubPersonAccessToken?: string;
    githubRepository?: string;
    entryName: string = "Pull Request %s";
    entryAuthority?: string;
    entryKeyValueKey: string = "START_URL";
    entryKeyValueValue?: string
    preconfiguredEntriesFile: string = "preconfiguredEntries.yaml";
}

interface PullRequest {
    state: string
    number: number
}

// exported for test purpose only
export const config: Config = require('config');
export const client = github.client(config.githubPersonAccessToken)

// Convert fs.readFile into Promise version of the same
const readFile = util.promisify(fs.readFile);

let generateEntryForPr = function (prNumber: number, sort: number) {
    return "- id: PR-" + prNumber + "\n" +
        "  name: " + util.format(config.entryName, prNumber) + "\n" +
        "  authority: " + config.entryAuthority + "\n" +
        "  sort: " + sort + "\n" +
        "  keyValues:\n" +
        "  - key: " + config.entryKeyValueKey + "\n" +
        "    value: " + util.format(config.entryKeyValueValue, prNumber) + "\n";
}

// @ts-ignore
export const fetchConfig = function (req, res, next) {
    fetchConfigAsync(req, res)
        .catch((reason) => next(reason));
}

// exported for test purpose only
// @ts-ignore
export const fetchConfigAsync = async function (req, res) {
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
    let filteredPullRequests = allPullRequests.filter(function (item: PullRequest) {
        return item.state === "open";
    });
    let pullRequestNumbers = filteredPullRequests.map(function (item: PullRequest) {
        return item.number;
    });

    let generatedOutput = "";
    let sort = 110; // start above 100 to leave space for local entries
    pullRequestNumbers
        .sort(function (a: number, b: number) {
            // reverse
            return b - a;
        })
        .forEach(function (prNumber: number) {
            generatedOutput += generateEntryForPr(prNumber, sort++);
        });

    try {
        let fileData = await readFile(config.preconfiguredEntriesFile);
        res.send(fileData + generatedOutput);
    } catch (e) {
        console.log("file '" + config.preconfiguredEntriesFile + "' not found. ")
        // file not found so just return generated output
        res.send(generatedOutput);
    }
};

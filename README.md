# App Config Service
https://github.com/PRosenb/AppConfigService

This service belongs to the project [AppConfig](https://github.com/PRosenb/AppConfig), please also see details there.

## Description
The service AppConfigService is a simple, Node based service written in TypeScript
that fetches Pull Requests of a given Github repo and serves them to the [App Config App](https://github.com/PRosenb/AppConfigApp/).

## Config file
The config files in the directory `config` define the settings of the service.

```` JSON
{
  "githubPersonAccessToken": "yourGithubPersonAccessToken",
  "githubRepository": "group/repo",
  "entryName": "Pull Request %s",
  "entryAuthority": "com.example.config",
  "entryKeyValueKey": "START_URL",
  "entryKeyValueValue": "https://pr-%s.example.com/",
  "preconfiguredEntriesFile": "preconfiguredEntries.yaml"
}
````

## Preconfigured Entries
Config entries which should always be available are configured as preconfigured entries. Adjust the file
`preconfiguredEntires.yaml` accordingly or create a new file and refer to it in the config above.

```` YAML
- id: trabr-prod
  name: Trabr Prod
  authority: com.trabr.config
  sort: 100
  keyValues:
    - key: START_URL
      value:
- id: trabr-testpage
  name: Trabr Test Page
  authority: com.trabr.config
  sort: 999
  keyValues:
    - key: START_URL
      value: https://trabr.pete.ch/test-page/
````

## Contributions ##
Enhancements and improvements are welcome.

## License ##
``` text
AppConfigService
Copyright (c) 2020 Peter Rosenberg (https://github.com/PRosenb).

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

import 'mocha';
import {expect} from 'chai';

import {client, config, fetchConfigAsync} from '../src/api/controllers/appConfigController';

const initConfig = function () {
    config.githubPersonAccessToken = null;
    config.githubRepository = null;
    config.entryName = "PR %s";
    config.entryAuthority = "com.test.config";
    config.entryKeyValueKey = "START_URL";
    config.entryKeyValueValue = "https://pr-%s.test.com/";
    config.preconfiguredEntriesFile = null;
}

describe('AppConfigService', () => {

    it('without preconfiguration', async () => {
        // given
        initConfig();
        let result: string = null;
        let res = {
            send(content: string) {
                result = content;
            }
        };
        client.repo = function () {
            return {
                prsAsync() {
                    return [[
                        {state: "open", number: 32},
                        {state: "open", number: 31},
                        {state: "closed", number: 34}
                    ]];
                }
            }
        }

        // when
        await fetchConfigAsync({}, res);
        // then
        expect(result).to
            .equal(
                '- id: PR-32\n'
                + '  name: PR 32\n'
                + '  authority: com.test.config\n'
                + '  sort: 110\n  keyValues:\n'
                + '  - key: START_URL\n'
                + '    value: https://pr-32.test.com/\n'
                + '- id: PR-31\n'
                + '  name: PR 31\n'
                + '  authority: com.test.config\n'
                + '  sort: 111\n  keyValues:\n'
                + '  - key: START_URL\n'
                + '    value: https://pr-31.test.com/\n');
    });
});

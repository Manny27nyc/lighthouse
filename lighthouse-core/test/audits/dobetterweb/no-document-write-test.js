/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const DocWriteUseAudit = require('../../../audits/dobetterweb/no-document-write.js');
const assert = require('assert').strict;

const URL = 'https://example.com';

/* eslint-env jest */

describe('Page does not use document.write()', () => {
  it('passes when document.write() is not used', async () => {
    const auditResult = await DocWriteUseAudit.audit({
      ConsoleMessages: [],
      URL: {finalUrl: URL},
      SourceMaps: [],
      Scripts: [],
    }, {computedCache: new Map()});
    assert.equal(auditResult.score, 1);
    assert.equal(auditResult.details.items.length, 0);
  });

  it('fails when document.write() is used', async () => {
    const text = 'Do not use document.write';
    const auditResult = await DocWriteUseAudit.audit({
      URL: {finalUrl: URL},
      ConsoleMessages: [
        {source: 'violation', url: 'https://example.com/', text},
        {source: 'violation', url: 'https://example2.com/two', text},
        {source: 'violation', url: 'http://abc.com/', text: 'Long event handler!'},
        {source: 'deprecation', url: 'https://example.com/two'},
      ],
      SourceMaps: [],
      Scripts: [],
    }, {computedCache: new Map()});
    assert.equal(auditResult.score, 0);
    assert.equal(auditResult.details.items.length, 2);
  });
});

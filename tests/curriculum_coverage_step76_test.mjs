import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CURRICULUM_COVERAGE_TRACE, CURRICULUM_AUDIT_TOPICS, REUSABLE_VISUAL_SYSTEM_EVIDENCE, runCurriculumCoverageAudit } from '../src/scripts/curriculum-coverage-audit.js';
const result=runCurriculumCoverageAudit();
assert.equal(result.ok,true,result.findings.join('\n'));
assert.equal(result.sectionsAudited,34,'Sections 5-39 excluding cross-cutting Section 17 must be traced');
assert.equal(result.topicsAudited,33,'all implemented curriculum/review/mastery topics must participate in the audit');
assert.equal(new Set(CURRICULUM_COVERAGE_TRACE.map(r=>r.section)).size,CURRICULUM_COVERAGE_TRACE.length);
assert.ok(CURRICULUM_COVERAGE_TRACE.some(r=>r.section===15&&r.scope==='placement-rule'));
assert.equal(CURRICULUM_AUDIT_TOPICS.find(t=>t.topicId==='topic:y13:integration:areas').scopeId,'y13-additional');
for(const file of REUSABLE_VISUAL_SYSTEM_EVIDENCE){assert.ok(fs.existsSync(path.resolve('src/scripts',file)),`Section 17 visual evidence missing: ${file}`);}
console.log('Step 76 curriculum/planning coverage audit: PASS');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { integrationAreaTopic } from '../src/scripts/topic-content/integration-area.js';
import { integrationAreaLearningModes } from '../src/scripts/integration-area-activities.js';
import { INTEGRATION_AREA_POSITIVE_FUNCTIONS, betweenCurvesAreaState } from '../src/scripts/integration-area-model.js';
import { year13AreasTopic } from '../src/scripts/topic-content/year13-areas.js';

const betweenId='activity:y12:integration:area:understand:between-positive-curves';
const betweenActivities=integrationAreaLearningModes.understand.activities.filter(activity=>activity.activityId===betweenId);
assert.equal(betweenActivities.length,1,'Step 8 should add/refine one compact Year 12 between-curves introduction rather than duplicate the Year 13 topic.');

const betweenActivity=betweenActivities[0];
assert.match(betweenActivity.title,/top minus bottom/i);
assert.match(betweenActivity.body,/top curve.*bottom curve/i);
assert.match(betweenActivity.formula,/top area.*bottom area/i);

const top=INTEGRATION_AREA_POSITIVE_FUNCTIONS.find(definition=>definition.id==='integration-area-linear');
const bottom=INTEGRATION_AREA_POSITIVE_FUNCTIONS.find(definition=>definition.id==='integration-area-quadratic');
assert(top&&bottom,'Step 8 requires the simple line/quadratic pair.');
assert.equal(top.evaluate(0),bottom.evaluate(0),'The simple curves should intersect at x=0.');
assert.equal(top.evaluate(2),bottom.evaluate(2),'The simple curves should intersect at x=2.');
for(let x=0;x<=2;x+=0.1) assert(top.evaluate(x)>=bottom.evaluate(x)-1e-9,'The line must remain the top curve on 0 <= x <= 2.');
const area=betweenCurvesAreaState(top,bottom,0,2);
assert(Math.abs(area.difference-2/3)<1e-6,'The simple Year 12 area-between-curves example should have area 2/3.');

const source=readFileSync(new URL('../src/scripts/integration-area-understand.js',import.meta.url),'utf8');
const start=source.indexOf(' render_between_positive_curves(){');
const end=source.indexOf(' render_visual_properties(){',start);
assert(start>=0&&end>start,'The dedicated Step 8 Understand page must exist.');
const betweenSource=source.slice(start,end);

assert.match(betweenSource,/Required area = area under top curve − area under bottom curve/,'The geometric construction must be stated explicitly.');
assert.match(betweenSource,/Show area under top A\(x\)/,'Students must be able to highlight the top component area.');
assert.match(betweenSource,/Show area under bottom B\(x\)/,'Students must be able to highlight the bottom component area.');
assert.match(betweenSource,/Show required region/,'Students must be able to highlight the resulting area-between-curves region.');
assert.match(betweenSource,/aria-pressed/,'The visual stage controls must expose their selected state accessibly.');
assert.match(betweenSource,/aria-live/,'The changing highlighted stage must be announced.');
assert.match(betweenSource,/meet at x=0 and x=2/,'The Year 12 example must use simple explicit intersections.');
assert.doesNotMatch(betweenSource,/substitution|partial fractions|integration by parts/i,'The Year 12 page must not teach Year 13 integration techniques.');
assert.match(betweenSource,/Go to Year 13 Areas/,'The Year 12 page must link forward to the advanced topic.');
assert.match(betweenSource,/activity:y13:integration:areas:understand:construction-visual/,'The forward link must target the Year 13 area-construction introduction.');

const betweenMetadata=integrationAreaTopic.activities.filter(activity=>activity.activityId===betweenId);
assert.equal(betweenMetadata.length,1,'Topic metadata should contain one Year 12 between-curves Understand activity.');
assert.equal(betweenMetadata[0].mode,'understand');

const year13Slugs=new Set(year13AreasTopic.activities.map(activity=>activity.slug));
assert(year13Slugs.has('full-toolkit'),'Year 13 Areas must retain the full integration toolkit page.');
assert(year13Slugs.has('advanced-techniques'),'Year 13 Areas must retain advanced-technique practice.');
assert(year13Slugs.has('split-when-needed'),'Year 13 Areas must remain responsible for split regions.');
const methodSkill=year13AreasTopic.microSkills.find(item=>item.slug==='method-selection');
assert(methodSkill,'Year 13 Areas must retain method selection.');
assert.match(methodSkill.title,/integration method/i);

console.log('PASS Original-prompt audit Step 8 Year 12 area-between-curves introduction');

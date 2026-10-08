'use strict';
// Run from any directory: node quadratic-vault/tests/root-rescue.test.cjs
const assert = require('node:assert/strict');
const M = require('../root-rescue.js');
let seed = 1703;
const rng = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
let total = 0;
for (let area = 0; area < 4; area++) for (let slot = 0; slot < 3; slot++) for (let i = 0; i < 1000; i++) {
  const q = M.makeQuestion(area, slot, rng); total++;
  assert.equal(q.b, q.p + q.q); assert(q.c === q.p * q.q);
  assert.equal(q.leftB - q.rx, q.b); assert.equal(q.leftC - q.rc, q.c);
  for (const x of q.roots) assert.equal(x * x + q.leftB * x + q.leftC, q.rx * x + q.rc);
  assert(M.factorMatch(q, q.p, q.q)); assert(M.factorMatch(q, q.q, q.p));
  assert(!M.factorMatch(q, q.p + 1, q.q));
  assert(M.rootMatch(q, q.roots)); assert(M.rootMatch(q, [...q.roots].reverse()));
  if (q.roots[0] !== q.roots[1]) assert(!M.rootMatch(q, [q.roots[0], q.roots[0]]));
  else assert(M.rootMatch(q, [q.roots[0]]));
  if (area === 0) assert(q.p * q.q > 0 && q.p !== q.q);
  if (area === 1) assert(q.p * q.q < 0);
  if (area === 2 && slot === 1) assert(q.roots.includes(0));
  if (area === 3) assert(q.rx !== 0 || q.rc !== 0);
}
for (const x of ['', '-', '1.2', '1e3', '2+3', 'x=4', 'Infinity', 'NaN', '<img>']) assert.equal(M.integer(x), null);
assert.equal(M.integer(' +4 '), 4); assert.equal(M.integer('\u22124'), -4); assert.equal(M.integer('-0'), 0);
assert.equal(M.plan('all').length, 12); assert.equal(M.plan('2').length, 3);
assert.throws(() => M.plan('8')); assert.throws(() => M.makeQuestion(4, 0));
assert(M.rootMatch({ roots: [0, 0] }, [0]));
assert.equal(M.factors(0, -6), 'x(x \u2212 6)');
console.log(`PASS ${total} generated equations, integer validation, repeated/zero roots, all missions.`);

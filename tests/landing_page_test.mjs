import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

for (const path of ["src/index.html", "index.html", "404.html"]) {
  const html = read(path);
  assert.match(html, /data-landing-page/, `${path} should include the course landing page.`);
  assert.match(html, /Understand it\. Remember it\. Practise it\. Explain it\. Apply it\./);
  assert.match(html, /AO1 · Practise/);
  assert.match(html, /Use and apply standard techniques/);
  assert.match(html, /AO2 · Explain/);
  assert.match(html, /Reason, interpret and communicate/);
  assert.match(html, /AO3 · Apply/);
  assert.match(html, /Solve problems in context/);
  assert.match(html, /Topic goals/);
  assert.match(html, /Need a reminder\?/);
  assert.match(html, /Word Bank/);
  assert.match(html, /ClassWiz/);
  assert.match(html, /Generated questions/);
  assert.match(html, /Progress &amp; Data/);
  assert.match(html, /data-landing-enter-topic="topic:y12:foundations:pre-calculus"/);
  assert.match(html, /data-landing-enter-topic="topic:y13:differentiation:standard-functions"/);
  assert.match(html, /data-landing-enter-topic="topic:full:review:full-calculus-mastery"/);
}

assert.match(read("src/index.html"), /<a class="brand" data-brand-home href="\.\/" aria-label="Calculus home">/);
for (const path of ["index.html", "404.html"]) {
  assert.match(read(path), /<a class="brand" data-brand-home href="\/alevel-calculus\/" aria-label="Calculus home">/);
}

const app = read("src/scripts/app-shell.js");
assert.match(app, /function isLandingPath\(pathname\)/);
assert.match(app, /clean === "\/" \|\| clean === "\/alevel-calculus"/);
assert.match(app, /function showLanding/);
assert.match(app, /function showWorkspace/);
assert.match(app, /function openLandingTopic/);
assert.match(app, /initialLandingRequested/);
assert.match(app, /if \(initialLandingRequested && landingPage && appBody\)/);
assert.match(app, /if \(isLandingPath\(browserLocation\.pathname\)\)/);
assert.match(app, /data-landing-enter-topic/);

const sourceCss = read("src/styles/landing-page.css");
const publishedCss = read("styles/landing-page.css");
assert.equal(sourceCss, publishedCss, "Source and published landing-page styles must stay mirrored.");
assert.match(sourceCss, /\.landing-page\[hidden\]/);
assert.match(sourceCss, /\.landing-mode-grid/);
assert.match(sourceCss, /\.landing-tool-grid/);
assert.match(sourceCss, /@media \(max-width: 780px\)/);

console.log("PASS landing page course guide, AO explanations, entry points and root/home behaviour");

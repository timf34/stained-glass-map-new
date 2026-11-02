import fs from 'node:fs';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';
const load = folder => fs.readdirSync(`src/content/${folder}`).filter(f => f.endsWith('.yaml')).map(file => ({file, data: yaml.load(fs.readFileSync(`src/content/${folder}/${file}`, 'utf8'))}));
const artists = new Set(load('artists').map(({data}) => data.slug));
const locations = load('locations');
let windows = 0, creditedPhotos = 0;
for (const {file, data} of locations) {
  assert(data.coordinates[0] > 51 && data.coordinates[0] < 56, `${file}: latitude`);
  assert(data.coordinates[1] > -11 && data.coordinates[1] < -5, `${file}: longitude`);
  for (const window of data.windows) {
    windows++;
    assert(!window.artist || artists.has(window.artist), `${file}: unknown artist`);
    for (const image of window.images) {
      if (image.url.startsWith('/')) assert(fs.existsSync(`public${image.url}`), `${file}: missing ${image.url}`);
      if (image.url.startsWith('/images/researched/')) {
        creditedPhotos++;
        for (const key of ['credit', 'license', 'license_url', 'source_url', 'original_url']) assert(image[key], `${file}: missing ${key}`);
        for (const key of ['license_url', 'source_url', 'original_url']) assert.equal(new URL(image[key]).protocol, 'https:');
      }
    }
  }
}
console.log(`Validated ${locations.length} locations, ${windows} windows, ${artists.size} artists and ${creditedPhotos} credited photographs.`);

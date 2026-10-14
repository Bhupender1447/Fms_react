import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(path.join(__dirname, 'tokens.css'), 'utf8');
const parse = (block) => Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
const brand = parse(css.split(':root {')[1].split('}')[0]);
const light = parse(css.split(":root, [data-iso-theme='light'] {")[1].split('}')[0]);
const dark = parse(css.split("[data-iso-theme='dark'] {")[1].split('}')[0]);
function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}

test.each([['light', light], ['dark', dark]])('%s burgundy theme retains readable text, status and focus contrast', (_, theme) => {
  const tokens = { ...brand, ...light, ...theme };
  const resolve = (key) => tokens[key].startsWith('var(') ? resolve(tokens[key].slice(4, -1)) : tokens[key];
  expect(tokens['--iso-burgundy']).toBe('#710D2D');
  const pairs = [['text', 'surface', 4.5], ['muted', 'surface', 4.5], ['on-primary', 'primary', 4.5], ['info', 'info-bg', 4.5], ['success', 'success-bg', 4.5], ['warning', 'warning-bg', 4.5], ['danger', 'danger-bg', 4.5], ['focus', 'surface', 3]];
  for (const [foreground, background, minimum] of pairs) {
    const a = luminance(resolve('--iso-' + foreground));
    const b = luminance(resolve('--iso-' + background));
    expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(minimum);
  }
});

console.log('Patching webmanifest');

import fs from "fs/promises";
const file = './public/manifest.webmanifest'
const [shortName, fullName] = process.argv.slice(2);

// Below statements must be wrapped inside the 'async' function:
const data = await fs.readFile(file, 'utf8');
let result = data.replace(/DC3S Dev/g, shortName).replace(/DC3S-BT Development/g, fullName);
await fs.writeFile(file, result,'utf8');
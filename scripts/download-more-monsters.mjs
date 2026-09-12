import fs from 'fs';

const list = [
  'abyss-herald', 'abyss-lector', 'abyss-mage', 'bathysmal-vishap',
  'consecrated-beast', 'eye-of-the-storm', 'fatui-agent', 'fatui-cicin-mage',
  'fatui-skirmisher', 'floating-fungus', 'geovishap', 'hilichurl',
  'hilichurl-shooter', 'kairagi', 'large-slime', 'mitachurl', 'lawachurl',
  'ruin-guard', 'ruin-grader', 'ruin-hunter', 'specter', 'whopperflower'
];

async function run() {
  for (const id of list) {
    const p = `public/images/monsters/${id}.png`;
    if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
      console.log('Already exists:', id);
      continue;
    }
    try {
      const res = await fetch(`https://genshin.jmp.blue/enemies/${id}/icon`);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 500) {
          fs.writeFileSync(p, buf);
          console.log('Downloaded:', id, buf.length);
        }
      } else {
        console.log('Not ok:', id, res.status);
      }
    } catch(e) {
      console.log('Error:', id, e.message);
    }
  }
}
run();

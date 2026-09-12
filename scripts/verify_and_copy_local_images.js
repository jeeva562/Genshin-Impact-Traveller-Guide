const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'characters');

const charList = ['mizuki', 'lan-yan', 'lanyan', 'lohen', 'varesa', 'mualani', 'xilonen', 'chasca', 'mavuika', 'citlali', 'ororon'];

charList.forEach(cid => {
    const mainPng = path.join(targetDir, `${cid}.png`);
    if (fs.existsSync(mainPng)) {
        fs.copyFileSync(mainPng, path.join(targetDir, `${cid}-icon.png`));
        fs.copyFileSync(mainPng, path.join(targetDir, `${cid}-splash.png`));

        // Remove svg fallback if it exists so Next.js image component loads PNG directly
        const svgPath = path.join(targetDir, `${cid}.svg`);
        if (fs.existsSync(svgPath)) {
            fs.unlinkSync(svgPath);
        }
        console.log(`✔ Configured official PNG assets for ${cid}`);
    }
});

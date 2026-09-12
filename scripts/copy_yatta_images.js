const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'characters');

['mizuki', 'lan-yan'].forEach(cid => {
    const srcPng = path.join(dir, `${cid}.png`);
    if (fs.existsSync(srcPng)) {
        fs.copyFileSync(srcPng, path.join(dir, `${cid}-icon.png`));
        fs.copyFileSync(srcPng, path.join(dir, `${cid}-splash.png`));

        if (cid === 'lan-yan') {
            fs.copyFileSync(srcPng, path.join(dir, 'lanyan.png'));
            fs.copyFileSync(srcPng, path.join(dir, 'lanyan-icon.png'));
            fs.copyFileSync(srcPng, path.join(dir, 'lanyan-splash.png'));
        }

        // Delete any old SVG fallback files so PNG is used 100%
        const svgPath = path.join(dir, `${cid}.svg`);
        if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);

        console.log(`✔ Successfully configured official PNG for ${cid}`);
    }
});

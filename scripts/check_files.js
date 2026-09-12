const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'characters');
const files = ['mizuki.png', 'lan-yan.png', 'lanyan.png', 'lohen.png', 'varesa.png'];

files.forEach(f => {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
        const stats = fs.statSync(p);
        console.log(`${f}: ${stats.size} bytes`);
    } else {
        console.log(`${f}: NOT FOUND`);
    }
});

const fs = require('fs');

const content = fs.readFileSync('client/src/constants/data.js', 'utf-8');

let sql = '-- Seed CMS Data from static files\n\n';

// Leaders
sql += 'INSERT INTO leaders (name, role, designation, bio, image_url, phone, display_order) VALUES\n';
const leaderMatches = [...content.matchAll(/name:\s*"(.*?)",\s*role:\s*"(.*?)",(?:[^]*?)bio:\s*"(.*?)",\s*image:\s*"(.*?)"(?:,\s*isPresident:\s*(true|false))?,\s*phones:\s*\["(.*?)"\]/gs)];

const escapeSql = (str) => str ? str.replace(/'/g, "''") : str;

if (leaderMatches.length > 0) {
    const leaderValues = leaderMatches.map((m, idx) => {
        const isPres = m[5] === 'true';
        const designation = isPres ? 'President' : 'Leader';
        // Replace /upload/ with /uploads/ for unified backend serving
        const imageUrl = m[4].replace('/upload/', '/uploads/');
        return `('${escapeSql(m[1])}', '${escapeSql(m[2])}', '${escapeSql(designation)}', '${escapeSql(m[3])}', '${escapeSql(imageUrl)}', '${escapeSql(m[6])}', ${idx})`;
    }).join(',\n');
    sql += leaderValues + ';\n\n';
}

// Gallery
sql += 'INSERT INTO gallery_images (image_url, span_classes, display_order) VALUES\n';
const galleryMatches = [...content.matchAll(/src:\s*"(.*?)",\s*span:\s*"(.*?)"/g)];
if (galleryMatches.length > 0) {
    const galleryValues = galleryMatches.map((m, idx) => {
        const imageUrl = m[1].replace('/upload/', '/uploads/');
        return `('${escapeSql(imageUrl)}', '${escapeSql(m[2])}', ${idx})`;
    }).join(',\n');
    sql += galleryValues + ';\n';
}

fs.writeFileSync('migrations/004_seed_cms_data.sql', sql);
console.log('Seed file generated successfully with ' + leaderMatches.length + ' leaders and ' + galleryMatches.length + ' gallery images.');

/**
 * Production DB Path Fix Script
 * --------------------------------
 * Use this AFTER you have manually moved files on the production server:
 *   - /uploads/somefile.jpg  →  /uploads/leaders_img/somefile.jpg
 *   - /uploads/somefile.jpg  →  /uploads/gallery_img/somefile.jpg
 *
 * This script ONLY updates the database URL paths.
 * It does NOT move any files.
 *
 * Run with: node scratch/fix_db_image_paths.js
 */

const { query } = require('../config/db');

async function fixTablePaths(tableName, urlColumn, newSubPath) {
    // Find all records where image is still pointing to root /uploads/
    // (i.e., path has exactly one level: /uploads/filename, not /uploads/subdir/filename)
    const [rows] = await query(
        `SELECT id, ${urlColumn} FROM ${tableName} 
         WHERE ${urlColumn} IS NOT NULL 
           AND ${urlColumn} LIKE '/uploads/%'
           AND ${urlColumn} NOT LIKE '/uploads/%/%'`
    );

    console.log(`\n[${tableName}] Found ${rows.length} records with root-level paths...`);
    let updated = 0;
    let errors = 0;

    for (const row of rows) {
        const oldUrl = row[urlColumn]; // e.g. /uploads/somefile.jpg
        const filename = oldUrl.replace('/uploads/', ''); // somefile.jpg
        const newUrl = `/uploads/${newSubPath}/${filename}`;

        try {
            await query(
                `UPDATE ${tableName} SET ${urlColumn} = ? WHERE id = ?`,
                [newUrl, row.id]
            );
            console.log(`  [OK]  id=${row.id}: ${oldUrl}  →  ${newUrl}`);
            updated++;
        } catch (err) {
            console.error(`  [ERR] id=${row.id}: ${err.message}`);
            errors++;
        }
    }

    console.log(`[${tableName}] Done: ${updated} updated, ${errors} errors.`);
    return updated;
}

async function run() {
    console.log('======================================');
    console.log('  Production DB Image Path Fixer');
    console.log('======================================');
    console.log('\nMake sure you have already moved:');
    console.log('  /uploads/*.jpg  →  /uploads/leaders_img/*.jpg  (for leaders)');
    console.log('  /uploads/*.jpg  →  /uploads/gallery_img/*.jpg  (for gallery)');
    console.log('\nStarting DB update...');

    try {
        const leadersUpdated = await fixTablePaths('leaders', 'image_url', 'leaders_img');
        const galleryUpdated = await fixTablePaths('gallery_images', 'image_url', 'gallery_img');

        const total = leadersUpdated + galleryUpdated;
        console.log(`\n✅ All done! Total records updated: ${total}`);
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

run();

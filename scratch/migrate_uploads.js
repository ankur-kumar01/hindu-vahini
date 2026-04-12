/**
 * One-time migration script:
 * Moves existing leader & gallery images from /uploads root
 * into their correct subdirectories and updates the database paths.
 * 
 * Run ONCE with: node scratch/migrate_uploads.js
 */

const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');

const uploadDir = path.join(__dirname, '../uploads');
const leadersDir = path.join(uploadDir, 'leaders_img');
const galleryDir = path.join(uploadDir, 'gallery_img');

// Ensure target dirs exist
if (!fs.existsSync(leadersDir)) fs.mkdirSync(leadersDir, { recursive: true });
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });

async function migrateTable(tableName, urlColumn, targetDir, targetSubPath) {
    // Fetch all rows where the image is in root /uploads (not in a subfolder)
    const [rows] = await query(
        `SELECT id, ${urlColumn} FROM ${tableName} WHERE ${urlColumn} IS NOT NULL AND ${urlColumn} NOT LIKE '/uploads/%/%'`
    );

    console.log(`\n[${tableName}] Found ${rows.length} records to migrate...`);
    let moved = 0, skipped = 0, errors = 0;

    for (const row of rows) {
        const oldUrl = row[urlColumn]; // e.g. /uploads/somefile.jpg
        const filename = path.basename(oldUrl); // somefile.jpg
        const oldPath = path.join(uploadDir, filename);
        const newPath = path.join(targetDir, filename);
        const newUrl = `/uploads/${targetSubPath}/${filename}`;

        if (!fs.existsSync(oldPath)) {
            console.log(`  [SKIP] File not found on disk: ${oldPath}`);
            skipped++;
            continue;
        }

        try {
            // Move file
            fs.renameSync(oldPath, newPath);
            // Update DB
            await query(`UPDATE ${tableName} SET ${urlColumn} = ? WHERE id = ?`, [newUrl, row.id]);
            console.log(`  [OK]   ${filename} → ${newUrl}`);
            moved++;
        } catch (err) {
            console.error(`  [ERR]  ${filename}: ${err.message}`);
            errors++;
        }
    }

    console.log(`[${tableName}] Done: ${moved} moved, ${skipped} skipped, ${errors} errors.`);
}

async function run() {
    console.log('=== Upload Migration Script ===');
    try {
        await migrateTable('leaders', 'image_url', leadersDir, 'leaders_img');
        await migrateTable('gallery_images', 'image_url', galleryDir, 'gallery_img');
        console.log('\n✅ Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
        process.exit(1);
    }
}

run();

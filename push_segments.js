const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const BATCH_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB per batch

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push({ path: fullPath, size: stat.size });
    }
  }
  return results;
}

function run() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log("No uploads directory found.");
    return;
  }

  const files = getFiles(UPLOADS_DIR);
  console.log(`Found ${files.length} files to push.`);

  let currentBatch = [];
  let currentSize = 0;
  let batchNumber = 1;

  for (const file of files) {
    // Convert absolute path to relative path for git
    const relPath = path.relative(__dirname, file.path).replace(/\\/g, '/');
    currentBatch.push(relPath);
    currentSize += file.size;

    if (currentSize >= BATCH_SIZE_LIMIT || file === files[files.length - 1]) {
      console.log(`\n--- Processing Batch ${batchNumber} (${(currentSize / 1024 / 1024).toFixed(2)} MB, ${currentBatch.length} files) ---`);
      try {
        // Add files
        for (const f of currentBatch) {
          execSync(`git add "${f}"`);
        }
        
        // Commit
        execSync(`git commit -m "Add media files - batch ${batchNumber}"`);
        
        // Push
        console.log("Pushing to GitHub...");
        execSync(`git push origin main`);
        
        console.log(`Batch ${batchNumber} successful.`);
      } catch (err) {
        console.error(`Error in batch ${batchNumber}:`, err.message);
        // We might want to abort or continue, let's just log and stop
        process.exit(1);
      }

      currentBatch = [];
      currentSize = 0;
      batchNumber++;
    }
  }

  console.log("\nAll batches pushed successfully.");
}

run();

const fs = require('fs');
const path = require('path');

function fixCache(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixCache(fullPath);
        } else if (file === 'route.ts') {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('export async function GET') && !content.includes("export const dynamic = 'force-dynamic'") && !content.includes('export const dynamic = "force-dynamic"')) {
                // Prepend to the top
                content = "export const dynamic = 'force-dynamic';\n" + content;
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}
fixCache(path.join(__dirname, 'src', 'app', 'api'));

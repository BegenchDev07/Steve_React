import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

exec('git log -1 --format=%h --date=iso-strict', (error, stdout, stderr) => {
    if (error) {
        console.error('Error executing git command:', error);
        return;
    }

    const lastCommitID = stdout.trim(); 
    const lastTime = Date.now(); 

    const data = {
        lastCommitID,
        lastTime
    };

    const filePath = path.join(rootDir, 'src/utils/lastInfo.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});

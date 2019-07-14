
// const { execSync } = require('child_process');
// const fs = require('fs-extra');
// const path = require('path');

// try {
//     const distPath = path.resolve(__dirname, `dist`);
//     console.log(`Removing Folder => ${distPath}`);
//     fs.removeSync(distPath); // rm -rf (equivalent)
//     const cmd = execSync(`tsc --build tsconfig.json`, { cwd: path.resolve(__dirname) });
//     console.log(`Compiled Ouput @ => ${distPath}`);
// }
// catch (ex) {
//     console.log(`Compilation Error => `, ex);
// }

const fs = require('fs');

// Get unused modules in dir
// async function getUnusedModules(projectDir) {
//   const options = {
//     ignoreDirs: ["node_modules"], // Ignore node_modules directory
//   };

//   const unused = await depcheck(projectDir, options);
//   const modules = unused.dependencies.concat(unused.devDependencies);

//   console.log("Unused modules :: " + modules);
//   return modules;
// }

function checkUnusedDependencies() {
    const dependencies = [];
    const usedDependencies = [];
    const unusedDependencies = [];

    // Get all dependencies
    fs.readdirSync('./node_modules').forEach(file => {
        dependencies.push(file);
    });

    // Get all used dependencies
    fs.readdirSync('./').forEach(file => {
        if (file === 'package.json' || file === 'package-lock.json') {
            const content = fs.readFileSync('./' + file, 'utf8');
            const parsedContent = JSON.parse(content);
            const depList = Object.assign({}, parsedContent.dependencies, parsedContent.devDependencies);

            Object.keys(depList).forEach(dep => {
                const depObj = {
                    name: dep,
                    version: depList[dep]
                };

                if (usedDependencies.findIndex(d => d.name === depObj.name) === -1) {
                    usedDependencies.push(depObj);
                }
            });
        }
    });

    // Get unused dependencies
    dependencies.forEach(dep => {
        if (dep !== '.bin' && dep !== '.package-lock.json') {
            const depObj = {
                name: dep,
                version: null
            };

            const index = usedDependencies.findIndex(d => d.name === depObj.name);

            if (index === -1) {
                unusedDependencies.push(depObj);
            } else {
                depObj.version = usedDependencies[index].version;
            }
        }
    });

    return {
        usedDependencies,
        unusedDependencies
    };
}

console.log('Checking for unused dependencies...');
const result = checkUnusedDependencies();
console.log('Used dependencies:');
console.log(result.usedDependencies);
console.log('Unused dependencies:');
console.log(result.unusedDependencies);


module.exports = checkUnusedDependencies;


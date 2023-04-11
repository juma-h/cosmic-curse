const path = require("path");
const dependencyTree = require("dependency-tree");
const depcheck = require("depcheck");
const readline = require("readline");
const rimraf = require("rimraf");
const { exec } = require("child_process");




//get project dir
const getProjectDir = () => {
  const path = require("path");
  const cwd = process.cwd();
  
  return path.resolve(cwd);

}; 

// List all the dependencies in the project
function getAllModules(projectDir) {


  console.log("Project dir is :: " + projectDir);

  const options = {
    directory: projectDir, // Use projectDir as the root directory
    filename: path.join(projectDir, "package.json"),
  };

  const tree = dependencyTree(options);
  const modules = Object.keys(tree);
  console.log("All modules :: " + modules);
  return modules;
}



const getUnusedModules = async (projectDir) => {

 
  const options = {
    ignoreDirs: ["node_modules"], // Ignore node_modules directory
  };

  const { dependencies, devDependencies } = await depcheck(projectDir, options);
  const modules = [...dependencies, ...devDependencies];

  //   console.log(`Unused modules :: ${modules}`);
  return modules;
};

// Delete unused
async function deleteUnusedModules(projectDir, unusedModules) {
 
  
  // Prompt the user to select which modules to retain
  const answer = await promptUser(unusedModules);

  if (typeof answer === 'string' && (answer.toLowerCase() === "n" || answer.toLowerCase() === "all")) {
    console.log("No modules deleted.");
    return;
  }
  

  const modulesToRetain = await promptUser(unusedModules);

  console.log("Modules to retain :: " + modulesToRetain);

  // Uninstall and delete the unused modules
  for (const module of unusedModules) {
    if (!modulesToRetain.includes(module)) {
      const modulePath = path.join(projectDir, "node_modules", module);
      // Uninstall the module with npm uninstall
      exec(
        `npm uninstall ${module}`,
        { cwd: projectDir },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error uninstalling ${module}: ${error.message}`);
          } else {
            console.log(`Uninstalled ${module}`);
          }
        }
      );
      // Delete the module directory with rimraf
      rimraf.sync(modulePath);
      console.log("Deleted :: " + modulePath);
    }
  }
}

// function promptUser(unusedModules) {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) => {
//     rl.question(
//       `Unused modules detected:\n${unusedModules
//         .map((module) => `- ${module}`)
//         .join("\n")}\nDo you want to retain any modules? (y/n) `,
//       (answer) => {
//         if (answer.toLowerCase() === "y") {
//           rl.question(
//             "Type the names of the modules you would like to retain, separated by commas, or type 'exit' to cancel, or 'all': ",
//             (moduleAnswer) => {
//               if (moduleAnswer.toLowerCase() === "exit") {
//                 resolve([]);
//               } else {
//                 const modulesToRetain = moduleAnswer.split(",");
//                 resolve(modulesToRetain.map((module) => module.trim()));
//               }
//               rl.close();
//             }
//           );
//         } else {
//           resolve([]);
//           rl.close();
//         }
//       }
//     );
//   });
// }

// Project combination

function promptUser(unusedModules) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    return new Promise((resolve) => {
      rl.question(
        `Unused modules detected:\n${unusedModules
          .map((module) => `- ${module}`)
          .join("\n")}\nDo you want to retain any modules? (y/n/all) `,
        (answer) => {
          if (answer.toLowerCase() === "n") {
            resolve([]);
          } else if (answer.toLowerCase() === "all") {
            console.log("Exiting application. No modules deleted.");
            process.exit(0);
          } else {
            rl.question(
                "Type the names of the modules you would like to retain, separated by commas, or type 'exit' to cancel: ",
                (moduleAnswer) => {
                  if (moduleAnswer.toLowerCase() === "exit") {
                    console.log("Exiting application. No modules deleted.");
                    process.exit(0);
                  } else {
                    const modulesToRetain = moduleAnswer.split(",");
                    resolve(modulesToRetain.map((module) => module.trim()));
                  }
                  rl.close();
                }
              );
          }
        }
      );
    });
  }
  

async function SnapTheFinger() {
  // The second arg
  const projectDir = getProjectDir();
  if (!projectDir) {
    console.error("Error: Project directory not specified.");
    return;
  }
  const allModules = getAllModules(projectDir);
  const unusedModules = await getUnusedModules(projectDir);
  await deleteUnusedModules(projectDir, unusedModules);
}

SnapTheFinger();

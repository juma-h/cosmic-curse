const path = require("path");
const dependencyTree = require("dependency-tree");
const depcheck = require("depcheck");
const readline = require("readline");
const rimraf = require("rimraf");
const util = require("util");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const fs = require("fs");
const successColor = "\x1b[32m"; // Green
const failColor = "\x1b[31m"; // Red

const resetColor = "\x1b[0m"; // default color

//get project dir
const getProjectDir = () => {
  const path = require("path");
  const cwd = process.cwd();
  return path.resolve(cwd);
};

// Function to simulate sleep
function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms);
}

// Function to animate messages with a typing effect
function animateMessages(messages, color) {
  for (const message of messages) {
    for (const char of message) {
      process.stdout.write(`${color}${char}\x1b[0m`);
      sleep(50);
    }
    console.log();
  }
}

// on start up message and get all modules
function getAllModules(projectDir) {
  // Terminal animation when starting up
  const welcomeMessages = [
    "Welcome to cosmic-curse!👽",
    "Formally known as death-node 👾",
    "lol, okay",
    "Fetching your directory...",
  ];
  animateMessages(welcomeMessages, successColor);

  // Display additional information about the project
  console.log(`Your project dir is :: \x1b[1m${projectDir}\x1b[0m`);
  console.log("- - - - - - - - - ");

  const options = {
    directory: projectDir,
    filename: path.join(projectDir, "package.json"),
  };
  const tree = dependencyTree(options);
  const modules = Object.keys(tree);

  // If there are no installed modules, exit; otherwise, return the modules
  if (modules.length === 0) {
    console.log(
      "\x1b[31mNo modules? Exiting application. Adios Muchachos🤣.\x1b[0m"
    ); // Red color
    process.exit(0);
  } else {
    console.log("\x1b[32mModules Found! Great stuff.\x1b[0m"); // Green color
    console.log("- - - - - - - - - ");
  }

  return modules;
}

// get unused modules
const getUnusedModules = async (projectDir) => {
  const options = {
    ignoreDirs: ["node_modules"], // Ignore node_modules directory
  };

  const { dependencies, devDependencies } = await depcheck(projectDir, options);
  const modules = [...dependencies, ...devDependencies];
  // console.log(`Unused modules :: ${modules}`);
  // exit application if all modules found are in use.
  if (modules.length === 0) {
    console.log(
      "All modules are being used. Exiting application. Adios Muchachos. 😂"
    );
    process.exit(0);
  }
  return modules;
};

// Delete unused modules
async function deleteUnusedModules(projectDir, unusedModules) {
  // Prompt the user to select which modules to retain
  const answer = await promptUser(unusedModules);

  if (
    typeof answer === "string" &&
    (answer.toLowerCase() === "no" || answer.toLowerCase() === "all")
  ) {
    console.log("No modules deleted.");
    return;
  }
  const modulesToRetain = answer === "yes" ? [] : answer;
  console.log("- - - - - - - - - ");
  console.log("Modules to retain :: ");
  for (let i = 0; i < modulesToRetain.length; i++) {
    console.log("- " + modulesToRetain[i]);
  }
  console.log("- - - - - - - - - ");

  // Uninstall and delete the unused modules with a spinner animation
  const spinner = ["👽", "👾", "🚀", "😊", "🤩", "😲", "🙄", "😣", "😛"];
  let spinnerIndex = 0;

  const spinnerInterval = setInterval(() => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Uninstalling modules: ${spinner[spinnerIndex]}`);
    spinnerIndex = (spinnerIndex + 1) % spinner.length;
  }, 100);

  const uninstallPromises = unusedModules.map((module) => {
    return new Promise((resolve, reject) => {
      if (!modulesToRetain.includes(module)) {
        const modulePath = path.join(projectDir, "node_modules", module);
  
        // Add a line before each uninstallation to display the module name
        console.log(`Preparing to uninstall: ${module}`);
  
        exec(
          `npm uninstall ${module}`,
          { cwd: projectDir },
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error uninstalling ${module}: ${error.message}`);
              reject(error);
            } else {
              // "Uninstalled" message
              console.log(` Uninstalled ${module}`);
              resolve();
            }
          }
        );
      } else {
        resolve();
      }
    });
  });

  try {
    await Promise.all(uninstallPromises);
  } catch (error) {
    // Handle errors if needed
    // until i get the errors , i dont know what to handle yet.
  }

  clearInterval(spinnerInterval);

  // Typing animation
  const exitMessage = `\n${successColor}Uninstallation completed. Adios 😎${resetColor}`;
  for (const char of exitMessage) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    process.stdout.write(char);
  }

  console.log();
}

// Project combination
function promptUser(unusedModules) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    // listing unused modules in a tree format
    rl.question(
      `Unused modules detected:\n${unusedModules
        .map((module) => `- ${module}`)
        .join(
          "\n"
        )}\nDo you want to retain any modules? (yes/no/all) \n${"[type answer] : "} `,
      (answer) => {
        if (answer.toLowerCase() === "no") {
          resolve([]);
        } else if (answer.toLowerCase() === "all") {
          console.log(
            "\x1b[32mAlright then , keep your modules. Exiting application. No modules deleted. 😎\x1b[0m"
          );

          process.exit(0);
        } else if (answer.toLowerCase() === "yes") {
          rl.question(
            `Type the names of the modules you would like to retain, separated by commas, or type 'exit' to cancel:\n${"[type answer(s)] : "} `,
            (moduleAnswer) => {
              if (moduleAnswer.toLowerCase() === "exit") {
                console.log(
                  "\x1b[32mAlright then , keep your modules. Exiting application. No modules deleted. 😎\x1b[0m"
                );

                process.exit(0);
              } else {
                const modulesToRetain = moduleAnswer
                  .split(",")
                  .map((module) => module.trim());
                const invalidModules = modulesToRetain.filter(
                  (module) => !unusedModules.includes(module)
                );

                if (invalidModules.length > 0) {
                  console.log(
                    `\x1b[31m Oops!: Invalid module names(s)[Not found]: ${invalidModules.join(
                      ", "
                    )}\x1b[0m`
                  );

                  // Allow the user to edit their input
                  rl.question(
                    "Please correct the module name(s): ",
                    (editedAnswer) => {
                      // Split the corrected module names
                      const correctedModules = editedAnswer
                        .split(",")
                        .map((module) => module.trim());
                      // Concatenate the corrected modules with the original list
                      // filter out the invalid , module from OG list.
                      const allModulesToRetain = [
                        ...modulesToRetain.filter(
                          (module) => !invalidModules.includes(module)
                        ),
                        ...correctedModules,
                      ];

                      resolve(allModulesToRetain);
                      rl.close();
                    }
                  );
                } else {
                  resolve(modulesToRetain);
                  rl.close();
                }
              }
            }
          );
        } else {
          const EndingMessages = [
            "Ama-????",
            "Wow really? ",
            "What answer is that? Is a cat on your keyboard?",
            "Let's call it a day, my creator didn't want to implement this part yet",
            "Uh- Uhm I'm gonna head out.",
            "You can start again and do this correctly.",
            "If you want."
          ];
          animateMessages(EndingMessages, failColor);
     
          // Exit the process with an error code
          process.exit(1);
        }
      }
    );
  });
}

async function SnapTheFinger() {
  // The second arg
  const projectDir = getProjectDir();
  if (!projectDir) {
    console.error("\x1b[31mError: Project directory not found.\x1b[0m");
    return;
  }
  const allModules = getAllModules(projectDir);
  const unusedModules = await getUnusedModules(projectDir);
  await deleteUnusedModules(projectDir, unusedModules);
}

module.exports = {
  getAllModules,
  getUnusedModules,
  deleteUnusedModules,
  promptUser,
  getProjectDir,
  SnapTheFinger, // Export the function without invoking it
};

// Check if the script is executed directly
if (require.main === module) {
  // If it is, then execute the function
  SnapTheFinger();
}

// async function SnapTheFinger() {
//   // The second arg
//   const projectDir = getProjectDir();
//   if (!projectDir) {
//     console.error("\x1b[31mError: Project directory not found.\x1b[0m");
//     return;
//   }
//   const allModules = getAllModules(projectDir);
//   const unusedModules = await getUnusedModules(projectDir);
//   await deleteUnusedModules(projectDir, unusedModules);
// }

// module.exports = {
//   getAllModules,
//   getUnusedModules,
//   deleteUnusedModules,
//   promptUser,
//   getProjectDir,
// };

// module.exports.SnapTheFinger = SnapTheFinger;
// SnapTheFinger();

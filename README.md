# Cosmic curse

> "Fun Isn't Something One Considers When Balancing The Universe. But This... Does Put A Smile On My Face." 

death-node is a tool that helps you clean up unused dependencies from your Node.js project. It uses the depcheck and rimraf packages to find and delete unused dependencies.


## Installation

To use death-node, you need to have Node.js and npm installed on your system. You can then install death-node using the following command:

```bash
npm install death-node
```

## Usage

To use death node, you need to call the SnapTheFinger function in your Node.js code. Here's an example of how to use death-node in a Node.js script:

```javascript
const { SnapTheFinger } = require('death-node');

SnapTheFinger();
```
This will list all the installed packages in the current project directory, identify the unused packages, and prompt the user to confirm whether they want to remove all unused packages or keep some of them. The function will then remove the selected packages.

Note that you can also specify a custom project directory as an argument to the SnapTheFinger function:

```javascript
const { SnapTheFinger } = require('death-node');

const projectDirectory = '/path/to/my/project';
SnapTheFinger(projectDirectory);

```

## Improvements
- The promptUser function improved by validating the user's input. The function should ensure that the user only enters valid module names separated by commas.

- The deleteUnusedModules function improved by adding error handling for the rimraf package. If a module cannot be deleted, the function should log an error message and continue deleting the other modules.

- The main function  improved by adding error handling for the depcheck package. If an error occurs, the function should log an error message and exit.


> "Perfectly Balanced, As All Things Should Be."

## Contributing
If you want to contribute to the death-node project, you can fork the repository on GitHub and submit a pull request with your changes. Please make sure to follow the coding style and guidelines of the project.

Please make sure to update tests as appropriate.

## License
death-node is licensed under the MIT License. See the MIT file for details.
[MIT](https://choosealicense.com/licenses/mit/)
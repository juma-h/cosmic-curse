# Cosmic curse (cosmic-curse)

##### Formally known as *death-node*

> "Fun Isn't Something One Considers When Balancing The Universe. But This... Does Put A Smile On My Face." 

cosmic- curse, a better and improved package of [death-node](https://www.npmjs.com/package/death-node) is a tool that helps you clean up unused dependencies from your Node.js project. It uses the depcheck and rimraf packages to find and delete unused dependencies.


## Installation

To use cosmic-curse, you need to have Node.js and npm installed on your system. You can then install cosmic-curse using the following command:

```bash

npm install cosmic-curse

```

## Usage

First thing is to install depcheck. [it is a required dependency]. 
You can try installing the depcheck module in your project using npm by running the command : 

> npm install depcheck


To use cosmic-curse, you need to call the SnapTheFinger function in your Node.js code. Here's an example of how to use cosmic-curse in a Node.js script:

1. Create a file in your directory, ie.fileTest.js
2. Include the following code as below:

```javascript
const myModule = require('cosmic-curse');

myModule.SnapTheFinger();


```
3. Run the file , [make sure you are in the correct path , where your file is ]

> node fileTest.js


This will list all the installed packages in the current project directory, identify the unused packages, and prompt the user to confirm whether they want to remove all unused packages or keep some of them. The function will then remove the selected packages.


# Project Release Notes 

##  Version 2.0.0 , (2024)
## New Features

### 1. Improved Exit Conditions
- **If No Modules in Project:**
  - The application will now exit if there are no installed modules in the project.

- **If No Unused Modules:**
  - The application will exit if there are installed modules, but no unused modules detected.

### 2. List of Modules in Tree Form
- Unused modules are now displayed in a tree format for better readability.

### 3. Editable Retained Modules
- If an incorrect module name is provided when choosing which modules to retain, the user is prompted to edit the input.

### 4. Progress Animation during Uninstallation
- A progress bar or animation is displayed during the uninstallation process to indicate the progress of module removal.

### 5. Improved Prompt Handling
- If an incorrect answer is provided in the prompt:  [Do you want to retain any modules? (yes/no/all)] (e.g., an invalid option), the application now exits instead of deleting all listed modules.

### 6. Console Colors for Better Readability
- Colored text is used in the console for improved readability and to distinguish different types of messages.


# Images so you can see what to expect
This is because I have types do much so see a VISUAL!

![This is the result if you do this correctly](../../images/cosmic-curse.PNG)

![This is the result if you do not](../../images/cosmoc1.PNG)



## v1.0.9 Improvements, (2023)

- The promptUser function improved by validating the user's input. The function should ensure that the user only enters valid module names separated by commas.

- The deleteUnusedModules function improved by adding error handling for the rimraf package. If a module cannot be deleted, the function should log an error message and continue deleting the other modules.

- The main function  improved by adding error handling for the depcheck package. If an error occurs, the function should log an error message and exit.

- You no longer need to specify your directory , the package will determine for itself.

- Implemented correct deletion of dependencies. 

- Fixed duplication of prompts


> "Perfectly Balanced, As All Things Should Be."



## Contributing
If you want to contribute to the cosmic-curse project, you can fork the repository on GitHub and submit a pull request with your changes. Please make sure to follow the coding style and guidelines of the project.

Please make sure to update tests as appropriate.

## License
cosmic-curse is licensed under the MIT License. See the MIT file for details.
[MIT](https://choosealicense.com/licenses/mit/)

## Authors 
 Michelle Juma 
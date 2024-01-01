import fs from 'fs';
import { execSync } from "child_process";
import path from "path";
import configContent from "./configContent.js";

const installTailwind = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const isFileExists = (pathToFile) => {
    const filePath = path.join(process.cwd(), pathToFile)
    if (!fs.existsSync(filePath)) {
        console.log("\x1b[31m", `\nUnable to find ${pathToFile} file.`);
        process.exit(0);
    }
}

const updateConfig = (framework) => {
    const newContent = configContent[framework];
    isFileExists("tailwind.config.js");
    try {
        fs.writeFileSync("tailwind.config.js", newContent, 'utf-8');
    } catch (error) {
        console.error(error.message);
        process.exit(0);
    }
}

const updateCss = (pathToFile) => {
    const twConfig = `/* TAILWINDCSS CONFIG. DO NOT REMOVE THIS. */
@tailwind base;
@tailwind components;
@tailwind utilities;\n\n`

    isFileExists(pathToFile)

    try {
        const fileContent = fs.readFileSync(pathToFile, 'utf8')
        const updatedContent = twConfig + fileContent;
        fs.writeFileSync(pathToFile, updatedContent, 'utf-8')
    } catch (err) {
        console.error(err.message);
        process.exit(0);
    }
}

const success = (framework) => {
    console.log("\x1b[32mSuccessfully installed and configured TailwindCSS.\n\x1b[0m");
    console.log("You can now begin utilizing Tailwind's utility classes to style your content.");
    console.log(`Need help? visit: \x1b[34mhttps://tailwindcss.com/docs/guides/${framework}\x1b[0m`);
}

export {
    installTailwind,
    isFileExists,
    updateConfig,
    updateCss,
    success
}
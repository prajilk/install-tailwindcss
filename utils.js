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
    }
}

const updateCss = (pathToFile) => {
    const twConfig = `/* TAILWINDCSS CONFIG. DO NOT REMOVE THIS. */
@tailwind base;
@tailwind components;
@tailwind utilities;\n\n`

    isFileExists(pathToFile)

    fs.readFile(pathToFile, 'utf-8', (err, indexContent) => {
        if (err) {
            console.error(err.message);
            process.exit(0);
        }

        const updatedContent = twConfig + indexContent;

        fs.writeFile(pathToFile, updatedContent, 'utf-8', (err) => {
            if (err) {
                console.error(err.message);
                process.exit(0);
            }
        });
    });
}

const success = () => {
    console.log("\x1b[32m", "\n\tSuccessfully installed and configured TailwindCSS.\n\n\tYou can now begin utilizing Tailwind's utility classes to style your content.");
}

export {
    installTailwind,
    isFileExists,
    updateConfig,
    updateCss,
    success
}
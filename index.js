#!/usr/bin/env node

import select from "@inquirer/select"
import minimist from "minimist"
import fs from 'fs';
import { execSync } from "child_process";
import path from "path";
import FRAMEWORKS from "./frameworks.js";
import {
    installTailwind,
    isFileExists,
    updateConfig,
    updateCss,
    success
} from "./utils.js"
import {
    updateGatsbyConfig,
    updateRemixConfig,
    updateSymfonyConfig
} from "./framework-config/updateFrameworkConfig.js"

const argv = minimist(process.argv.slice(2), { string: ["_"] });

let argFramework = argv._[0]
let answer = null;

// FRAMEWORKS.forEach((framework) => argFramework !== framework.value && (argFramework = null));
FRAMEWORKS.some((framework) => {
    if (argFramework === framework.value) {
        answer = argFramework
        return true; // Stops iterating after the action is performed
    }
    return false; // Continue iterating
});

if (answer === null) {
    console.log("\x1b[33m", "\n!!! - Ensure to install Tailwind CSS only after you have successfully installed the desired frontend framework - !!!\n");

    answer = await select({
        message: 'Select a package manager',
        choices: FRAMEWORKS,
    });

    console.log(`\nInstalling TailwindCSS for ${answer}.\n`);
}


if (answer === 'next-js') {
    if (!fs.existsSync(path.join(process.cwd(), 'next.config.js'))) {
        console.log("\x1b[31m", "\nUnable to find 'next.config.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    if (fs.existsSync(path.join(process.cwd(), 'src'))) {
        updateConfig(answer + '-src');
        updateCss("src/app/globals.css");
    } else {
        updateConfig(answer);
        updateCss("app/globals.css");
    }
    success();

}
else if (answer === 'laravel') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("public/css/app.css");
    success();
}
else if (answer === 'vite') {
    if (!fs.existsSync(path.join(process.cwd(), 'vite.config.js'))) {
        console.log("\x1b[31m", "\nUnable to find 'vite.config.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("src/index.css");
    success();
}
else if (answer === 'gatsby') {
    if (!fs.existsSync(path.join(process.cwd(), 'gatsby-config.js'))) {
        console.log("\x1b[31m", "\nUnable to find 'gatsby-config.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");

    updateGatsbyConfig();

    updateConfig(answer);
    updateCss("src/styles/global.css");

    if (!fs.existsSync(path.join(process.cwd(), "gatsby-browser.js"))) {
        fs.writeFileSync(path.join(process.cwd(), "gatsby-browser.js"), "import './src/styles/global.css'")
    } else {
        const importCss = "import './src/styles/global.css'\n\n"
        const gbContent = fs.readFileSync(path.join(process.cwd(), "gatsby-browser.js"), 'utf-8');
        const updatedGbContent = importCss + gbContent;
        fs.writeFileSync(path.join(process.cwd(), "gatsby-browser.js"), updatedGbContent);
    }
    success();
}
else if (answer === 'solid-js') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("src/index.css");
    success();
}
else if (answer === 'angular') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("src/index.css");
    success();
}
else if (answer === 'ruby-on-rails') {
    isFileExists("Gemfile");
    installTailwind("./bin/bundle add tailwindcss-rails && ./bin/rails tailwindcss:install");
    updateConfig(answer);
    updateCss("app/assets/stylesheets/application.tailwind.css");
    success();
}
else if (answer === 'remix') {
    if (!fs.existsSync(path.join(process.cwd(), 'remix.config.js'))) {
        console.log("\x1b[31m", "\nUnable to find 'remix.config.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    isFileExists("package.json");

    updateRemixConfig();

    installTailwind("npm install -D tailwindcss && npx tailwindcss init");
    updateConfig(answer);
    updateCss("app/tailwind.css");

    if (!fs.existsSync(path.join(process.cwd(), "app/root.jsx"))) {
        const importContent = 'import stylesheet from "~/tailwind.css";\n\nexport const links = () => [\n\t{ rel: "stylesheet", href: stylesheet }\n];'
        fs.writeFileSync(path.join(process.cwd(), "app/root.jsx"), importContent)
    } else {
        const rmxContent = fs.readFileSync(path.join(process.cwd(), "app/root.jsx"), 'utf-8');

        const importToAdd = `import stylesheet from "~/tailwind.css";

export const links = () => [
    { rel: "stylesheet", href: stylesheet }
];`;

        // Split the content by lines
        const lines = rmxContent.split('\n');

        // Find the index to insert the new import after the existing import statements
        let insertIndex = lines.findIndex(line => !line.trim().startsWith('import '));

        if (insertIndex === -1) {
            // If no other import found, insert at the beginning
            insertIndex = 0;
        } else {
            // Move down one line to insert after the last import
            insertIndex += 1;
        }

        // Insert the new import at the determined index
        lines.splice(insertIndex, 0, importToAdd);

        // Rejoin the lines to create the updated content
        const updatedRmxContent = lines.join('\n');

        fs.writeFileSync(path.join(process.cwd(), "app/root.jsx"), updatedRmxContent);
    }
    success();
}
else if (answer === "symfony") {
    if (!fs.existsSync(path.join(process.cwd(), 'webpack.config.js'))) {
        console.log("\x1b[31m", "\nUnable to find 'webpack.config.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    try {
        execSync("composer require symfony/webpack-encore-bundle")
    } catch (error) {
        console.log(error.message);
    }

    installTailwind("npm install -D tailwindcss postcss postcss-loader autoprefixer && npx tailwindcss init -p");

    updateSymfonyConfig();

    updateConfig(answer);
    updateCss("assets/styles/app.css");
    success();
}
else if (answer === 'meteor') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("client/main.css");
    success();
}
else if (answer === 'create-react-app') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss && npx tailwindcss init");
    updateConfig("solid-js");
    updateCss("src/index.css");
    success();
}
else if (answer === 'astro') {
    if (!fs.existsSync(path.join(process.cwd(), 'astro.config.mjs'))) {
        console.log("\x1b[31m", "\nUnable to find 'astro.config.mjs'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    isFileExists("package.json");
    installTailwind("npx astro add tailwind");
    success();
}
else if (answer === 'qwik') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig("next-js-src");
    updateCss("src/global.css");
    success();
}
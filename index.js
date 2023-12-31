#!/usr/bin/env node

import select from "@inquirer/select"
import minimist from "minimist"
import fs from 'fs';
import { execSync } from "child_process";
import path from "path";
import FRAMEWORKS, { TOOLS } from "./frameworks.js";
import {
    installTailwind,
    isFileExists,
    updateConfig,
    updateCss,
    success
} from "./utils.js"
import {
    updateLaravelMixConfig,
    updateGatsbyConfig,
    updateRemixConfig,
    updateSymfonyConfig
} from "./framework-config/updateFrameworkConfig.js"

const argv = minimist(process.argv.slice(2), { string: ["_"] });

let argFramework = argv._[0]
let answer = null;
let tool = argv.tool || argv.t

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
        message: 'Select a framework',
        choices: FRAMEWORKS,
    });
}
if (tool === undefined) {
    switch (answer) {
        case "laravel":
            tool = await select({
                message: 'Select a build tool',
                choices: TOOLS.laravel,
            });
            break;
        case "vite":
            tool = await select({
                message: 'Select a build tool',
                choices: TOOLS.vite,
            });
            break;

        default:
            tool = null;
            break;
    }
}
console.log(`\nInstalling TailwindCSS for ${answer}.\n`);


if (answer === 'next-js') {
    if (fs.existsSync(path.join(process.cwd(), 'next.config.js')) || fs.existsSync(path.join(process.cwd(), 'next.config.ts'))) {
        isFileExists("package.json");
        installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
        if (fs.existsSync(path.join(process.cwd(), 'src'))) {
            updateConfig(answer + '-src');
            updateCss("src/app/globals.css");
        } else {
            updateConfig(answer);
            updateCss("app/globals.css");
        }
        success("nextjs");
        process.exit(0);
    }
    console.log("\x1b[31m", "\nUnable to find 'next.config.js'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);

}
else if (answer === 'laravel') {
    if (tool === "vite") {
        if (fs.existsSync(path.join(process.cwd(), 'vite.config.js')) || fs.existsSync(path.join(process.cwd(), 'vite.config.ts'))) {
            isFileExists("package.json");
            installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
            updateConfig(answer);
            updateCss("resources/css/app.css");
            success("laravel");
            process.exit(0);
        }
        console.log("\x1b[31m", "\nUnable to find 'vite.config.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    } else if (tool === "laravel-mix") {
        if (fs.existsSync(path.join(process.cwd(), 'webpack.mix.js')) || fs.existsSync(path.join(process.cwd(), 'webpack.mix.ts'))) {
            isFileExists("package.json");
            installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init");
            //Update webpack.mix.js
            updateConfig(answer);
            updateCss("resources/css/app.css");
            updateLaravelMixConfig();
            success("laravel");
            process.exit(0);
        }
        console.log("\x1b[31m", "\nUnable to find 'webpack.mix.js'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    } else {
        console.log("\x1b[31m", "\n\tError: No valid build tool provided or an invalid build tool was specified.");
        process.exit(0);
    }
}
else if (answer === 'vite') {
    if (fs.existsSync(path.join(process.cwd(), 'vite.config.js')) || fs.existsSync(path.join(process.cwd(), 'vite.config.ts'))) {
        isFileExists("package.json");
        installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
        if (tool === 'react') {
            updateConfig(answer + "-react");
            updateCss("src/index.css");
        } else if (tool === 'vue') {
            updateConfig(answer + "-vue");
            updateCss("src/style.css");
        } else if (tool === 'svelte') {
            updateConfig(answer + "-svelte");
            updateCss("src/app.css");
        } else {
            console.log("\x1b[31m", "\n\tError: No valid build tool provided or an invalid build tool was specified.");
            process.exit(0);
        }
        success(answer);
        process.exit(0);
    }
    console.log("\x1b[31m", "\nUnable to find 'vite.config.js'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);
}
else if (answer === 'gatsby') {
    if (fs.existsSync(path.join(process.cwd(), 'gatsby-config.js')) || fs.existsSync(path.join(process.cwd(), 'gatsby-config.ts'))) {
        isFileExists("package.json");
        installTailwind("npm install -D tailwindcss postcss autoprefixer gatsby-plugin-postcss && npx tailwindcss init -p");

        updateConfig(answer);

        if (!fs.existsSync("src/styles")) {
            fs.mkdirSync("src/styles")
            fs.writeFileSync(path.join(process.cwd(), "src", "styles", "global.css"), "")
        }
        updateCss("src/styles/global.css");

        if (fs.existsSync(path.join(process.cwd(), "gatsby-browser.js"))) {
            fs.writeFileSync(path.join(process.cwd(), "gatsby-browser.js"), "import './src/styles/global.css'")
        } else if (fs.existsSync(path.join(process.cwd(), "gatsby-browser.js"))) {
            fs.writeFileSync(path.join(process.cwd(), "gatsby-browser.ts"), "import './src/styles/global.css'")
        } else {
            const importCss = "import './src/styles/global.css'\n\n"
            const gbContent = fs.readFileSync(path.join(process.cwd(), "gatsby-browser.js"), 'utf-8');
            const updatedGbContent = importCss + gbContent;
            fs.writeFileSync(path.join(process.cwd(), "gatsby-browser.js"), updatedGbContent);
        }
        updateGatsbyConfig();
        success(answer);
        process.exit(0);
    }
    console.log("\x1b[31m", "\nUnable to find 'gatsby-config.js'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);
}
else if (answer === 'solid-js') {
    if (fs.existsSync(path.join(process.cwd(), 'vite.config.js')) || fs.existsSync(path.join(process.cwd(), 'vite.config.ts'))) {
        isFileExists("package.json");
        installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
        updateConfig(answer);
        updateCss("src/index.css");
        success("solidjs");
        process.exit(0);
    }
    console.log("\x1b[31m", "\nUnable to find 'vite.config.js'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);
}
else if (answer === 'angular') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("src/styles.css");
    success(answer);
}
else if (answer === 'ruby-on-rails') {
    isFileExists("Gemfile");
    installTailwind("./bin/bundle add tailwindcss-rails && ./bin/rails tailwindcss:install");
    // Automatically update tailwind.config.js
    // Automatically update css file
    success(answer);
}
else if (answer === 'remix') {
    if (fs.existsSync(path.join(process.cwd(), 'remix.config.js')) || fs.existsSync(path.join(process.cwd(), 'remix.config.ts'))) {
        if (fs.existsSync(path.join(process.cwd(), 'tailwind.config.js')) || fs.existsSync(path.join(process.cwd(), 'tailwind.config.ts'))) {
            console.log("\x1b[33m", "\n\tYour project already has Tailwind CSS installed.\n");
            process.exit(0);
        }

        isFileExists("package.json");

        installTailwind("npm install -D tailwindcss && npx tailwindcss init");
        updateConfig(answer);
        if (!fs.existsSync("app/tailwind.css")) {
            fs.writeFileSync(path.join(process.cwd(), "app", "tailwind.css"), "")
        }
        updateCss("app/tailwind.css");

        const importContent = 'import stylesheet from "~/tailwind.css";\n\nexport const links = () => [\n\t{ rel: "stylesheet", href: stylesheet }\n];'
        if (!fs.existsSync(path.join(process.cwd(), "app/root.jsx"))) {
            fs.writeFileSync(path.join(process.cwd(), "app/root.tsx"), importContent)
        } if (!fs.existsSync(path.join(process.cwd(), "app/root.tsx"))) {
            fs.writeFileSync(path.join(process.cwd(), "app/root.jsx"), importContent)
        } else {
            let rmxContent;
            if (fs.existsSync(path.join(process.cwd(), "app/root.jsx"))) {
                rmxContent = fs.readFileSync(path.join(process.cwd(), "app/root.jsx"), 'utf-8');
            } else {
                rmxContent = fs.readFileSync(path.join(process.cwd(), "app/root.tsx"), 'utf-8');
            }

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
        updateRemixConfig();
        success(answer);
        process.exit(0);
    }

    console.log("\x1b[31m", "\nUnable to find 'remix.config.js'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);
}
else if (answer === 'parcel') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss && npx tailwindcss init");
    const postcssrcContent = '{\n\t"plugins": {\n\t\t"tailwindcss": {}\n\t}\n}'
    fs.writeFileSync(path.join(process.cwd(), ".postcssrc"), postcssrcContent);
    updateConfig(answer);
    if (!fs.existsSync("src")) {
        fs.mkdirSync("src");
        fs.writeFileSync("src/index.css", "");
    } else {
        fs.writeFileSync("src/index.css", "");
    }
    updateCss("src/index.css");
    success();
}
else if (answer === "symfony") {
    if (!fs.existsSync(path.join(process.cwd(), 'composer.json'))) {
        console.log("\x1b[31m", "\nUnable to find 'composer.json'. Please install the frontend framework you intend to start working with initially!");
        process.exit(0);
    }
    try {
        execSync("composer require doctrine/annotations && composer require symfony/webpack-encore-bundle")
    } catch (error) {
        console.log(error.message);
    }

    installTailwind("npm install -D tailwindcss postcss postcss-loader autoprefixer && npx tailwindcss init -p");

    updateConfig(answer);
    updateCss("assets/styles/app.css");
    updateSymfonyConfig();
    success(answer);
}
else if (answer === 'meteor') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
    updateConfig(answer);
    updateCss("client/main.css");
    success(answer);
}
else if (answer === 'create-react-app') {
    isFileExists("package.json");
    installTailwind("npm install -D tailwindcss && npx tailwindcss init");
    updateConfig("solid-js");
    updateCss("src/index.css");
    success(answer);
}
else if (answer === 'astro') {
    if (fs.existsSync(path.join(process.cwd(), 'astro.config.mjs')) || fs.existsSync(path.join(process.cwd(), 'astro.config.ts'))) {
        isFileExists("package.json");
        installTailwind("npx astro add tailwind");
        success(answer);
        process.exit(0);
    }
    console.log("\x1b[31m", "\nUnable to find 'astro.config.mjs'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);
}
else if (answer === 'qwik') {
    if (fs.existsSync(path.join(process.cwd(), 'vite.config.js')) || fs.existsSync(path.join(process.cwd(), 'vite.config.ts'))) {
        isFileExists("package.json");
        installTailwind("npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
        updateConfig("next-js-src");
        updateCss("src/global.css");
        success(answer);
        process.exit(0);
    }
    console.log("\x1b[31m", "\nUnable to find 'vite.config.js'. Please install the frontend framework you intend to start working with initially!");
    process.exit(0);
}
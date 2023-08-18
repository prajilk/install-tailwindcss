import fs from "fs";
import path from "path";

const updateLaravelMixConfig = () => {
    let laravelPlugin = fs.readFileSync(path.join(process.cwd(), "webpack.mix.js"), 'utf-8');
    const index = laravelPlugin.indexOf('.postCss("resources/css/app.css", "public/css", [');
    if (index !== -1) {
        const insertIndex = index + '.postCss("resources/css/app.css", "public/css", ['.length;
        laravelPlugin = laravelPlugin.slice(0, insertIndex) + `\n\t\trequire("tailwindcss"), ` + laravelPlugin.slice(insertIndex);
    } else {
        console.log("\x1b[31m", "\aFailed to add tailwindcss as a PostCSS plugin in your webpack.mix.js file! Do it manually\n");
        console.log("\x1b[37m", 'Add "require("tailwindcss")" inside the .postCSS function as a plugin in your "webpack.mix.js" file. If you need assistance, check out this resource,');
        console.log("\x1b[34m", "\n\thttps://tailwindcss.com/docs/guides/laravel#mix");
        process.exit(0);
    }
    fs.writeFileSync(path.join(process.cwd(), "webpack.mix.js"), laravelPlugin);
}

const updateGatsbyConfig = () => {
    let gatsbyPlugin = fs.readFileSync(path.join(process.cwd(), "gatsby-config.js"), 'utf-8');
    const index = gatsbyPlugin.indexOf('plugins: [');
    if (index !== -1) {
        const insertIndex = index + 'plugins: ['.length;
        gatsbyPlugin = gatsbyPlugin.slice(0, insertIndex) + `\n\t'gatsby-plugin-postcss', ` + gatsbyPlugin.slice(insertIndex);
    } else {
        const index = gatsbyPlugin.indexOf('plugins:[');
        if (index !== -1) {
            const insertIndex = index + 'plugins:['.length;
            gatsbyPlugin = gatsbyPlugin.slice(0, insertIndex) + `\n\t'gatsby-plugin-postcss', ` + gatsbyPlugin.slice(insertIndex);
        } else {
            console.log("\x1b[31m", "\nFailed to enable the 'gatsby-plugin-postcss' in your gatsby-config.js file! Do it manually\n");
            console.log("\x1b[37m", 'Add "gatsby-plugin-postcss" inside the plugins array of the module.exports object in your "gatsby-config.js" file. If you need assistance, check out this resource,');
            console.log("\x1b[34m", "\n\thttps://tailwindcss.com/docs/guides/gatsby");
            process.exit(0);
        }
    }
    fs.writeFileSync(path.join(process.cwd(), "gatsby-config.js"), gatsbyPlugin)
}

const updateRemixConfig = () => {
    let remixPlugin = fs.readFileSync(path.join(process.cwd(), "remix.config.js"), 'utf-8');
    const index = remixPlugin.indexOf('module.exports = {');
    if (index !== -1) {
        const insertIndex = index + 'module.exports = {'.length;
        remixPlugin = remixPlugin.slice(0, insertIndex) + `\n\ttailwind: true, ` + remixPlugin.slice(insertIndex);
    } else {
        const index = remixPlugin.indexOf('module.exports={');
        if (index !== -1) {
            const insertIndex = index + 'module.exports={'.length;
            remixPlugin = remixPlugin.slice(0, insertIndex) + `\n\ttailwind: true, ` + remixPlugin.slice(insertIndex);
        } else {
            console.log("\x1b[31m", "\nFailed to set the tailwind flag in your remix.config.js file! Do it manually\n");
            console.log("\x1b[37m", 'Add "tailwind: true" in the module.exports object in your remix.config.js file. If you need assistance, check out this resource,');
            console.log("\x1b[34m", "\n\thttps://tailwindcss.com/docs/guides/remix");
            process.exit(0);
        }
    }
    fs.writeFileSync(path.join(process.cwd(), "remix.config.js"), remixPlugin);
}

const updateSymfonyConfig = () => {
    let symfonyPlugin = fs.readFileSync(path.join(process.cwd(), "webpack.config.js"), 'utf-8');
    const index = symfonyPlugin.indexOf(".setPublicPath('/build')");
    if (index !== -1) {
        const insertIndex = index + ".setPublicPath('/build')".length;
        symfonyPlugin = symfonyPlugin.slice(0, insertIndex) + `\n\t.enablePostCssLoader()\n` + symfonyPlugin.slice(insertIndex);
    } else {
        const index = symfonyPlugin.indexOf(".setPublicPath('/build/')");
        if (index !== -1) {
            const insertIndex = index + ".setPublicPath('/build/')".length;
            symfonyPlugin = symfonyPlugin.slice(0, insertIndex) + `\n\t.enablePostCssLoader()\n` + symfonyPlugin.slice(insertIndex);
        } else {
            console.log("\x1b[31m", "\nFailed to enable PostCSS Loader in your webpack.config.js file! Do it manually\n");
            console.log("\x1b[37m", 'Add ".enablePostCssLoader()" in Encore in your webpack.config.js file. If you need assistance, check out this resource,');
            console.log("\x1b[34m", "\n\thttps://tailwindcss.com/docs/guides/symfony");
            process.exit(0);
        }
    }
    fs.writeFileSync(path.join(process.cwd(), "webpack.config.js"), symfonyPlugin);
}

export {
    updateLaravelMixConfig,
    updateGatsbyConfig,
    updateRemixConfig,
    updateSymfonyConfig
}
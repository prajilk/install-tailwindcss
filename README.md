# Install Tailwind on any Framework

This package install necessary packages and fully configure tailwindcss for any frontend Framework.

## Usage

Run the following command,

```bash
npx install-tailwindcss
```

Then follow the prompts!

You can also directly specify the framework name you want to use via additional command line options. For example, run:

Replace `<framework>` with your desired frontend framework.
Replace `<tool>` with your desired tool if any.

```bash
# npx install-tailwindcss <framework> -t <tool if any>
npx install-tailwindcss vite -t react
```

Currently supported frameworks:

- `next-js`
- `laravel`
- `vite`
- `gatsby`
- `solid-js`
- `angular`
- `ruby-on-rails`
- `remix`
- `parcel`
- `symfony`
- `meteor`
- `create-react-app`
- `astro`
- `qwik`

Tool `-t` or `-tool` is only available for `laravel & vite`

Available Tools for:

- `laravel: [vite, laravel-mix]`
- `vite: [react, vue, svelte]`

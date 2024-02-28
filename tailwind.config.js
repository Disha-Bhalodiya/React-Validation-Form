/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {

            screens: {
                xxs: "220px",

                xs: "426px",

                mxs: "660px",

                md: '769px',

                lg: '900px',

                mlg: '1210px',

                llg: '1440px',

                xl: '1680px',

            },
        },
    },
    plugins: [],
}
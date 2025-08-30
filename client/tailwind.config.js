/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            screens: {
                tb: "850px", // custom breakpoint
            },
            fontSize: {
                base: "17px", // default was 16px, now slightly larger
                sm: "15px",
                lg: "19px",
                xl: "21px",
                "2xl": "24px",
                "3xl": "30px",
                "4xl": "36px",
                "5xl": "48px",
                "6xl": "60px",
                "7xl": "72px",
            },
        },
    },
    plugins: [],
};

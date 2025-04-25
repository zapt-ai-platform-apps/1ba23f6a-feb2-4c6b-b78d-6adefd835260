export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                frost: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#b9e6fe',
                    300: '#7cd4fd',
                    400: '#36bffa',
                    500: '#0ca5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                ice: {
                    50: '#f2f8fd',
                    100: '#e7f2fb',
                    200: '#d5e7f8',
                    300: '#b9d7f3',
                    400: '#97bfec',
                    500: '#6a9fe0',
                    600: '#4e7fd2',
                    700: '#3f68c0',
                    800: '#38569d',
                    900: '#32497d',
                },
                warlord: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#262626',
                },
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'frost-pattern': "url('/images/frost-pattern.svg')",
                'ice-texture': "url('/images/ice-texture.png')",
                'hero-bg': "url('/images/hero-bg.jpg')",
            },
            boxShadow: {
                'frost': '0 0 15px rgba(56, 182, 255, 0.5)',
                'ice': '0 0 20px rgba(208, 235, 255, 0.7)',
            },
        },
    },
    plugins: [],
};
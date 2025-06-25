/** @type {import('tailwindcss').Config} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // 'purple': '#5A076E',
        'primary': '#1DA1F2',
        'primaryDark': '#0A74DA',
        // 'purple-hover': '#9B06BF',
        // 'blue': '#468EC3',
        // 'green': '#108A32',
        // 'yellow': '#FFC107',
        // 'secondary': '#9F4942',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}


// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}"
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#1DA1F2", // Twitter Blue
//         primaryDark: "#0A74DA"
//       },
//     },
//   },
//   plugins: [],
// };



// export default {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         inter: ["Inter", "sans-serif"],
//       },
//       colors: {
//         primary: "#1DA1F2",
//         primaryDark: "#0A74DA",
//       },
//     },
//   },
//   plugins: [],
// };

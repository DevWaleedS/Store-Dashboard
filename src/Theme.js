import { createTheme } from '@mui/material/styles';


// COLOR TOKEN
export const tokens = () => ({
	primary: {
		100: '#ccdae1',
		200: '#9ab5c3',
		300: '#6790a6',
		400: '#356b88',
		500: '#02466a',
		600: '#023855',
		700: '#012a40',
		800: '#011c2a',
		900: '#000e15',
	},
	second: {
		100: '#d2f1f2',
		200: '#a5e4e5',
		300: '#77d6d8',
		400: '#4ac9cb',
		500: '#1dbbbe',
		600: '#179698',
		700: '#117072',
		800: '#0c4b4c',
		900: '#062526',
	},
	yellow: {
		100: '#f0f2d6',
		200: '#e2e5ae',
		300: '#d3d885',
		400: '#c5cb5d',
		500: '#b6be34',
		600: '#92982a',
		700: '#6d721f',
		800: '#494c15',
		900: '#24260a',
	},
	blue: {
		100: '#cce4ff',
		200: '#99c9ff',
		300: '#66adff',
		400: '#3392ff',
		500: '#0077ff',
		600: '#005fcc',
		700: '#004799',
		800: '#003066',
		900: '#001833',
	},
	green: {
		100: '#d8f9e3',
		200: '#b0f4c7',
		300: '#89eeac',
		400: '#61e990',
		500: '#3ae374',
		600: '#2eb65d',
		700: '#238846',
		800: '#175b2e',
		900: '#0c2d17',
	},
	orange: {
		100: '#ffecd1',
		200: '#ffd9a3',
		300: '#ffc576',
		400: '#ffb248',
		500: '#ff9f1a',
		600: '#cc7f15',
		700: '#995f10',
		800: '#66400a',
		900: '#332005',
	},
	red: {
		100: '#ffd7d7',
		200: '#ffafaf',
		300: '#ff8888',
		400: '#ff6060',
		500: '#ff3838',
		600: '#cc2d2d',
		700: '#992222',
		800: '#661616',
		900: '#330b0b',
	},
	indigo: {
		100: '#dcdcdc',
		200: '#b9b9b9',
		300: '#969696',
		400: '#737373',
		500: '#505050',
		600: '#404040',
		700: '#303030',
		800: '#202020',
		900: '#101010',
	},

	gray: {
		100: '#ededed',
		200: '#dcdcdc',
		300: '#cacaca',
		400: '#b9b9b9',
		500: '#a7a7a7',
		600: '#868686',
		700: '#646464',
		800: '#434343',
		900: '#212121',
	},

	white: {
		100: '#fffffff7',
		200: '#fefefeef',
		300: '#fdfdfde6',
		400: '#fdfdfdde',
		500: '#fcfcfcd6',
		600: '#bbbbbbde',
		700: '#838383e6',
		800: '#525252ef',
		900: '#272727f7',
	},
	black: {
		100: '#ccd1d3',
		200: '#99a2a7',
		300: '#67747b',
		400: '#34454f',
		500: '#011723',
		600: '#01121c',
		700: '#010e15',
		800: '#00090e',
		900: '#000507',
	},
});

// MUI THEME SETTING
export const themeSettings = () => {
	const colors = tokens();

	return {
		palette: {
			primary: {
				main: colors.primary[500],
			},

			secondary: {
				main: colors.second[500],
			},

			neutral: {
				dark: colors.gray[700],
				main: colors.gray[500],
				light: colors.gray[500],
			},

			background: {
				default: '#fcfcfc',
			},
		},

		typography: {
			fontFamily: ['Tajawal', 'sans-serif'].join(''),
			fontSize: 18,

			h1: {
				fontFamily: ['Tajawal', 'sans-serif'].join(''),
				fontSize: 54,
			},

			h2: {
				fontFamily: ['Tajawal', 'sans-serif'].join(''),
				fontSize: 48,
			},

			h3: {
				fontFamily: ['Tajawal', 'sans-serif'].join(''),
				fontSize: 38,
			},

			h4: {
				fontFamily: ['Tajawal', 'sans-serif'].join(''),
				fontSize: 28,
			},

			h5: {
				fontFamily: ['Tajawal', 'sans-serif'].join(''),
				fontSize: 24,
			},

			h6: {
				fontFamily: ['Tajawal', 'sans-serif'].join(''),
				fontSize: 18,
			},
		},
	};
};

// Content for color mode
export const theme = createTheme(themeSettings());

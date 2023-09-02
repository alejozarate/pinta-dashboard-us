/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		screens: {
			desktop: { max: '1452px' },
			laptop: { max: '1250px' },
			mobile: { max: '950px' },
		},
		extend: {
			letterSpacing: {
				normal: '-0.011em ',
			},
			lineHeight: {
				normal: '100%',
			},
			flex: {
				2: '2',
				3: '3',
			},
			colors: {
				primary: '#034030',
				lightPrimary: '#15BB93',
				black: '#252529',
				offWhite: '#F5F6FA',
				grayBackground: '#F2F4F7',
				grayText: '#737480',
				grayIcons: '#A9AAB5',
				borderGray: '#DFE0EB',
				loading: '#DFE0EB',
			},
			fontSize: {
				labelTitle: '24px',
			},
			borderWidth: {
				1: '1px',
				12: '12px',
			},
			borderRadius: {
				1: '4px',
				2: '8px',
				3: '12px',
				4: '16px',
				5: '20px',
				6: '24px',
				7: '28px',
				8: '32px',
			},
		},
	},
	plugins: [],
}

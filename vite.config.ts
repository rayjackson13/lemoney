import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg'

export default defineConfig({
	plugins: [
		tailwindcss(), 
		sveltekit(), 
		svg({
			includePaths: ['./src/assets/icons'], // adjust to your SVG folder
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
						params: {
						overrides: {
							removeViewBox: false, // keep viewBox for scaling
						},
						},
					},
				],
			},
		}),
	],
	assetsInclude: ['**/*.svg'], // Ensures SVGs can be imported as strings
});

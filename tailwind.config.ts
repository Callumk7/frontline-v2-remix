import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontSize: {
				title: ["12rem", "3rem"],
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
			colors: {
				background: {
					DEFAULT: "hsl(var(--background-1))",
					"2": "hsl(var(--background-2))",
					"3": "hsl(var(--background-3))",
					menu: "hsl(var(--background-menu))",
					hover: "hsl(var(--background-hover))",
				},
				foreground: {
					DEFAULT: "hsl(var(--foreground))",
					muted: "hsl(var(--foreground-muted))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
					accent: "hsl(var(--destructive-accent))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				alt: {
					DEFAULT: "hsl(var(--alt))",
					foreground: "hsl(var(--alt-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				ring: "hsl(var(--ring))",
				input: "hsl(var(--input))",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

module.exports = {
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
	setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
	},
	testEnvironment: "jsdom",
	collectCoverageFrom: [
		"<rootDir>/components/**/*.js",
		"<rootDir>/pages/**/*.js",
		"<rootDir>/hooks/**/*.js",
		"<rootDir>/store/**/*.js",
	],
};

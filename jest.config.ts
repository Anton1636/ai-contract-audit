import type { Config } from 'jest'

const config: Config = {
	testEnvironment: 'jsdom',
	forceExit: true,
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},
	testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx)'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/app/layout.tsx',
	],
}

export default config

import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ["./dev/test/**/*.test.js"],
        coverage: {
            include: ["./dev/src/**/*.js"]
        }
    },
})
// security-config.js

// [INSTRUCTION_B]
// This array is your "group" of non-authenticated routes.
// The auth middleware will read this list to bypass JWT checks.
// We use 'startsWith' logic, so '/auth/login' also matches '/auth/login/google'
// [INSTRUCTION_E]
const publicPaths = [
    '/health',

    '/auth/login',
    '/auth/register',

    '/lmao'
];

module.exports = {
    publicPaths
};
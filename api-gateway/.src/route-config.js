// route-config.js
require('dotenv').config();

// [INSTRUCTION_B]
// This array defines all proxy configurations for the gateway.
// 'prefix' is the path the gateway listens for.
// 'proxyConfig' is the object passed directly to createProxyMiddleware.
// [INSTRUCTION_E]
const routes = [
    {
        // --- Auth Service (Complex Rules) ---
        prefix: '/auth',
        proxyConfig: {
            target: `http://localhost:8080/auth`,
            pathRewrite: {
                // Gateway: /auth/change-password -> Service: /private/change-password
                '^/change-password': '/private/change-password',

                // Gateway: /auth/login -> Service: /public/login
                '^/login': 'public/login',

                // Gateway: /auth/register -> Service: /public/register
                '^/register': 'public/register',
            }
        }
    },
    {
        // --- Request Service (Simple Rule) ---
        prefix: '/requests',
        proxyConfig: {
            target: 'http://localhost:3002',
            pathRewrite: {
                '^/': 'requests/',
            }
        }
    },

    {
        prefix: '/user-profile',
        proxyConfig: {
            target: 'http://localhost:8080/user-profile',
            pathRewrite: {
                '^/': 'public/',
            }
        }
    }
    //     {
    //         // --- Order Service (Example of another simple rule) ---
    //         prefix: '/orders',
    //         proxyConfig: {
    //             target: 'http://localhost:3003',
    //             pathRewrite: {
    //                 '^/orders': '',
    //             }
    //         }
    //     }
    //     // [INSTRUCTION_B]
    //     // Add any new services here by adding a new object to this array.
    //     // [INSTRUCTION_E]
];

module.exports = routes;
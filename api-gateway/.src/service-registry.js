/**
 * A simple service registry configuration.
 * Each entry defines a route prefix and its target microservice.
 */
const services = [
    // [INSTRUCTION_B]
    // Add your new services here.
    // e.g., { prefix: '/orders', target: 'http://localhost:3003' }
    // [INSTRUCTION_E]
    {
        prefix: '/auth',
        target: 'http://localhost:8080/auth'
    },
    {
        prefix: '/service-request',
        target: 'http://localhost:3002'
    }
];

module.exports = services;
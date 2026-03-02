import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subscription Management Backend API',
      version: '1.0.0',
      description: 'API documentation for the Subscription-Based Content Application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
        adminCookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'adminToken',
        }
      },
    },
  },
  apis: ['./routes/*.js'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

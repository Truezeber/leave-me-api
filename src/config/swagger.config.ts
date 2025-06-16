export const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Leave Me API',
      version: '1.0.0',
      description: 'Leave Me API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Localhost server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

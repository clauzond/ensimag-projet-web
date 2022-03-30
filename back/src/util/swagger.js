import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = [
	'src/routes/router.js',
	'src/routes/histoire.js',
	'src/routes/login.js'
];
swaggerAutogen()(outputFile, endpointsFiles);

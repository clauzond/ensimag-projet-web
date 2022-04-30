import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		version: '1.0.0',
		title: 'API Le livre dont vous êtes le héros',
		description: `Most endpoints here require authentification. To call these, include your user token in the <code>x-access-token</code> header.

<li>To get an token, check the <b>/api/register</b> endpoint.</li>
<li>Endpoints prefixed with <b>readOnly</b> can be queried without authentification.</li>`
	},
	host: 'localhost:3000',
	basePath: '/',
	schemes: ['http', 'https'],
	consumes: ['application/json'],
	produces: ['application/json'],
	tags: [
		{
			name: 'Authentification',
			description:
				'Register and login an user (no token required to use).'
		},
		{
			name: 'Readonly',
			description: 'Endpoint accessible without logging in'
		},
		{
			name: 'Users',
			description: 'Get current and other users'
		},
		{
			name: 'Story',
			description: 'Create, read, update and delete stories'
		},
		{
			name: 'Paragraph',
			description: 'Create, read, update and delete paragraphs of a story'
		},
		{
			name: 'History',
			description: 'Manage your history for a given story'
		}
	],
	securityDefinitions: {
		apiKeyAuth: {
			type: 'apiKey',
			in: 'header', // can be "header", "query" or "cookie"
			name: 'x-access-token' // name of the header, query parameter or cookie
		}
	},
	definitions: {
		AddStory: {
			$titre: "L'histoire de clauzond",
			estOuverte: true,
			estPublique: true
		},
		AddUser: {
			$username: 'clauzond',
			$password: 'clauzonmdp'
		},
		Paragraphe: {
			$id: 1,
			$contenu:
				"[sonnerie qui retentit au loin, vous vous réveillez en D208] 'Tiens, c'est bizarre... J'ai du m'assoupir sur mon diagramme de séquence, il fait déjà nuit, il faut que je trouve un moyen de sortir de la salle.'",
			$estVerrouille: false,
			$estConclusion: false,
			$idRedacteur: 'root'
		},
		Histoire: {
			$id: 1,
			$titre: 'Coincé en D208',
			$estOuverte: false,
			$estPublique: true,
			$idAuteur: 'root',
			$idParagrapheInitial: '1'
		},
		HistoirePara: {
			$id: 1,
			$titre: 'Coincé en D208',
			$estOuverte: false,
			$estPublique: true,
			$idAuteur: 'root',
			$idParagrapheInitial: '1',
			$paragrapheInitial: { $ref: '#/definitions/Paragraphe' }
		},
		Choix: {
			$titreChoix: "Se diriger vers la porte d'entrée",
			$condition: null,
			$ParagrapheId: 1,
			$ChoixId: 2
		}
	}
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['src/routes/*.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const checkJwt = jwt({
	// Dynamically provide a signing key
	// based on the kid in the header and
	// the signing keys provided by the JWKS endpoint.
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://dmcchat.auth0.com/.well-known/jwks.json`,
	}),

	// Validate the audience and the issuer.
	audience: 'http://dmcchat.com',
	issuer: `https://dmcchat.auth0.com/`,
	algorithms: ['RS256'],
});

module.exports = checkJwt;

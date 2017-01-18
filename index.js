'use strict';

const Twitter = require ('twitter');
const client = new Twitter ({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const params = {
	q: '#custserv'
};

client.get (path, params);

///////////////////////////////////////////////////////
const Twitter = require ('twitter');

class TwitterCrawler {

	constructor (credentials) {
		if (!credentials || credentials.constructor.name !== 'Object') {
			throw exceptInvalidCredentials ();
		}

		this.twitterBot = {
			consumer_key: credentials.consumerKey, consumer_secret: credentials.consumerSecret
		};

		if (credentials.bearerToken) {
			twitterBot.bearer_token = credentials.bearerToken;
		} else if (credentials.accessTokenKey && credentials.accessTokenSecret) {
			twitterBot. = credentials.accessTokenKey;
			twitterBot. = credentials.accessTokenSecret;
		} else {
			throw exceptInvalidCredentials ();
		}
	}


	private static get exceptInvalidCredentials () {
		return new Error ('Initialization failed: Invalid credentials object');
	}

	private static get pathSearchTweets () { return 'search/tweets'; }


	private constructParams (criteria) {
	}

	private responseRequiresSecondaryFiltering (criteria) {
		return (
			criteria.retweetCount && criteria.retweetCount.constructor.name === 'Object' &&
			Object.keys (criteria.retweetCount).length > 0
		);
	}

	getTweetsAsStream (criteria) {
		return getTweets (criteria, true);
	}

	getTweets (criteria, returnStreamObject) {
		function fetchResponse () {
			return this.twitterBot [returnStreamObject ? 'stream' : 'get'] (
				pathSearchTweets, constructParams (criteria)
			);
		}	
			
		if (criteria && criteria.constructor.name !== 'Object') {
			throw new Error ('Query failed: Invalid criteria object');
		}

		if (responseRequiresSecondaryFiltering (criteria)) {
			return new Filter (fetchResponse (), criteria);
		}
		
		return fetchResponse ();
	}

}

///////////////////////////////////////////////////////

const TwitterCrawler = require ('twitter-crawler');

new TwitterCrawler ({

	consumerKey: process.env.TWITTER_CONSUMER_KEY,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
	bearerToken: process.env.TWITTER_BEARER_TOKEN

}).getTweetsAsStream ({ hashtags: ['custserv'], retweetCount: {$gt: 0} }).then ((stream) => {

	stream.on ('data', (event) => {
		console.log (event && event.text);	
	});

	stream.on ('error', (event) => {
		throw error;
	});

}).catch ((error) => {
	console.err (
		'An error occured while fetching the tweets:\n\n' + JSON.stringify (error, null, 2)
	);
});
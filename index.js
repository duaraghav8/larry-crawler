'use strict';

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

module.exports = TwitterCrawler;
'use strict';

const Twitter = require ('twitter');

class TwitterCrawler {

	constructor (credentials) {
		if (
			!credentials || credentials.constructor.name !== 'Object' ||
			!(typeof credentials.consumerKey === 'string' && typeof credentials.consumerSecret === 'string')
		) {
			throw TwitterCrawler._exceptInvalidCredentials ();
		}

		const twitterBotCredentials = {
			consumer_key: credentials.consumerKey, consumer_secret: credentials.consumerSecret
		};

		if (credentials.bearerToken) {
			twitterBotCredentials.bearer_token = credentials.bearerToken;
		} else if (credentials.accessTokenKey && credentials.accessTokenSecret) {

			twitterBotCredentials.access_token_key = credentials.accessTokenKey;
			twitterBotCredentials.access_token_secret = credentials.accessTokenSecret;

		} else {
			throw exceptInvalidCredentials ();
		}

		this.twitterBot = new Twitter (twitterBotCredentials);
	}



	// Exceptions
	static _exceptInvalidCredentials () {
		return new Error ('Initialization failed: Invalid credentials object');
	}
	static _exceptInvalidCriteria () {
		reuturn new Error ('Query failed: Invalid criteria object');
	}

	// Static Constants
	static get TWEET_COUNT_PER_CALL () { return 11; } /*****************************/
	static get PATH_SEARCH_TWEETS () { return 'search/tweets'; }


	// Private Methods
	_constructParams (criteria) {
		if (criteria.hashtags) {
			const q = criteria.hashtags.reduce ((queryString, currentTag) => {
				return queryString ? (queryString + ' OR ' + currentTag) : currentTag;
			}, '');

			return { q, count: TwitterCrawler.TWEET_COUNT_PER_CALL, max_id: criteria.maxId };
		}

		throw _exceptInvalidCriteria ();
	}

	_responseRequiresSecondaryFiltering (criteria) {
		return (
			criteria.retweetCount && criteria.retweetCount.constructor.name === 'Object' &&
			Object.keys (criteria.retweetCount).length > 0
		);
	}


	/**
	 * Public methods
	 */
	getTweets (criteria) {
		if (!criteria || criteria.constructor.name !== 'Object' || !Object.keys (criteria).length) {
			throw _exceptInvalidCriteria ();
		}

		if (this._responseRequiresSecondaryFiltering (criteria)) {
			return new Filter (
				this.twitterBot.get (TwitterCrawler.PATH_SEARCH_TWEETS, this._constructParams (criteria)), criteria
			);
		}
		
		return this.twitterBot.get (TwitterCrawler.PATH_SEARCH_TWEETS, this._constructParams (criteria));
	}

}

module.exports = TwitterCrawler;
'use strict';

const Twitter = require ('twitter'), {SecondaryFilterForTweets} = require ('./secondary-filter');

class TwitterCrawler {

	/**
 	 * Create a twitter object initialized with given credentials. Do NOT perform any requests here.
 	 *
 	 * @param {Object} credentials - Twitter App / User account auth tokens
 	 */
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
			throw TwitterCrawler._exceptInvalidCredentials ();
		}

		this.twitterBot = new Twitter (twitterBotCredentials);
	}



	// Exceptions
	static _exceptInvalidCredentials () {
		return new Error ('Initialization failed: Invalid credentials object');
	}
	static _exceptInvalidCriteria () {
		return new Error ('Query failed: Invalid criteria object');
	}
	static _exceptInvalidMaxId () {
		return new Error ('Invalid maxId field in criteria, must be a 64-bit Integer');
	}

	// Static Constants
	static get TWEET_COUNT_PER_CALL () { return 100; }
	static get PATH_SEARCH_TWEETS () { return 'search/tweets'; }


	// Private Methods

	/**
 	 * Translate the criteria supplied by user into the query params expected by Twitter API
 	 *
 	 * @param {Object} criteria
 	 * @param {String} maxIdString - Optional - the max_id param in api request is set if this value exists
 	 */
	_constructParams (criteria, maxIdString) {
		if (criteria.hashtags) {
			const q = criteria.hashtags.reduce ((queryString, currentTag) => {
				if (currentTag [0] != '#') {
					currentTag = '#' + currentTag;
				}

				return queryString ? (queryString + ' OR ' + currentTag) : currentTag;
			}, '');

			const params = { q, count: TwitterCrawler.TWEET_COUNT_PER_CALL };

			if (maxIdString) {
				if (typeof maxIdString !== 'string') {
					throw TwitterCrawler._exceptInvalidMaxId ();
				}

				params.max_id = maxIdString;
			}

			return params;
		}

		throw TwitterCrawler._exceptInvalidCriteria ();
	}


	/**
 	 * Check if a user criteria is requesting a secondary filter, i.e, filter not supported by Twitter API.
 	 * In our case, secondary filter is retweet_count > 0.
 	 * Return true if sec. filter is required, false otherwise.
 	 *
 	 * @param {Object} criteria
 	 */
	_responseRequiresSecondaryFiltering (criteria) {
		return (
			criteria.retweetCount && criteria.retweetCount.constructor.name === 'Object' &&
			Object.keys (criteria.retweetCount).length > 0
		);
	}



	// Public methods

	/**
 	 * Function exposed via TwitterCrawler Object to fetch tweets based on criteria
 	 *
 	 * @param {Object} criteria
 	 */
	getTweets (criteria) {
		if (!criteria || criteria.constructor.name !== 'Object' || !Object.keys (criteria).length) {
			throw TwitterCrawler._exceptInvalidCriteria ();
		}

		if (this._responseRequiresSecondaryFiltering (criteria)) {

			return new SecondaryFilterForTweets (
				this.twitterBot.get (
					TwitterCrawler.PATH_SEARCH_TWEETS, this._constructParams (criteria, criteria.maxIdString)
				), criteria
			).filter ();

		}
		
		// If request doesn't require secondary filtering, simply make a request to Twitter
		// and return API response as result
		return this.twitterBot.get (
			TwitterCrawler.PATH_SEARCH_TWEETS, this._constructParams (criteria, criteria.maxIdString)
		);
	}

}

module.exports = TwitterCrawler;
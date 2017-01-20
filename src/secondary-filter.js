'use strict';

class SecondaryFilterForTweets {

	/**
 	 * Initialize the Filters for tweets
 	 *
 	 * @param {Promise Object} request - the promise which receives API response that needs secondary filtering.
 	 * @param {Object} criteria
 	 */
	constructor (request, criteria) {
		this.asyncAPIRequest = request;
		this.criteria = criteria;

	
		this._filterByRetweetCount = {
			
			// When { retweenCount: {$gt: N } }, where N = integer
			$gt: (apiResponse, operand) => {
				const res = {};

				if (typeof operand !== 'number') {
					throw new Error ('Invalid operand type for $gt clause in retweetCount field');
				}

				res.statuses = apiResponse.statuses.filter ((status) => {
					// object qualifies only if retween_count > N
					return status.retweet_count > operand;
				});

				return res;
			}

		};
	}


	/**
 	 * Launch the secondary filter and return the final (refined) API Response back to user.
 	 */
	filter () {
		return this.asyncAPIRequest.then ((response) => {

			let finalResponse = response;

			if (this.criteria.retweetCount) {
				const operator = Object.keys (this.criteria.retweetCount) [0];

				try {
					finalResponse =
						this._filterByRetweetCount [operator] (response, this.criteria.retweetCount [operator]);
				} catch (exception) {
					throw new Error ('Invalid operator for criteria: retweetCount');
				}
			}

			return Promise.resolve (finalResponse);

		}).catch ((err) => {
			return Promise.reject (err);
		});
	}

}


exports.SecondaryFilterForTweets = SecondaryFilterForTweets;
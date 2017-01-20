'use strict';

class SecondaryFilterForTweets {

	constructor (request, criteria) {
		this.asyncAPIRequest = request;
		this.criteria = criteria;

	
		this._filterByRetweetCount = {
			
			$gt: (apiResponse, operand) => {
				const res = {};

				if (typeof operand !== 'number') {
					throw new Error ('Invalid operand type for $gt clause in retweetCount field');
				}

				res.statuses = apiResponse.statuses.filter ((status) => {
					return status.retweet_count > operand;
				});

				return res;
			}

		};
	}


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
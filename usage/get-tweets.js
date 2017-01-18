/**
 * This file demonstrates the usage of module larry-crawler.
 * Objective: To get all tweets with HashTag #custserv that have been re-tweeted at least once.
 *
 * A user must supply the module with a valid set of Twitter Credentials (App or User Account)
 * by create a new TwitterCrawler Object.
 *
 * This object gives the user access to functions to fetch relevant data by specifying criteria.
 */

'use strict';

const TwitterCrawler = require ('../index');

const defaults = {
	twitterConsumerKey: '',
	twitterConsumerSecret: '',
	twitterBearerToken: ''
};


new TwitterCrawler ({

	consumerKey: process.env.TWITTER_CONSUMER_KEY || defaults.twitterConsumerKey,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET || defaults.twitterConsumerSecret,
	bearerToken: process.env.TWITTER_BEARER_TOKEN || defaults.twitterBearerToken

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
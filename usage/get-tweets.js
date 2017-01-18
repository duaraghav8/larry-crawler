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
	twitterConsumerKey: 'nWijRASOdKeA3OR8w0gIixZih',
	twitterConsumerSecret: 'zgXA6nt7g1sd4r5qW3Ro1lM5z5iMF5IRJknoQDOSxGHvKqLEt5',
	twitterAccessTokenKey: '2539232378-eGkz2Y7ZEoGMLxq32QBzsrTKaxAFCNX0i0C0SoG',
	twitterAccessTokenSecret: 'bzJZhXrGTbAHf6gxz190jf1Sl7MywXYKs5uZQinzRatWY'
};


new TwitterCrawler ({

	consumerKey: process.env.TWITTER_CONSUMER_KEY || defaults.twitterConsumerKey,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET || defaults.twitterConsumerSecret,
	accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY || defaults.twitterAccessTokenKey,
	accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || defaults.twitterAccessTokenSecret

}).getTweets ({ hashtags: ['custserv']/*, retweetCount: {$gt: 0}*/ }).then ((response) => {

	const tweetCount = response.statuses.length;

	console.log (`Retrieved a total of ${tweetCount} tweets.`);
	response.statuses.forEach ((status) => {
		console.log (status.text + ' by ' + status.user.name);
	});

}).catch ((error) => {
	console.err (
		'An error occured while fetching the tweets:\n\n' + JSON.stringify (error, null, 2)
	);
});
'use strict';

const should = require ('should'),
	TwitterCrawler = require ('../src/index');

const defaults = {
	twitterConsumerKey: 'nWijRASOdKeA3OR8w0gIixZih',
	twitterConsumerSecret: 'zgXA6nt7g1sd4r5qW3Ro1lM5z5iMF5IRJknoQDOSxGHvKqLEt5',
	twitterAccessTokenKey: '2539232378-eGkz2Y7ZEoGMLxq32QBzsrTKaxAFCNX0i0C0SoG',
	twitterAccessTokenSecret: 'bzJZhXrGTbAHf6gxz190jf1Sl7MywXYKs5uZQinzRatWY'
};


const crawler = new TwitterCrawler ({

	consumerKey: process.env.TWITTER_CONSUMER_KEY || defaults.twitterConsumerKey,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET || defaults.twitterConsumerSecret,
	accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY || defaults.twitterAccessTokenKey,
	accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || defaults.twitterAccessTokenSecret

});

function hasRequiredHashTag (list, tag) {
	for (let i = 0; i < list.length; i++) {
		if (list [i].text === tag) {
			return true;
		}
	}

	return false;
}


describe ('Check if all response objects meet criteria: retweeted at least once & contains #custserv', () => {

	it ('should have hashtag #custserv & retweet_count > 0', function (done) {

		this.timeout (10000);

		const REQUIRED_HASHTAG = 'custserv',
			criteria = { hashtags: [REQUIRED_HASHTAG], retweetCount: {$gt: 0} };

		crawler.getTweets (criteria).then ((response) => {

			response.statuses.forEach ((status) => {
				const hrht = hasRequiredHashTag (status.entities.hashtags, REQUIRED_HASHTAG);

				status.retweet_count.should.be.above (0);
				(hrht).should.be.true;
			});

			done ();

		}).catch ((err) => {console.log (err);});

	});

});
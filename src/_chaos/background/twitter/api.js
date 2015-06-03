import qs from 'qs';

import RequestOAuth from '../request/OAuth';
import Limits from './limits';
import TwitterStream from './stream';

const BASE_URL = 'https://api.twitter.com/1.1/';
const STREAM_URL = 'https://userstream.twitter.com/1.1/';

const TIMELINE_LIMIT = 100;

export default class TwitterAPI {
	constructor() {
		this.limits = { };
	}

	getLimits(token = null) {
		var key = token ? token.token : '_';

		if (undefined === this.limits[key]) {
			this.limits[key] = new Limits(token);
		}

		return this.limits[key];
	}

	getConfiguration() {
		var path = BASE_URL + 'help/configuration.json';
		var limits = this.getLimits();
		var req = new RequestOAuth(path);

		if (limits.isRestricted(path)) {
			throw new Error('Request rate exceeded');
		}

		console.log('api: requesting configuration');

		return req
			.send()
			.then(function(response) {
				limits.update(path, response);
				return response;
			})
			.then(function(response) {
				return response.content;
			});
	}

	getUserInfoByParam(param, value) {
		var path = BASE_URL + 'users/show.json';
		var limits = this.getLimits();
		var req = new RequestOAuth(path);

		if (limits.isRestricted(path)) {
			throw new Error('Request rate exceeded');
		}

		console.log('api: requesting user info', param, value);

		return req
			.setRequestData(param, value)
			.setRequestData('include_entities', 1)
			.send()
			.then(function(response) {
				limits.update(path, response);
				return response;
			})
			.then(function(response) {
				return response.content;
			});
	}

	getUserInfoById(userId) {
		return this.getUserInfoByParam('user_id', userId);
	}

	getUserInfoByScreenName(screenName) {
		return this.getUserInfoByParam('screen_name', screenName);
	}

	getHomeTimeline(token, sinceId = null) {
		var path = BASE_URL + 'statuses/home_timeline.json';
		var limits = this.getLimits(token);
		var req;

		if (limits.isRestricted(path)) {
			throw new Error('Request rate exceeded');
		}

		console.log('api: requesting timeline', sinceId);

		req = new RequestOAuth(path);

		if (sinceId) {
			req.setRequestData('since_id', sinceId);
		}

		return req
			.setRequestData('count', TIMELINE_LIMIT)
			.setRequestData('include_entities', 1)
			.send(token)
			.then(function(response) {
				limits.update(path, response);
				return response;
			})
			.then(function(response) {
				return response.content;
			});
	}

	getUserStream(token) {
		var path = STREAM_URL + 'user.json';
		var stream = new TwitterStream(path, token);

		return stream.setRequestData('stringify_friend_ids', true);
	}
}

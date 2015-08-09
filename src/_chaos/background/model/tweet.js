import { IndexDirections } from 'twic-db';
import ModelJSON from '../modelJSON';
import { FieldTypes, Parser } from 'core/http/response/parser';

import Entities from 'core/entities';

import textUtils from '../twitter/text';

const parser = new Parser({
	'id_str': [FieldTypes.String, 'id'],
	'text': [FieldTypes.String, (original, tweetJSON) => {
		const entities = new Entities();
		const data = { };

		if (tweetJSON.entities) {
			entities
				.parseMentions(tweetJSON.entities.user_mentions)
				.parseUrls(tweetJSON.entities.urls)
				.parseHashtags(tweetJSON.entities.hashtags);
		}

		if (tweetJSON.extended_entities) {
			entities.parseMedia(tweetJSON.extended_entities.media);
		}

		//if (entities.getCount() === entities.getMediaCount()) {
			// @todo make tweet text empty if there is nothing more than media links
		//}

		let text = textUtils.processLineBreaks(
			entities.processText(original)
		);

		if (original !== text) {
			data.originalText = original;
		}

		data.text = text;

		const additionalData = entities.getAdditionalData();
		if (additionalData) {
			data.additional = additionalData;
		}

		return data;
	}],
	'created_at': [FieldTypes.Date, 'createTime'],
	'user': [FieldTypes.Undefined, (original, tweetJSON) => {
		const userInfo = original;

		return {
			userId: original.id_str
		};
	}],
	'in_reply_to_status_id_str': [FieldTypes.String, (original, tweetJSON) => {
		return {
			replyToId: tweetJSON['in_reply_to_status_id_str']
		};
	}],
	'retweeted_status': [FieldTypes.Undefined, (original, tweetJSON) => {
		return {
			retweetedId: original['id_str']
		};
	}]
});

const TIMELINE_TWEETS_BATCH = 'production' !== process.env.NODE_ENV ? 50 : 10;

export default class Tweet extends ModelJSON {
	static getCollectionName() {
		return 'tweets';
	}

	static getParser() {
		return parser;
	}

	static getHomeTimeline(db, userId) {
		return db
			.getStore(Tweet.getCollectionName())
			.then(function(store) {
				return store
					.getIndex('timeline')
					.getIdsByValue(userId, TIMELINE_TWEETS_BATCH, IndexDirections.BACKWARD);
			})
			.then(function(ids) {
				return Promise.all(
					ids.map(id => Tweet.getById(db, id))
				);
			});
	}

	// @todo rethink
	static getLastTimelineId(db, userId) {
		return db
			.getStore(Tweet.getCollectionName())
			.then(function(store) {
				return store
					.getIndex('timeline')
					.getIdsByValue(userId, 1, IndexDirections.BACKWARD);
			})
			.then(function(ids) {
				if (Array.isArray(ids) && ids.length) {
					return ids.pop();
				}

				return null;
			});
	}

	addTimelineUserId(userId) {
		if (undefined === this.timelineUserIds) {
			this.timelineUserIds = [];
			this.markAsChanged();
		}

		if (this.timelineUserIds.indexOf(userId) < 0) {
			this.timelineUserIds.push(userId);
			this.markAsChanged();
		}

		return this;
	}
}

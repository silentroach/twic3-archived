import Model from '../model';
import { TransactionModes } from 'core/db';

export default class Friendship extends Model {
	static getCollectionName() {
		return 'friendship';
	}

	static getByUserIds(db, userId, targetUserId) {
		return super
			.getById(db, [userId, targetUserId].join('_'));
	}

	static exists(db, userId, targetUserId) {
		return Friendship
			.getByUserIds(db, userId, targetUserId)
			.then(function(friendship) {
				if (!friendship) {
					return null;
				}

				return friendship.exists;
			});
	}

	static flush(db, userId) {
		return db
			.getStore(Friendship.getCollectionName(), TransactionModes.READ_WRITE)
			.then(function(store) {
				return store.getIndex('userId');
			})
			.then(function(idx) {
				return idx.deleteByValue(userId);
			});
	}
}

import Model from '../model';

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
			.updateByCursor(
				Friendship.getCollectionName(),
				'userId',
				IDBKeyRange.only(userId),
				function(store, cursor) {
					store.delete(cursor.primaryKey);
					cursor.continue();
				}
			);
	}
}

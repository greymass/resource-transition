import {DBSchema, openDB} from 'idb'

const dbVersion = 1

interface LocalDB extends DBSchema {
    'account-cache': {
        key: string // <chain_id>-<account_name>
        value: {
            updated: Date // last fetched
            account: any // JSON encoded API.v1.AccountObject
        }
        indexes: {
            'by-updated': Date
        }
    }
}

export const dbPromise = openDB<LocalDB>('resource-transition', dbVersion, {
    upgrade(db, version) {
        if (version < 1) {
            const accountCache = db.createObjectStore('account-cache')
            accountCache.createIndex('by-updated', 'updated', {unique: false})
        }
    },
})

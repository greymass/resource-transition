import {API, Name} from '@greymass/eosio'
import type {Checksum256} from '@greymass/eosio'

import {dbPromise} from './db'
import {client} from './api-client'

/** How old a cached account is before we update it */
const maxAge = 60 * 1000 // ms

export interface AccountResponse {
    /** The account object for the requested account. */
    account?: API.v1.AccountObject
    /** Whether the account is being updated in the background.  */
    stale: boolean
    /** Set if an error occurred while fetching the account. */
    error?: Error
}

function accountKey(name: Name, chainId: Checksum256) {
    return `${chainId}-${name}`
}

export async function storeAccount(account: API.v1.AccountObject, chainId: Checksum256) {
    const db = await dbPromise
    db.put(
        'account-cache',
        {
            account: JSON.parse(JSON.stringify(account)),
            updated: new Date(),
        },
        accountKey(account.account_name, chainId)
    )
}

export async function loadAccount(
    name: Name,
    chainId: Checksum256,
    set: (v: AccountResponse) => void
) {
    const key = accountKey(name, chainId)
    let db = await dbPromise
    let row = await db.get('account-cache', key)
    let stale = true
    if (row) {
        const age = Date.now() - row.updated.getTime()
        stale = age > maxAge
        set({account: API.v1.AccountObject.from(row.account), stale})
    }
    if (stale) {
        const account = await client.v1.chain.get_account(name)
        await storeAccount(account, chainId)
        set({account: account, stale: false})
    }
}

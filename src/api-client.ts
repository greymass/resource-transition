import {APIClient} from '@greymass/eosio'
import {Resources} from '@greymass/eosio-resources'

export const client = new APIClient({url: 'https://eos.greymass.com'})
export const resources = new Resources({api: client})

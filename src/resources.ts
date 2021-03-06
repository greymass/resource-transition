import {derived, readable, writable} from 'svelte/store'

import {Asset} from '@greymass/eosio'
import type {SampleUsage, PowerUpState, REXState} from '@greymass/eosio-resources'

import {resources} from './api-client'

// The AccountResponse representation of the sample account
export const sampleUsage = readable<SampleUsage | undefined>(undefined, (set) => {
    resources.getSampledUsage().then((v) => set(v))

    const interval = setInterval(async () => resources.getSampledUsage().then((v) => set(v)), 30000)

    return () => {
        clearInterval(interval)
    }
})

export const getPowerUpState = async (set: (v: any) => void) =>
    set(await resources.v1.powerup.get_state())

// The state of the PowerUp system
export const statePowerUp = readable<PowerUpState | undefined>(undefined, (set) => {
    getPowerUpState(set)
    const interval = setInterval(() => getPowerUpState(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

export const getInfo = async (set: (v: any) => void) => set(await resources.api.v1.chain.get_info())

// The state of the PowerUp system
export const info = readable<any>(undefined, (set) => {
    getInfo(set)
    const interval = setInterval(() => getInfo(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

// The currently utilized capacity of PowerUp resources
export const powerupCapacity = derived(statePowerUp, ($statePowerUp) => {
    if ($statePowerUp) {
        return $statePowerUp.cpu.reserved
    }
    return 0
})

// The amount of resources shifted away from REX/Staking into PowerUp
export const resourcesShifted = derived(statePowerUp, ($statePowerUp) => {
    if ($statePowerUp) {
        return $statePowerUp.cpu.allocated
    }
    return 0
})

// Rent 1ms of the networks CPU
export const msToRent = writable<number>(1)

export const powerupPrice = derived(
    [msToRent, sampleUsage, statePowerUp, info],
    ([$msToRent, $sampleUsage, $statePowerUp, $info]) => {
        if ($msToRent && $sampleUsage && $statePowerUp && $info) {
            return Asset.from(
                $statePowerUp.cpu.price_per_ms($sampleUsage, $msToRent, $info),
                '4,EOS'
            )
        }
        return Asset.from(0, '4,EOS')
    }
)

export const getREXState = async (set: (v: any) => void) => set(await resources.v1.rex.get_state())

// The state of the REX system
export const stateREX = readable<REXState | undefined>(undefined, (set) => {
    getREXState(set)
    const interval = setInterval(() => getREXState(set), 30000)
    return () => {
        clearInterval(interval)
    }
})

// The current amount of reserved REX resources
export const rexCapacity = derived(stateREX, ($stateREX) => {
    if ($stateREX) {
        return $stateREX.reserved
    }
    return 0
})

// The price of CPU in the REX system
export const rexPrice = derived(
    [msToRent, sampleUsage, stateREX],
    ([$msToRent, $sampleUsage, $stateREX]) => {
        if ($msToRent && $sampleUsage && $stateREX) {
            return Asset.from($stateREX.price_per_ms($sampleUsage, $msToRent), '4,EOS')
        }
        return Asset.from(0, '4,EOS')
    }
)

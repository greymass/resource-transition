<script lang="ts">
    import { onMount } from 'svelte'
    import AnchorLink, {Asset, ChainId} from 'anchor-link'
    import type {TransactResult} from 'anchor-link'
    import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
    import type {LinkSession} from 'anchor-link'

    import { Powerup } from '~/abi-types'
    import {
        info,
        msToRent,
        powerupCapacity,
        powerupPrice,
        resourcesShifted,
        rexCapacity,
        rexPrice,
        sampleUsage,
        statePowerUp,
    } from '~/resources'

    const appName = 'exampleapp'
    const chainId = ChainId.from('aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906')
    const nodeUrl = 'https://eos.greymass.com'

    const transport = new AnchorLinkBrowserTransport()
    const link = new AnchorLink({
        transport,
        chains: [
            {
                chainId,
                nodeUrl,
            }
        ],
    })

    let session: LinkSession | null

	onMount(async () => {
        session = await link.restoreSession(appName)
	});

    async function login() {
        ({session} = await link.login(appName))
    }

    async function logout() {
        if (session) {
            await link.removeSession(appName, session.auth, chainId)
            session = null
        }
    }

    let transaction: TransactResult | null

    async function rent() {
        transaction = null
        if (session) {
            const us = $msToRent * 1000
            // Retrieve the cost for the specified amount of microseconds
            const cost = $statePowerUp.cpu.price_per($sampleUsage, us, $info)

            // Specify the cost as the max payment (as an Asset)
            const max_payment = Asset.from(cost, '4,EOS')

            // Determine the cpu_frac value based on the max_payment 
            const cpu_frac = $statePowerUp.cpu.frac($sampleUsage, us, $info);

            // Create the action
            const action = {
                account: 'eosio',
                name: 'powerup',
                authorization: [{
                    actor: session.auth.actor,
                    permission: session.auth.permission
                }],
                data: Powerup.from({
                    payer: session.auth.actor,
                    receiver: session.auth.actor,
                    days: $statePowerUp.powerup_days,
                    net_frac: 0,
                    cpu_frac,
                    max_payment
                })
            }
            // Send the action to the wallet and store the response
            transaction = await session.transact({ action })
        }
    }
</script>

<style type="scss">
    :global(.segment) {
        margin: 1em 0;
    }
    table {
        margin: 2em;
        tr th,
        tr td {
            border: 1px solid black;
            font-family: Monaco, 'Courier New', Courier, monospace;
            padding: 0.5em 1em;
            &:nth-child(2),
            &:nth-child(3) {
                text-align: right;
            }
        }
    }
    div {
        margin: 2em;
    }
    p {
        line-height: 1.5em;
        margin: 0.75em 0;
        em {
            margin-left: 2em;
            font-style: italic;
        }
    }
    ul {
        list-style: disc;
        margin: 1em 0.5em;
        li {
            margin: 0.5em 1.5em;
            strong {
                font-weight: bold;
            }
        }
    }
</style>

<div>
    <p>Enter the number of milliseconds to rent:</p>
    <input type="text" bind:value={$msToRent} />
    {#if session} 
        <button on:click={rent}>Rent CPU via PowerUp</button>
        <button on:click={logout}>Logout ({session.auth.actor})</button>
        <p>Price to pay: {$powerupPrice}</p>
    {:else}
        <button on:click={login}>Login with Anchor</button>
    {/if}
    {#if transaction && transaction.processed}
        <p>
            Transaction ID: <a href="https://bloks.io/transaction/{transaction.processed.id}">{transaction.processed.id}</a>
        </p>
    {/if}
</div>
<table>
    <thead>
        <tr>
            <th>System</th>
            <th>% of Resources</th>
            <th>% Reserved</th>
            <th>1-day cost</th>
            <th>30-day cost</th>
        </tr>
    </thead>
    <tr>
        <td>REX (+Staking)</td>
        {#if $resourcesShifted}
            <td>{(100 - Number($resourcesShifted) * 100).toFixed(4)}%</td>
        {/if}
        {#if $rexCapacity}
            <td>{(Number($rexCapacity) * 100).toFixed(4)}%</td>
        {/if}
        {#if $rexPrice}
            <td />
            <td>{$rexPrice}/{$msToRent}ms</td>
        {/if}
    </tr>
    <tr>
        <td>PowerUp</td>
        {#if $resourcesShifted}
            <td>{(Number($resourcesShifted) * 100).toFixed(4)}%</td>
        {/if}
        {#if $powerupCapacity}
            <td>{(Number($powerupCapacity) * 100).toFixed(4)}%</td>
        {/if}
        {#if $powerupPrice}
            <td>{$powerupPrice}/{$msToRent}ms</td>
            <td>{Asset.from($powerupPrice.value * 30, $powerupPrice.symbol)}/{$msToRent}ms</td>
        {/if}
    </tr>
</table>
<div>
    <p>Legend:</p>
    <ul>
        <li>
            <strong>% of Resources</strong>: The percentage of resources (CPU/NET) on the network
            under the control of a system.
        </li>
        <li>
            <strong>% Reserved</strong>: The percentage of resources currently being reserved/rented
            from the system.
        </li>
        <li>
            <strong>1-day cost</strong>: The cost if you were to rent 1 millisecond of CPU* for 1
            day from the system.
        </li>
        <li>
            <strong>30-day cost</strong>: The cost if you were to rent 1 millisecond of CPU* per day
            for 30 days from the system.
        </li>
    </ul>
    <p><em>* 1 millisecond of CPU is equal to ~4-5x EOS token transfers.</em></p>
</div>
<hr />
<h2>What is this all about?</h2>
<p>
    This is a temporary tool to help track the transition of the EOS network from Staking + REX to
    the new PowerUp model. During this time all network resources (CPU/NET) will slowly shift from
    both Staking and REX into the new PowerUp model. On April 8th, 2021, the transition will stop
    with 1% remaining in Staking and REX and 99% moved into the new PowerUp system.
</p>
<p>
    For more information about the PowerUp model, please refer to this <a
        href="https://t.me/eosresourcemodel/7918">PowerUp FAQ</a
    > in Telegram which contains many useful links.
</p>

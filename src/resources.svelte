<script lang="ts">
    import {Asset} from '@greymass/eosio'
    import {
        msToRent,
        powerupCapacity,
        powerupPrice,
        powerupPrice2,
        resourcesShifted,
        rexCapacity,
        rexPrice,
    } from '~/resources'
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
            <td>{$resourcesShifted.toFixed(4)}%</td>
        {/if}
        {#if $rexCapacity}
            <td>{($rexCapacity * 100).toFixed(4)}%</td>
        {/if}
        {#if $rexPrice}
            <td></td>
            <td>{$rexPrice.toFixed(4)} EOS/{$msToRent}ms</td>
        {/if}
    </tr>
    <tr>
        <td>PowerUp - Old Math</td>
        {#if $resourcesShifted}
            <td>{(100 - $resourcesShifted).toFixed(4)}%</td>
        {/if}
        {#if $powerupCapacity}
            <td>{($powerupCapacity * 100).toFixed(4)}%</td>
        {/if}
        {#if $powerupPrice}
            <td>{$powerupPrice}/{$msToRent}ms</td>
            <td>{Asset.from($powerupPrice.value * 30, $powerupPrice.symbol)}/{$msToRent}ms</td>
        {/if}
    </tr>
    <tr>
        <td>PowerUp - New Math</td>
        {#if $resourcesShifted}
            <td>{(100 - $resourcesShifted).toFixed(4)}%</td>
        {/if}
        {#if $powerupCapacity}
            <td>{($powerupCapacity * 100).toFixed(4)}%</td>
        {/if}
        {#if $powerupPrice2}
            <td>{$powerupPrice2}/{$msToRent}ms</td>
            <td>{Asset.from($powerupPrice2.value * 30, $powerupPrice2.symbol)}/{$msToRent}ms</td>
        {/if}
    </tr>
</table>
<div>
    <p>Enter the number of milliseconds to rent:</p>
    <input type="text" bind:value={$msToRent} />

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
            <strong>30-day cost</strong>: The cost if you were to rent 1 millisecond of CPU* per day for 30
            days from the system.
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

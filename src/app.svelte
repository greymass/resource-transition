<script lang="ts">
    import {Route} from 'tinro'
    import Resources from '~/resources.svelte'
</script>

<style lang="scss" global>
    @import './style/reset.scss';
    @import './style/global.scss';

    main {
        padding: 1em;
        max-width: 800px;
    }
</style>

<svelte:head />
<main>
    <h2>REX to PowerUp Transition</h2>
    <p>This page updates its information automatically every 30 seconds.</p>
    <Route>
        <Route path="/">
            <Resources />
        </Route>
    </Route>
    <hr />
    <p>Made with ☕️ & ❤️ by <a href="http://greymass.com">Greymass</a>.</p>
    <p><a href="https://github.com/greymass/resource-transition">Source</a></p>
</main>

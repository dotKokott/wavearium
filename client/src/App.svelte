<script lang="ts">
	import * as Tone from 'tone';



	export let name: string;

	let list = [
		{
			name: "John",
			age: 30
		},
		{
			name: "Jane",
			age: 25
		},
		{
			name: "Bob",
			age: 20
		}
	];

	function setName(newName: string) {
		name = newName;

		const synth = new Tone.Synth().toDestination();
		synth.triggerAttackRelease("C4", "8n");
	}

	// computed
	// $: doubled = count * 2

	// watch
	// $: if(count % 2 == 0) { console.log(' do something ') }


</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<button on:click={() => setName('chango')}>Change name</button>

	{#if name != 'world'}
		<p>{name} is not world</p>
	{/if}

	<ul>
		{#each list as person, i}
			<li>{person.name} is {person.age} years old</li>
		{/each}
	</ul>

	<!--
		{#await promise}
			<p>...waiting</p>
		{:then number}
			<p>The number is {number}</p>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}		
	-->

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
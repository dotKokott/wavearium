import App from './App.svelte';
import Waveforms from './Waveforms.svelte';

const app = new Waveforms({
	target: document.body,
	props: {
		// name: 'world'
	}
});

export default app;
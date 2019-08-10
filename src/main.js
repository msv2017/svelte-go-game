import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		cols:9,
		rows:9
	}
});

export default app;
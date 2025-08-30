<script lang="ts">
	import '../app.css'
	import { FirebaseController } from '$utils/firebase'

	let { children } = $props()

	FirebaseController.initialize()
</script>

{@render children()}

<template>
	<h1 class="text-red-500 text-2xl">Name : {{ user.name }}</h1>
	<h1 class="text-red-500 text-2xl">Email : {{ user.email }}</h1>
</template>

<script>
import {computed} from "@vue/runtime-core"
import {useStore} from "vuex"
export default {
	name: "Dashboard",
	setup() {
		const store = useStore()
		return {
			user: computed(() => store.state.user.data),
		}
	},
}
</script>

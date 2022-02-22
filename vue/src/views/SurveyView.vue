<template>
	<form class="space-y-8 divide-y divide-gray-200" @submit.prevent="saveSurvey">
		<div class="space-y-8 divide-y divide-gray-200">
			<div>
				<div>
					<h3 class="text-lg leading-6 font-medium text-gray-900">Profile</h3>
				</div>

				<div>
					{{ model }}
				</div>

				<div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
					<div class="sm:col-span-3">
						<label for="title" class="block text-sm font-medium text-gray-700"> Title </label>
						<div class="mt-1">
							<input type="text" v-model="model.title" name="title" id="title" autocomplete="title" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
						</div>
					</div>

					<div class="sm:col-span-6">
						<label for="description" class="block text-sm font-medium text-gray-700"> Description </label>
						<div class="mt-1">
							<textarea id="description" v-model="model.description" name="description" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md" />
						</div>
					</div>
					<!-- Status -->
					<div class="sm:col-span-6">
						<div class="flex">
							<div class="flex items-center h-5">
								<input id="status" name="status" type="checkbox" v-model="model.status" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
							</div>
							<div class="ml-3 text-sm">
								<label for="status" class="font-medium text-gray-700">Active</label>
							</div>
						</div>
					</div>
					<!--/ Status -->

					<!-- Image -->
					<div>
						<label class="block text-sm font-medium text-gray-700"> Image </label>
						<img v-if="model.image_url" :src="model.image_url" :alt="model.title" class="w-64 h-48 object-cover" />
						<div class="mt-1 flex items-center">
							<span class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-[80%] w-[80%] text-gray-300" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
								</svg>
							</span>
							<button type="button" class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								<input type="file" @change="onImageChoose" class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer" />
								Change
							</button>
						</div>
					</div>
					<!--/ Image -->
				</div>
			</div>
		</div>

		<div class="pt-5">
			<div class="flex justify-end">
				<button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
				<button type="submit" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
			</div>
		</div>
	</form>
</template>

<script setup>
import {computed, ref, watch} from "vue"
import {useRoute, useRouter} from "vue-router"
import store from "../store"

const router = useRouter()

const route = useRoute()

// Create empty survey
let model = ref({
	title: "",
	status: false,
	description: null,
	image: null,
	image_url: null,
})

// Watch to current survey data change and when this happens we update local model
watch(
	() => store.state.currentSurvey.data,
	(newVal, oldVal) => {
		model.value = {
			...JSON.parse(JSON.stringify(newVal)),
			status: !!newVal.status,
		}
	}
)

// If the current component is rendered on survey update route we make a request to fetch survey
if (route.params.id) {
	store.dispatch("getSurvey", route.params.id)
}

function onImageChoose(ev) {
	const file = ev.target.files[0]

	const reader = new FileReader()
	reader.onload = () => {
		// The field to send on backend and apply validations
		model.value.image = reader.result

		// The field to display here
		model.value.image_url = reader.result
		ev.target.value = ""
	}
	reader.readAsDataURL(file)
}

/**
 * Create or update survey
 */
function saveSurvey() {
	let action = "created"
	if (model.value.id) {
		action = "updated"
	}
	store.dispatch("saveSurvey", {...model.value}).then(({data}) => {
		router.push({
			name: "Survey",
		})
		store.commit("notify", {
			type: "success",
			message: "The survey was successfully " + action,
		})
	})
}
</script>

<style></style>

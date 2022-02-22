<template>
	<div class="flex flex-col">
		<div class="flex justify-end py-2">
			<router-link :to="{name: 'SurveyCreate'}" class="bg-cyan-300 px-4 py-2 rounded-md text-white"> Create </router-link>
		</div>
		<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
				<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(survey, index) in surveys.data" :key="index" :class="personIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ index + 1 }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ survey.title }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ survey.description }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ survey.status }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ survey.created_at }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div class="flex space-x-2">
										<router-link :to="{name: 'SurveyView', params: {id: survey.id}}" class="text-indigo-600 hover:text-indigo-900">Edit</router-link>
										<button @click="deleteSurvey(survey)" class="text-indigo-600 hover:text-indigo-900">Delete</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<!-- Pagination -->
					<div class="flex justify-center mt-5">
						<nav class="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px" aria-label="Pagination">
							<!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
							<a
								v-for="(link, i) of surveys.links"
								:key="i"
								:disabled="!link.url"
								href="#"
								@click="getForPage($event, link)"
								aria-current="page"
								class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap"
								:class="[link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', i === 0 ? 'rounded-l-md bg-gray-100 text-gray-700' : '', i === surveys.links.length - 1 ? 'rounded-r-md' : '']"
								v-html="link.label"
							>
							</a>
						</nav>
					</div>
					<!--  -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed} from "@vue/runtime-core"
import store from "../store"

const surveys = computed(() => store.state.surveys)
store.dispatch("getSurveys")
function deleteSurvey(survey) {
	if (confirm(`Are you sure you want to delete this survey? Operation can't be undone!!`)) {
		store.dispatch("deleteSurvey", survey.id).then(() => {
			store.dispatch("getSurveys")
		})
	}
}
function getForPage(ev, link) {
	ev.preventDefault()
	if (!link.url || link.active) {
		return
	}

	store.dispatch("getSurveys", {url: link.url})
}
</script>

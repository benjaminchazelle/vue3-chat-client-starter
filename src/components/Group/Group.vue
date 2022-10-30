<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useMessengerStore } from '@/stores/messenger'

const clientEmits = useHighLevelClientEmits()
const messengerStore = useMessengerStore()

const { users, currentConversation } = toRefs(messengerStore)

const search = ref('')

const isSearchInput = (username: string, searchInput: string): boolean => {
	if (search.value.length <= 0) return true
	return username.toLowerCase().includes(searchInput.toLowerCase())
}

const members = computed(() =>
	users.value.filter(
		(user) =>
			currentConversation.value?.participants.includes(user.username) &&
			computed(() => isSearchInput(user.username, search.value)).value
	)
)
const community = computed(() =>
	users.value.filter(
		(user) =>
			!currentConversation.value?.participants.includes(user.username) &&
			computed(() => isSearchInput(user.username, search.value)).value
	)
)

async function addParticipant(username: string): Promise<void> {
	const id = currentConversation.value?.id
	if (!id) return

	clientEmits.addParticipant(username, id)
}

async function removeParticipant(username: string): Promise<void> {
	const conv = currentConversation.value
	if (!conv) return
	if (conv.participants.length <= 3) return

	const id = conv.id
	clientEmits.removeParticipant(username, id)
}
</script>

<template>
	<div class="group">
		<div class="ui fluid search">
			<div class="ui icon input">
				<input
					type="text"
					placeholder="Rechercher un utilisateur"
					class="prompt"
					v-model="search" />
				<i class="search icon"></i>
			</div>
		</div>
		<div class="spanner">
			<hr />
			<span>Participants</span>
			<hr />
		</div>
		<div class="user" v-for="member of members" :key="member.username">
			<img :src="member.picture_url" :alt="`Photo de ${member.username}`" />
			<span>
				{{ member.username }}
				<br />
				<i class="nickname"></i>
			</span>
			<i title="Modifier le surnom" class="circular quote left link icon"></i>
			<i
				@click="removeParticipant(member.username)"
				title="Enlever de la conversation"
				class="circular times icon link"
				style=""></i>
		</div>
		<div class="spanner">
			<hr />
			<span>Communauté</span>
			<hr />
		</div>
		<div class="user" v-for="member of community" :key="member.username">
			<img :src="member.picture_url" :alt="`Photo de ${member.username}`" />
			<span>{{ member.username }}</span>
			<i
				@click="addParticipant(member.username)"
				title="Ajouter à la conversation"
				class="circular plus icon link"></i>
		</div>
	</div>
</template>

<style scoped src="./Group.css" />

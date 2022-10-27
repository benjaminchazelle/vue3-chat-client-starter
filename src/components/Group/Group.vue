<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'
import { useMessengerStore } from '@/stores/messenger'

const messengerStore = useMessengerStore()

const { users, currentConversation } = toRefs(messengerStore)

const members = computed(() =>
	users.value.filter((user) =>
		currentConversation.value?.participants.includes(user.username)
	)
)
const search = ref('')
</script>

<template>
	<div class="group">
		<div class="ui fluid search">
			<div class="ui icon input">
				<input
					type="text"
					placeholder="Rechercher un utilisateur"
					class="prompt" />
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
				title="Enlever de la conversation"
				class="circular times icon link"
				style=""></i>
		</div>
		<div class="spanner">
			<hr />
			<span>Communauté</span>
			<hr />
		</div>
		<div class="user">
			<img src="https://source.unsplash.com/8wbxjJBrl3k/100x100" />
			<span>Cha</span>
			<i title="Ajouter à la conversation" class="circular plus icon link"></i>
		</div>
		<div class="user">
			<img src="https://source.unsplash.com/4U1x6459Q-s/100x100" />
			<span>Emilio</span>
			<i title="Ajouter à la conversation" class="circular plus icon link"></i>
		</div>
		<div class="user">
			<img src="https://source.unsplash.com/3402kvtHhOo/100x100" />
			<span>Fabrice</span>
			<i title="Ajouter à la conversation" class="circular plus icon link"></i>
		</div>
		<div class="user">
			<img src="https://source.unsplash.com/tNCH0sKSZbA/100x100" />
			<span>Benji</span>
			<i title="Ajouter à la conversation" class="circular plus icon link"></i>
		</div>
	</div>
</template>

<style scoped src="./Group.css" />

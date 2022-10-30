<script setup lang="ts">
import { onMounted, onUpdated, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Conversation } from '@/client/types/business'
import Group from '@/components/Group/Group.vue'
import Message from '@/components/Message/Message.vue'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useMessengerStore } from '@/stores/messenger'

const clientEmits = useHighLevelClientEmits()

const groupPanel = ref(false)

const scrollElement = ref<HTMLElement | null>(null)

const messengerStore = useMessengerStore()

const { users, currentConversation, authenticatedUsername } =
	toRefs(messengerStore)

const router = useRouter()

const inputSentMessage = ref('')

async function sendMessage(): Promise<void> {
	if (!currentConversation.value) return

	const temp = inputSentMessage.value
	if (replyMessage.value.user !== '') {
		await clientEmits.replyMessage(
			currentConversation.value.id,
			replyMessage.value.messageId,
			String(temp)
		)
		replyToMessage('', '', '')
	} else {
		await clientEmits.postMessage(currentConversation.value.id, String(temp))
	}
	inputSentMessage.value = ''
}

function openGroupInformation(): void {
	router.push({
		name: 'GroupInformation',
		params: { id: currentConversation.value?.id },
	})
}

onMounted(() => {
	scrollBottom()
})

onUpdated(() => {
	scrollBottom()
})

watch(currentConversation, (/*newConversation, oldConversation*/) => {
	scrollBottom()
})

function scrollBottom() {
	setTimeout(() => {
		if (scrollElement.value) {
			scrollElement.value.scrollTop = scrollElement.value.scrollHeight
		}
	}, 0)
}

function titleConversation(conversation: Conversation): string {
	if (conversation.title) return conversation.title

	if (conversation.participants.length > 2) {
		return `Groupe: ${conversation.participants.join(', ')}`
	}

	const participant = conversation.participants.find(
		(participant) => participant !== authenticatedUsername.value
	)

	if (participant) {
		return participant
	}

	return 'Anonymous'
}

function getProfilePicture(participants: string[] | string): string {
	let username: string | undefined
	if (Array.isArray(participants)) {
		username = participants.find(
			(participant: string) => participant !== authenticatedUsername.value
		)
	} else {
		username = participants
	}

	const user = users.value.find((user) => user.username === username)
	if (!user) {
		return 'https://yt3.ggpht.com/JliOszS4fXEpCIs2it_vsBjwhlNWgZsboezGA7NYUtihf8F54A5I7laaj2d3zpH-io6e2fVL=s900-c-k-c0x00ffffff-no-rj' // Mmmmmh
	}

	return user.picture_url
}

function convertStringToDate(date: string): Date {
	return new Date(date)
}

function reactMessage($event: {
	message: typeof Message
	react: 'HEART' | 'THUMB' | 'HAPPY' | 'SAD'
}): void {
	if (!currentConversation.value) return
	clientEmits.reactMessage(
		$event.message.id,
		$event.react,
		currentConversation.value.id
	)
}

const replyMessage = ref({
	user: '',
	content: '',
	messageId: '',
})

function replyToMessage(
	user: string,
	content: string | null,
	messageId: string
) {
	replyMessage.value = {
		user: user,
		content: content === null ? '' : content,
		messageId: messageId,
	}
}
</script>

<template>
	<div class="conversation">
		<div class="conversation-header">
			<a @click="openGroupInformation">
				<img
					v-if="
						currentConversation && currentConversation.participants.length < 3
					"
					:src="getProfilePicture(currentConversation.participants)"
					class="avatar"
					alt="Group photo" />

				<span v-else data-v-73baddaf="">
					<i data-v-73baddaf="" class="avatar users icon"></i>
				</span>
			</a>

			<div class="title">
				<div class="ui compact">
					<i class="icon circle"></i>
					<span v-if="currentConversation">
						{{ titleConversation(currentConversation) }}
					</span>
					<div class="ui simple dropdown item">
						<i class="vertical ellipsis icon"></i>

						<div class="menu">
							<div v-if="true" class="item">
								<i class="ui icon paint brush"></i>
								Modifier le thème
							</div>
							<div v-if="true" class="item">
								<i class="ui icon edit"></i>
								Modifier le titre
							</div>
							<div v-if="true" class="item">
								<i class="ui icon volume bell slash"></i>
								Mettre en sourdine
							</div>
							<div v-if="true" class="item">
								<i class="ui icon volume bell"></i>
								Rétablir les notifications
							</div>
							<div class="item" @click="groupPanel = !groupPanel">
								<i class="ui icon users"></i>
								Gérer les participants
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conversation-container">
			<div class="conversation-main">
				<div class="conversation-body" ref="scrollElement">
					<div class="wrapper">
						<div
							class="message-container"
							v-for="message in currentConversation?.messages"
							:key="message.id">
							<div class="time">
								{{
									convertStringToDate(message.posted_at).toLocaleTimeString()
								}}
							</div>
							<Message
								:message="message"
								:url-icon="getProfilePicture(message.from)"
								@react="reactMessage($event)"
								@reply-to-message="
									replyToMessage(message.from, message.content, message.id)
								" />
						</div>
					</div>
				</div>

				<div class="typing">
					<div class="wrapper">Alice est en train d'écrire...</div>
				</div>
				<div class="conversation-footer">
					<div class="wrapper">
						<p v-if="replyMessage.user !== ''">
							<i title="Abandonner" class="circular times small icon link"></i>
							Répondre à {{ replyMessage.user }} :
							<span>{{ replyMessage.content }}</span>
						</p>

						<div class="ui fluid search">
							<div class="ui icon input">
								<input
									v-on:keyup.enter="sendMessage()"
									v-model="inputSentMessage"
									class="prompt"
									type="text"
									placeholder="Rédiger un message" />
								<i @click="sendMessage()" class="send icon"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="conversation-sidebar" v-if="groupPanel">
				<Group />
			</div>
		</div>
	</div>
</template>

<style scoped src="./Conversation.css" />

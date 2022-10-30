import { useRouter } from 'vue-router'
import type {
	CreateManyToManyConversationEmit,
	GetConversationsEmit,
	GetOrCreateOneToOneConversationEmit,
	GetUsersEmit,
	PostMessageEmit,
	AddParticipantEmit,
} from '@/client/types/emits'
import { useLowLevelClient } from '@/client/useLowLevelClient'
import { useMessengerStore } from '@/stores/messenger'

export function useHighLevelClientEmits() {
	const chatClient = useLowLevelClient()

	const messengerStore = useMessengerStore()

	const router = useRouter()

	return {
		async getUsers() {
			const { users } = await chatClient.emit<GetUsersEmit>('@getUsers', {})
			messengerStore.setUsers(users)
		},

		async postMessage(converastionId: string, message: string) {
			await chatClient.emit<PostMessageEmit>('@postMessage', {
				conversation_id: converastionId,
				content: String(message),
			})
		},

		async getConversations() {
			const { conversations } = await chatClient.emit<GetConversationsEmit>(
				'@getConversations',
				{}
			)
			messengerStore.setConversations(conversations)
		},

		async createOneToOneConversation(username: string) {
			const response =
				await chatClient.emit<GetOrCreateOneToOneConversationEmit>(
					'@getOrCreateOneToOneConversation',
					{ username }
				)

			const { conversation } = response

			messengerStore.upsertConversation(conversation)

			router.push({
				name: 'Conversation',
				params: { id: conversation.id },
			})

			return response
		},

		async createManyToManyConversation(usernames: string[]) {
			const response = await chatClient.emit<CreateManyToManyConversationEmit>(
				'@createManyToManyConversation',
				{ usernames }
			)

			const { conversation } = response

			messengerStore.upsertConversation(conversation)

			router.push({
				name: 'Conversation',
				params: { id: conversation.id },
			})

			return response
		},

		async AddParticipant(username: string, conversationID: string) {
			const response = await chatClient.emit<AddParticipantEmit>(
				'@addParticipant',
				{
					conversation_id: conversationID,
					username: username,
				}
			)
			return response
		},
	}
}

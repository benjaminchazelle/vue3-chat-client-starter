import { defineStore } from 'pinia'
import { ref, computed, toRefs } from 'vue'
import type { Conversation, User } from '@/client/types/business'
import { useAuthStore } from '@/stores/auth'

export const useMessengerStore = defineStore('messenger', () => {
    const authStore = useAuthStore()

    const { user: userRef } = toRefs(authStore)

    // State

    const usersRef = ref<User[]>([])

    const availableUsernames = ref<string[]>([])

    const conversationsRef = ref<Conversation[]>([])

    const currentConversationId = ref<string | null>(null)

    // Getters

    const authenticatedUsername = computed(
        () => userRef.value?.username || null
    )

    const users = computed(() =>
        usersRef.value.map((user) => {
            return {
                ...user,
            }
        })
    )

    const conversations = computed(() =>
        conversationsRef.value.map((conversation) => {
            return {
                ...conversation,
            }
        })
    )

    const currentConversation = computed(() => {
        return conversationsRef.value.find(
            (conversation) => conversation.id === currentConversationId.value
        )
    })

    return {
        authenticatedUsername,
        users,
        conversations,
        currentConversation,
        setConversations,
        setCurrentConversationId,
        setUsers,
        upsertUser,
        upsertConversation,
    }

    // Actions

    function setCurrentConversationId(conversationId: string | null) {
        currentConversationId.value = conversationId
    }

    function setUsers(users: User[]) {
        usersRef.value = users
    }

    function setConversations(conversations: Conversation[]) {
        conversationsRef.value = conversations
    }

    function upsertUser(user: User) {
        const userIndex = usersRef.value.findIndex(
            (_user) => _user.username === user.username
        )

        if (userIndex !== -1) {
            usersRef.value[userIndex] = { ...user }
        } else {
            usersRef.value.push({ ...user })
        }
    }

    function upsertConversation(conversation: Conversation) {
        const conversationIndex = conversationsRef.value.findIndex(
            (_conversation) => _conversation.id === conversation.id
        )

        if (conversationIndex !== -1) {
            conversationsRef.value[conversationIndex] = { ...conversation }
        } else {
            conversationsRef.value.push({ ...conversation })
        }
    }
})

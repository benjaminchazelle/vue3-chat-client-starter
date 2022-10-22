<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Conversation } from '@/client/types/business'
import { useAuthStore } from '@/stores/auth'
import { useMessengerStore } from '@/stores/messenger'

const router = useRouter()

const authStore = useAuthStore()

const messengerStore = useMessengerStore()

const { user } = toRefs(authStore)
const { logout } = authStore

const searchInput = ref('')

const { conversations } = toRefs(messengerStore)

function openCommunity() {
    router.push({ name: 'Community' })
}

function openMessageSearch() {
    router.push({ name: 'Search' })
}

function openConversation(id: Conversation['id']) {
    router.push({ name: 'Conversation', params: { id } })
}

const filteredConversations = computed(() =>
    conversations.value.filter((conversation) => {
        return conversation.title
            .toLowerCase()
            .includes(searchInput.value.toLowerCase())
    })
)
</script>

<template>
    <div class="sidebar">
        <div class="user" v-if="user">
            <div class="user-picture">
                <img :src="user.picture_url" class="ui circular image" />
            </div>

            <div class="user-info">
                <div class="user-info-pseudo">{{ user.username }}</div>

                <div class="user-info-status ui simple dropdown">
                    <div class="available text">En ligne</div>
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <div class="item" @click="logout">
                            <i class="logout icon"></i>
                            Déconnexion
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="menu">
            <div class="blue button" @click="openCommunity">
                <i class="users icon"></i>
                <br />
                <span>Communauté</span>
            </div>
            <div v-if="true" class="blue button" @click="openMessageSearch">
                <i class="search icon"></i>
                <br />
                <span>Messages</span>
            </div>
        </div>
        <div class="conversations">
            <div class="conversation-search">
                <div class="ui fluid search">
                    <div class="ui icon input">
                        <input
                            class="prompt"
                            placeholder="Rechercher une conversation"
                            type="text"
                            v-model="searchInput"
                        />
                        <i class="search icon"></i>
                    </div>
                </div>
            </div>

            <div
                class="conversation"
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                :title="conversation.title"
                @click="openConversation(conversation.id)"
                :class="{}"
            >
                <a class="avatar">
                    <img
                        src="https://source.unsplash.com/7omHUGhhmZ0/100x100"
                    />
                </a>
                <div class="content">
                    <div class="metadata">
                        <div class="title">
                            <i class="ui small icon circle"></i>
                            {{ conversation.title }}
                        </div>
                        <span class="time">{{ conversation.updated_at }}</span>
                    </div>
                    <div class="text">C'est vraiment super Alice !</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped src="./Sidebar.css" />

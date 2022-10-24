<script setup lang="ts">
import { toRefs } from 'vue'
import reacts from '@/assets/reacts.json'
import type { Message } from '@/client/types/business'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<Message>()

const authStore = useAuthStore()
const { user } = toRefs(authStore)

console.log(user)
console.log(props)
</script>

<template>
    <div v-if="user?.username === props.from" class="message mine">
        <div class="bubble top bottom">Hello les amis !</div>
        <div class="reacts"></div>
        <div class="controls">
            <i title="Supprimer" class="circular trash icon"></i>
            <i title="Editer" class="circular edit icon"></i>
            <i title="Répondre" class="circular reply icon"></i>
        </div>
    </div>
    <div v-else class="message">
        <img
            :title="props.from"
            src="https://source.unsplash.com/7omHUGhhmZ0/100x100"
            :alt="props.from"
        />
        <div class="bubble top bottom">{{ props.content }}</div>
        <div class="reacts">
            <span class="circular icon">
                1
                <i title="Aimer" class="heart outline icon"></i>
            </span>
        </div>
        <div class="controls">
            <i title="Répondre" class="circular reply icon"></i>
            <span class="react">
                <i
                    class="circular outline icon"
                    v-for="react of reacts"
                    :key="react.key"
                    :title="react.label"
                    :class="react.iconClass"
                ></i>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref, toRefs, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Group from '@/components/Group/Group.vue'
import { useMessengerStore } from '@/stores/messenger'
import type { Conversation } from '@/client/types/business'
import { client } from '@/client/useLowLevelClient'



const groupPanel = ref(false)

const scrollElement = ref<HTMLElement | null>(null)

const messengerStore = useMessengerStore()

const { users, currentConversation, authenticatedUsername } = toRefs(messengerStore)

const { setCurrentConversationId } = messengerStore

const router = useRouter()
const route = useRoute()

const inputSentMessage = ref();



const conversationId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

setCurrentConversationId(conversationId)

async function sendMessage(){
    console.log(inputSentMessage);
    /*export interface PostMessageEmit extends Emit {
        event: '@postMessage'
        authenticated: true
        payload: {
            conversation_id: string
            content: string
        }
        response: {
            message: Message
        }
    }*/
    let sentMessage = inputSentMessage
    await client.emit('@postMessage',{conversation_id : conversationId, content : inputSentMessage});
}

function openGroupInformation() {
    router.push({
        name: 'GroupInformation',
        params: { id: conversationId },
    })
}

onMounted(() => {
    scrollBottom()
})

onUpdated(() => {
    scrollBottom()
})

watch(currentConversation, (newConversation, oldConversation) => {
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

function getProfilePicture(participants: string[]): string {
    const username = participants.find(
        (participant) => participant !== authenticatedUsername.value
    )
    const user = users.value.find((user) => user.username === username)
    if (!user) {
        return 'https://yt3.ggpht.com/JliOszS4fXEpCIs2it_vsBjwhlNWgZsboezGA7NYUtihf8F54A5I7laaj2d3zpH-io6e2fVL=s900-c-k-c0x00ffffff-no-rj' // Mmmmmh
    }

    return user.picture_url
}
</script>

<template>
    <div class="conversation">
        <div class="conversation-header">
            <a @click="openGroupInformation">
                <img
                    v-if="currentConversation.participants.length < 3"
                    :src="getProfilePicture(currentConversation.participants)"
                    class="avatar"  
                />

                <span v-else data-v-73baddaf="">
                    <i data-v-73baddaf="" class="avatar users icon"></i>
                </span>
            </a>

            <div class="title">
                <div class="ui compact">
                    <i class="icon circle"></i>
                    <span>{{ titleConversation(currentConversation) }}</span>
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
                        <div class="time">01:32:08</div>
                        <div class="message mine">
                            <div class="bubble top bottom">
                                Hello les amis !
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="time">01:32:14</div>
                        <div class="message">
                            <img
                                title="Bob"
                                src="https://source.unsplash.com/7omHUGhhmZ0/100x100"
                            />
                            <div class="bubble top bottom">Hello !</div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="message">
                            <img
                                title="Alice"
                                src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
                            />
                            <div class="bubble top bottom">Coucou !</div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="time">01:32:31</div>
                        <div class="message mine">
                            <div class="bubble top bottom">
                                Vous allez bien ?
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="time">01:32:38</div>
                        <div class="message">
                            <img
                                title="Alice"
                                src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
                            />
                            <div class="bubble top bottom">
                                Oui ça va et toi ?
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="time">01:32:48</div>
                        <div class="message mine">
                            <div class="bubble top">Ca va super !</div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="message mine">
                            <div class="bubble middle">
                                Je viens de découvrir ce nouveau chat
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="message mine">
                            <div class="bubble bottom">
                                C'est vraiment chouette
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="time">01:33:32</div>
                        <div class="message">
                            <div class="bubble top">
                                Oui je l'aime beaucoup aussi
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="message">
                            <div class="bubble middle">
                                <p class="reply_content">
                                    C'est vraiment chouette
                                </p>
                                On peut répondre à un message
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="message">
                            <img
                                title="Bob"
                                src="https://source.unsplash.com/7omHUGhhmZ0/100x100"
                            />
                            <div class="bubble bottom">Ou bien y réagir</div>
                            <div class="reacts">
                                <span class="circular icon">
                                    1
                                    <i
                                        title="Aimer"
                                        class="heart outline icon"
                                    ></i>
                                </span>
                                <span class="circular icon">
                                    1
                                    <i
                                        title="Aimer"
                                        class="thumbs up outline icon"
                                    ></i>
                                </span>
                            </div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="message">
                            <img
                                title="Alice"
                                src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
                            />
                            <div class="bubble top bottom">
                                On peut même éditer ou supprimer des messages !
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="view">
                            <img
                                title="Vu par Bob à 01:35:50"
                                src="https://source.unsplash.com/7omHUGhhmZ0/100x100"
                            />
                        </div>

                        <div class="time">01:36:24</div>
                        <div class="message mine">
                            <div class="bubble top bottom">
                                Et on peut voir qui a vu un message ou non ?
                            </div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="time">01:36:31</div>
                        <div class="message">
                            <img
                                title="Alice"
                                src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
                            />
                            <div class="bubble top bottom">Oui !</div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                                <span class="react">
                                    <i
                                        title="Aimer"
                                        class="circular heart outline icon"
                                    ></i>
                                    <i
                                        title="Pouce en l'air"
                                        class="circular thumbs up outline icon"
                                    ></i>
                                    <i
                                        title="Content"
                                        class="circular smile outline icon"
                                    ></i>
                                    <i
                                        title="Pas content"
                                        class="circular frown outline icon"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div class="time">01:36:38</div>
                        <div class="message mine">
                            <div class="bubble top bottom">Incroyable !</div>
                            <div class="reacts"></div>
                            <div class="controls">
                                <i
                                    title="Supprimer"
                                    class="circular trash icon"
                                ></i>
                                <i
                                    title="Editer"
                                    class="circular edit icon"
                                ></i>
                                <i
                                    title="Répondre"
                                    class="circular reply icon"
                                ></i>
                            </div>
                        </div>
                        <div class="view">
                            <img
                                title="Vu par Alice à 01:36:39"
                                src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
                            />
                            <img
                                title="Vu par Gael à 01:36:39"
                                src="https://source.unsplash.com/OYH7rc2a3LA/100x100"
                            />
                        </div>
                    </div>
                </div>

                <div class="typing">
                    <div class="wrapper">Alice est en train d'écrire...</div>
                </div>
                <div class="conversation-footer">
                    <div class="wrapper">
                        <p>
                            <i
                                title="Abandonner"
                                class="circular times small icon link"
                            ></i>
                            Répondre à Alice :
                            <span>
                                On peut même éditer ou supprimer des messages !
                            </span>
                        </p>

                        <div class="ui fluid search">
                            <div class="ui icon input">
                                <input
                                    v-on:keyup.enter="sendMessage()"
                                    v-model="inputSentMessage"
                                    class="prompt"
                                    type="text"
                                    placeholder="Rédiger un message"
                                />
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

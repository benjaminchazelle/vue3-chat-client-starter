<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import Group from '@/components/Group/Group.vue'
import { useMessengerStore } from '@/stores/messenger'
import type { Message } from '@/client/types/business';


const messengerStore = useMessengerStore()

const { currentConversation } = toRefs(messengerStore)

const conversation: { // When the store will be updated delete this and use currentConversation
    id: string,                                                       
    type: 'one_to_one' | 'many_to_many',
    participants: string[],                                      
    messages: Array<Message>,
    title: null | string,                                               
    theme: 'BLUE' | 'RED' | 'RAINBOW',
    nicknames: Record<string, string>                               
    updated_at: string,                                                  
    seen: Record<string, { message_id: 0 | string, time: -1 | string }>,
    typing: Record<string, string>                               
} = { 
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    type: 'many_to_many',
    participants: ['Alice', 'Bob'],
    messages: [
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            from: 'Alice',
            content: 'Hello world',
            posted_at: '2021-12-13T07:41:46.720Z',
            delivered_to: { 'Alice': '2021-12-13T07:41:46.834Z' },
            reply_to: null,
            edited: false,
            deleted: false,
            reactions: {}
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            from: 'Alice',
            content: 'SUUUUUUU',
            posted_at: '2021-12-13T07:41:46.720Z',
            delivered_to: { 'Alice': '2021-12-13T07:41:46.834Z' },
            reply_to: null,
            edited: false,
            deleted: false,
            reactions: {}
        },
    ],
    title: 'SUUUUUUPER TITLE',
    theme: 'BLUE',
    nicknames: { 'Alice': 'Alicounette' },
    updated_at: '2021-12-16T07:49:02.492Z',
    seen: { 'Alice': { message_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', time: '2021-12-13T07:41:46.720Z' }, 'Bob': { message_id: 0, time: -1 } },
    typing: { 'Alice': '2021-12-13T07:41:46.720Z' },
}

const date = new Date(conversation.updated_at);

const participants: {
    name: string,
    nickname: string|undefined,
    numberOfMessages: number,
    seen: { message_id: 0 | string, time: -1 | Date }
}[] = conversation.participants.map((participant: string) => {
    let nickname: string = "-";
    let seen:  { message_id: 0 | string, time: -1 | Date } = { message_id: 0, time: -1 };
    let numberOfMessages: number = 0;

    if (conversation.nicknames[participant]) nickname = conversation.nicknames[participant];
    if (conversation.seen[participant]) {
        seen = {
            message_id: conversation.seen[participant].message_id,
            time: conversation.seen[participant].time === -1 ? -1 : new Date(conversation.seen[participant].time)
        }
    }

    if (conversation.messages.find(message => message.from === participant)) numberOfMessages = conversation.messages.map(message => message.from === participant).length;

    return { 
        name: participant,
        nickname: nickname,
        numberOfMessages: numberOfMessages,
        seen: seen
    }
})

</script>

<template>
    <div class="group-information">
        <div class="group-information-header">
            <div class="avatar">
                <i class="ui users icon"></i>
            </div>
            <h1>{{ conversation.title }}</h1>
        </div>

        <div class="group-information-container">
            <p>Last message on {{ date.toLocaleDateString() }}</p>
            <h2>Participants</h2>

            <table>
                <tr>
                    <th>Name</th>
                    <th>Nickname</th>
                    <th>Date of last message</th>
                    <th>Number of messages</th>
                </tr>
                <tr v-for="participant in participants" :key="participant.name">
                    <td>{{ participant.name }}</td>
                    <td>{{ participant.nickname }}</td>
                    <td>{{ participant.seen.time === -1 ? "-" : `${participant.seen.time.toLocaleString()}` }}</td>
                    <td>{{ participant.numberOfMessages }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>











<style scoped src="./GroupInformation.css" />

<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useMessengerStore } from '@/stores/messenger'
import type { User } from '@/client/types/business';

const messengerStore = useMessengerStore()

const clientEmits = useHighLevelClientEmits()

const { users } = toRefs(messengerStore)

async function openConversation() {
    await clientEmits.createOneToOneConversation('Alice')

    console.log('Conversation ouverte !')
}

const selectedUsers: User[] = []

function userIsSelected(user: User): boolean
{
    if(selectedUsers.includes(user))
    {
        return true
    }
    else
    {
        return false
    } 
}

function toggleUser(user: User): void
{
    if(userIsSelected(user))
    {
        selectedUsers.splice(selectedUsers.indexOf(user), 1);
    }
    else
    {
        selectedUsers.push(user);
    }
    console.log(selectedUsers)
}



</script>

<template>
    <div class="community">
        <div class="filter">
            <div class="ui fluid search">
                <div class="ui icon input">
                    <input
                        class="prompt"
                        type="text"
                        placeholder="Rechercher un utilisateur"
                    />
                    <i class="search icon"></i>
                </div>
                <div class="results"></div>
            </div>
        </div>
        <div class="users">
            <div @click="toggleUser(user)" :class="userIsSelected(user) ? 'user selected' : 'user'" v-for="user in users" :key="user.username">
                <img :src="user.picture_url" />
                <span class="">{{ user.username }}</span>
            </div>
        </div>

        <div class="actions">
            <button class="ui primary big button" @click="openConversation">
                <i class="conversation icon"></i>
                <span>Ouvrir la conversation (2)</span>
            </button>
        </div>
    </div>
</template>

<style scoped src="./Community.css" />

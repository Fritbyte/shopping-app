import {ref} from "vue";
import type {User} from "../types/auth.ts";

export const token = ref("")
export const user = ref<User | null>(null);

export function syncUser() {
    token.value = localStorage.getItem("token") || ""
    const storedUser = localStorage.getItem("user")
    user.value = storedUser ? JSON.parse(storedUser) : null
}

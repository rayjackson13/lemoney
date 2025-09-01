// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

export type UserInfo = {
  name?: string
  picture?: string
  email?: string
}

export type PageData = {
  user: UserInfo | null
}

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: UserInfo | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}

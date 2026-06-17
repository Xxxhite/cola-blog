// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    devServer: {
        port: 5198
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/icon',
        '@nuxt/fonts',
        '@nuxt/image',
        '@vueuse/nuxt',
        '@pinia/nuxt',
        '@nuxtjs/seo',
        '@nuxtjs/color-mode',
        '@nuxtjs/mdc',
        'dayjs-nuxt',
        '@nuxtjs/i18n'
    ]
})
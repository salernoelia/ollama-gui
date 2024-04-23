// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ["@vueuse/nuxt", "@nuxtjs/tailwindcss", "shadcn-nuxt"],
  ssr: false,

  shadcn: {
    prefix: "",
    /**
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
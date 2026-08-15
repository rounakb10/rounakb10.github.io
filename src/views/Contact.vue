<template>
  <div class="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col">
      <div class="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-8">
        <div class="layout-content-container flex flex-col w-full max-w-[1280px] flex-1">
          <!-- Page Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl font-black text-[#0e141b] tracking-[-0.033em]"
              :class="{ 'mb-4': showPageDescription }">
              Get in Touch
            </h1>
            <p v-if="showPageDescription" class="content-justify text-lg text-gray-600 max-w-6xl mx-auto">
              {{ pageDescription }}
            </p>
          </div>

          <!-- Contact Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- First Row: Phone, Email, Student Email -->
            <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
              <div class="text-[#0e141b] flex items-center justify-center rounded-lg bg-[#e7edf3] shrink-0 size-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
                </svg>
              </div>
              <div class="flex flex-col justify-center">
                <p class="text-[#0e141b] text-base font-medium leading-normal line-clamp-1">Phone</p>
                <p class="text-[#4e7397] text-sm font-normal leading-normal line-clamp-2">{{phone}}</p>
              </div>
            </div>

            <!-- Gmail: animated icon, hover driven from the whole tile. -->
            <div
              class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2"
              @mouseenter="gmailIcon?.startAnimation()"
              @mouseleave="gmailIcon?.stopAnimation()"
            >
              <div class="text-[#0e141b] flex items-center justify-center rounded-lg bg-[#e7edf3] shrink-0 size-12">
                <AnimatedIcon ref="gmailIcon" name="gmail" :size="24" />
              </div>
              <div class="flex flex-col justify-center">
                <p class="text-[#0e141b] text-base font-medium leading-normal line-clamp-1">Email</p>
                <p class="text-[#4e7397] text-sm font-normal leading-normal line-clamp-2"><a :href="gmail_link">{{gmail}}</a></p>
              </div>
            </div>


            <!-- Second Row: LinkedIn, GitHub, Student GitHub -->
            <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
              <div class="text-[#0e141b] flex items-center justify-center rounded-lg bg-[#e7edf3] shrink-0 size-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                </svg>
              </div>
              <div class="flex flex-col justify-center">
                <p class="text-[#0e141b] text-base font-medium leading-normal line-clamp-1">LinkedIn</p>
                <a :href="linkedIn" target="_blank" class="text-[#4e7397] text-sm font-normal leading-normal line-clamp-2 hover:text-[#1980e6] transition-colors duration-200">LinkedIn Profile</a>
              </div>
            </div>

            <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
              <div class="text-[#0e141b] flex items-center justify-center rounded-lg bg-[#e7edf3] shrink-0 size-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
                </svg>
              </div>
              <div class="flex flex-col justify-center">
                <p class="text-[#0e141b] text-base font-medium leading-normal line-clamp-1">GitHub</p>
                <a :href="github" target="_blank" class="text-[#4e7397] text-sm font-normal leading-normal line-clamp-2 hover:text-[#1980e6] transition-colors duration-200">GitHub Profile <span v-if="githubUsername" class="text-[#646cff]">({{ githubUsername }})</span></a>
              </div>
            </div>




          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue'
import config from '@/content/profile_info'
import descriptions from '@/content/profile_info/description.yml'
import { isPageDescriptionEnabled } from '@/config/featureFlags'
import AnimatedIcon from '@/components/ui/AnimatedIcon.vue'

const gmailIcon = useTemplateRef('gmailIcon')

const pageDescription = descriptions.contact
const showPageDescription = isPageDescriptionEnabled('contact')

const {contacts, socials} = config

const gmail = contacts.gmail
const gmail_link = "mailto:" + contacts.gmail
const phone = contacts.phone
const github = socials.github
const githubUsername = github ? github.split('/').filter(Boolean).pop() : null
const linkedIn = socials.linkedin
</script>

<style scoped>
/* Custom styles for the contact page */
</style>

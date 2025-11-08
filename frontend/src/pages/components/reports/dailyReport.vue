<template>
 <q-tabs
        v-model="tab"
        inline-label
        outside-arrows
        mobile-arrows
        class="bg-primary text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
        <q-tab name="photos" icon="photo" label="Photos" />
        <q-tab name="videos" icon="slow_motion_video" label="Videos" />
        <q-tab name="addressbook" icon="people" label="Address Book" />
      </q-tabs>
</template>
<script>

export default {
  data(){
    return{
      tab:mail,
    }
  }
}
</script>

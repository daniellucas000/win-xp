<script setup lang="ts">
const navigate = inject<(url: string) => void>('ieNavigate');

const searchQuery = ref('');

const featured = [
  {
    id: 'jNQXAC9IVRw',
    title: 'Me at the zoo',
    channel: 'jawed',
    views: '246,759,abdomen views',
    emoji: '🦁',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    channel: 'RickAstleyVEVO',
    views: '1,4bi views',
    emoji: '🎵',
  },
  {
    id: '_OBlgSz8sSM',
    title: 'Numa Numa',
    channel: 'nNumaNuma',
    views: '700mi views',
    emoji: '😄',
  },
  {
    id: 'KmtzQCSh6xk',
    title: 'Charlie Bit My Finger',
    channel: 'HDCYT',
    views: '885mi views',
    emoji: '👶',
  },
  {
    id: 'pv5zWaTEVkI',
    title: 'Evolution of Dance',
    channel: 'judsonlaipply',
    views: '300mi views',
    emoji: '💃',
  },
  {
    id: 'BBJa32lCaaY',
    title: 'Dramatic Chipmunk',
    channel: 'ElTruperDo',
    views: '60mi views',
    emoji: '🐿️',
  },
];

const currentVideo = ref<(typeof featured)[0] | null>(null);

function playVideo(video: (typeof featured)[0]) {
  currentVideo.value = video;
}

function search() {
  if (!searchQuery.value.trim()) return;
  // por enquanto só simula
}
</script>

<template>
  <div class="ie-page yt">
    <div class="yt__header">
      <div class="yt__logo">
        <span class="yt__logo-you">You</span>
        <span class="yt__logo-tube">Tube</span>
        <span class="yt__logo-tag">Broadcast Yourself™</span>
      </div>
      <div class="yt__search">
        <input
          v-model="searchQuery"
          class="yt__search-input"
          placeholder="Search"
          @keyup.enter="search"
        />
        <button class="yt__search-btn" @click="search">Search</button>
      </div>
      <div class="yt__nav">
        <span class="yt__nav-link yt__nav-link--active">Home</span>
        <span class="yt__nav-link">Videos</span>
        <span class="yt__nav-link">Channels</span>
        <span class="yt__nav-link">Community</span>
      </div>
    </div>

    <div class="yt__body">
      <!-- Player -->
      <template v-if="currentVideo">
        <div class="yt__player">
          <div>
            <div class="yt__video-screen">
              <span>{{ currentVideo.emoji }}</span>
              <span class="yt__video-overlay">▶ Reproduzindo...</span>
            </div>
            <div class="yt__video-info">
              <p class="yt__video-title">{{ currentVideo.title }}</p>
              <p class="yt__video-meta">
                {{ currentVideo.views }} · {{ currentVideo.channel }}
              </p>
              <div class="yt__video-actions">
                <button class="yt__action-btn">👍 Like</button>
                <button class="yt__action-btn">👎 Dislike</button>
                <button class="yt__action-btn">✉️ Share</button>
                <button
                  class="yt__action-btn yt__action-btn--back"
                  @click="currentVideo = null"
                >
                  ← Voltar
                </button>
              </div>
              <div class="yt__flash-warning">
                ⚠️ Este vídeo requer <b>Adobe Flash Player</b>.
                <a>Clique aqui para instalar.</a>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Grade de vídeos -->
      <template v-else>
        <p class="yt__section-title">Vídeos em destaque</p>
        <div class="yt__grid">
          <button
            v-for="v in featured"
            :key="v.id"
            class="yt__card"
            @click="playVideo(v)"
          >
            <div class="yt__thumb">{{ v.emoji }}</div>
            <div class="yt__card-info">
              <span class="yt__card-title">{{ v.title }}</span>
              <span class="yt__card-meta">{{ v.views }}</span>
              <span class="yt__card-channel">{{ v.channel }}</span>
            </div>
          </button>
        </div>
      </template>
    </div>

    <div class="yt__footer">
      © 2006 YouTube, LLC · Help · About · Press · Blog · Jobs · API · Terms ·
      Privacy
    </div>
  </div>
</template>

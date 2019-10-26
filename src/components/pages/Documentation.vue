<template>
  <div id="docs">
    <docs-navbar :langs="langs" :lang="lang" :sources="sources" :source="source" />
    <router-view :lang="lang" :source="source" :tag="tag" :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" @setRepository="setRepository" />
  </div>
</template>

<script>
import MainSource from '../../data/MainSource';
import CollectionSource from '../../data/CollectionSource';
import CommandoSource from '../../data/CommandoSource';
import RPCSource from '../../data/RPCSource';
import DocsNavbar from '../docs/Navbar.vue';

export default {
  name: 'documentation',
  props: ['darkMode'],
  components: {
    DocsNavbar,
  },

  data() {
    return {
      langs: {},
      lang: { id: 'en-US', path: 'en-US', name: 'English' },
      sources: {
        [MainSource.id]: MainSource,
        [CollectionSource.id]: CollectionSource,
        [CommandoSource.id]: CommandoSource,
        [RPCSource.id]: RPCSource,
      },
      source: MainSource,
      tag: MainSource.defaultTag,
    };
  },

  methods: {
    setLang(id) {
      this.lang = this.langs[id]
    },

    setSource(id) {
      this.source = this.sources[id];
    },

    setTag(tag) {
      this.tag = tag;
      this.source.recentTag = tag;
    },

    handleRoute(route) {
      // Set the lang
      if (route.query.lang && this.langs[route.query.lang] &&
          this.lang.id !== route.query.lang) {
        console.log('Set lang', route.query.lang)
        this.setLang(route.query.lang);
        return
      }

      // Set the source, or redirect to a default route
      if (route.params.source && this.sources[route.params.source]) {
        this.setSource(route.params.source);
      } else {
        this.$router.replace({ name: 'docs-file', params: {
          source: MainSource.id,
          tag: MainSource.defaultTag,
          category: MainSource.defaultFile.category,
          file: MainSource.defaultFile.id,
        } });
        return;
      }

      // Set the tag, or redirect to a default route
      if (route.params.tag) {
        this.setTag(route.params.tag);
      } else {
        this.$router.replace({ name: 'docs-file', params: {
          source: this.source.id,
          tag: this.source.recentTag || this.source.defaultTag,
          category: this.source.defaultFile.category,
          file: this.source.defaultFile.id,
        } });
        return;
      }

      // Redirect to a default route
      if (!route.params.file && !route.params.class && !route.params.typedef && route.name !== 'docs-search') {
        this.$router.replace({ name: 'docs-file', params: {
          source: this.source.id,
          tag: this.tag,
          category: this.source.defaultFile.category,
          file: this.source.defaultFile.id,
        } });
      }
    },

    toggleDarkMode() {
      this.$emit('toggleDarkMode');
    },

    setRepository(repo) {
      this.$emit('setRepository', repo);
    },

    async fetchLangs() {
      const json = res => {
        if (!res.ok) throw new Error('Failed to fetch langs data file from GitHub');
        return res.json();
      };
      const repo = 'https://raw.githubusercontent.com/discordjs-japan/i18n';
      const stats = await fetch(`${repo}/master/stats.json`).then(json);
      const availableLangMap = [this.lang, ...stats]
        .filter(lang => lang.path)
        .map(({ code, ...props }) => ({ id: code, ...props }))
        .reduce((map, lang) => ({ ...map, [lang.id]: lang }), {})
      this.langs = availableLangMap;
    },
  },

  watch: {
    $route(to) {
      this.handleRoute(to);
    },
  },

  created() {
    this.handleRoute(this.$route);
    this.fetchLangs();
  },
};
</script>

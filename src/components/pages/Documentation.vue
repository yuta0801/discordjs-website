<template>
  <div id="docs">
    <docs-navbar :locales="locales" :locale="locale" :sources="sources" :source="source" />
    <router-view :locale="locale" :source="source" :tag="tag" :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" @setRepository="setRepository" />
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
      locales: [{ id: 'en-US', name: 'English' }],
      locale: 'en-US',
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
    setLocale(locale) {
      this.locale = locale
    },

    setSource(id) {
      this.source = this.sources[id];
    },

    setTag(tag) {
      this.tag = tag;
      this.source.recentTag = tag;
    },

    handleRoute(route) {
      // Set the locale
      if (route.params.locale) {
        console.log(222, route.params.locale)
        this.setLocale(route.params.locale);
      } else {
        this.setLocale(this.locale);
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

    async fetchLocales() {
      const json = res => {
        if (!res.ok) throw new Error('Failed to fetch locales data file from GitHub');
        return res.json();
      };
      const repo = 'https://raw.githubusercontent.com/discordjs-japan/i18n';
      const stats = await fetch(`${repo}/master/stats.json`).then(json);
      const locales = stats.map(({ path, name }) => ({ id: path, name }))
      const availableLocales = locales//.filter(locale => locale.path)
      this.locales.push(...availableLocales);
    },
  },

  watch: {
    $route(to) {
      this.handleRoute(to);
    },
  },

  created() {
    this.handleRoute(this.$route);
    this.fetchLocales();
  },
};
</script>

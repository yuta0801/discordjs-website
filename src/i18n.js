import Vue from 'vue';
import VueI18n from 'vue-i18n';
// import browserLang from 'browser-lang';

Vue.use(VueI18n);

// const json = res => {
//   if (!res.ok) throw new Error('Failed to fetch langs data file from GitHub');
//   return res.json();
// };

// const endpoint = 'https://raw.githubusercontent.com/discordjs-japan/i18n';

//  () => {
//   const stats = await fetch(`${repo}/master/stats.json`).then(json);
//   const languages = stats.map(lang => lang.path);

//   const lang = browserLang({ languages, fallback: 'en-US' });

//   const messages = await fetch(`${repo}/master/${lang}`).then(json);

//   return
// };
// export const loadLang = async(lang, repo, tag) => {
//   const url = `/master/content/${lang}/docs/${repo}/${tag}.json`;
//   const language = await fetch(endpoint + url).then(json);
//   return language;
// };

// const defaultLang = 'en-US';

// const defaultMessages = loadLang(defaultLang, 'discord.js', 'stable');

export default new VueI18n();

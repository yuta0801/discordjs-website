import VueI18n from 'vue-i18n';
import browserLang from 'browser-lang';

const json = res => {
  if (!res.ok) throw new Error('Failed to fetch locales data file from GitHub');
  return res.json();
};

const repo = 'https://raw.githubusercontent.com/discordjs-japan/i18n';

export default async() => {
  const stats = await fetch(`${repo}/master/stats.json`).then(json);
  const languages = stats.map(locale => locale.path);

  const locale = browserLang({ languages, fallback: 'en-US' });

  const messages = await fetch(`${repo}/master/${locale}`).then(json);

  return new VueI18n({ locale, messages });
};

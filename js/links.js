/* ---------------------------------------------------------------------------
   ALL CONTENT LIVES HERE. Edit this file only — never the layout code.

   Item shapes:
     { type:'link', label, sub, url, icon }   clickable, opens in a new tab
     { type:'info', label, sub, icon }        plain text row, not clickable
     { type:'form', label, sub, icon }        opens the message panel

   `icon` accepts:
     'si:spotify'   -> brand mark from assets/icons/spotify.svg (see README to add one)
     'glyph:mail'   -> built-in glyph drawn in xmb.js (see GLYPHS there)
     'assets/x.svg' -> any local file you drop in assets/
--------------------------------------------------------------------------- */

const PROFILE = {
  name: 'Aryan Chaudhary',
  handle: 'azazel1z',
  avatar: 'assets/avatar.jpeg',
};

// Paste the access key Web3Forms emails you (https://web3forms.com — free, no account).
// Until this is set, the form politely tells the visitor to email instead.
const FORM_ACCESS_KEY = 'f368e448-ebeb-489d-8917-bb6c298ca41a';

const CATEGORIES = [
  {
    id: 'about',
    label: 'About',
    icon: PROFILE.avatar,
    items: [
      { type: 'info', label: 'Aryan Chaudhary', sub: 'azazel1z',   icon: 'glyph:user' },
      { type: 'info', label: 'Jaipur, India', sub: 'IST — UTC+5:30',    icon: 'glyph:pin' },
      { type: 'info', label: 'Football, video games', sub: 'and mangas', icon: 'glyph:gamepad' },
    ],
  },
  {
    id: 'professional',
    label: 'Professional',
    icon: 'glyph:briefcase',
    items: [
      { type: 'link', label: 'LinkedIn',     sub: '/in/azazel1z', url: 'https://www.linkedin.com/in/azazel1z/', icon: 'glyph:linkedin' },
      { type: 'link', label: 'GitHub',       sub: '/azazel1z',    url: 'https://github.com/azazel1z',           icon: 'si:github' },
      { type: 'link', label: 'LeetCode',     sub: '/u/azazel1z',  url: 'https://leetcode.com/u/azazel1z/',      icon: 'si:leetcode' },
      { type: 'link', label: 'Kaggle',       sub: '/azazel1z',    url: 'https://www.kaggle.com/azazel1z',       icon: 'si:kaggle' },
      { type: 'link', label: 'Hugging Face', sub: '/Azazel1z',    url: 'https://huggingface.co/Azazel1z',       icon: 'si:huggingface' },
      { type: 'link', label: 'Medium',       sub: '/@azazel1z',   url: 'https://medium.com/@azazel1z',          icon: 'si:medium' },
    ],
  },
  {
    id: 'socials',
    label: 'Socials',
    icon: 'glyph:people',
    items: [
      { type: 'link', label: 'Instagram', sub: '/azazel1z',  url: 'https://www.instagram.com/azazel1z/',              icon: 'si:instagram' },
      { type: 'link', label: 'X',         sub: '@Azazel1z',  url: 'https://x.com/Azazel1z',                           icon: 'si:x' },
      { type: 'link', label: 'Reddit',    sub: 'u/Azazel1z', url: 'https://www.reddit.com/user/Azazel1z/',            icon: 'si:reddit' },
      { type: 'link', label: 'Discord',   sub: 'azazel1z',   url: 'https://discord.com/users/524272076438372352',     icon: 'si:discord' },
    ],
  },
  {
    id: 'lists',
    label: 'Lists',
    icon: 'glyph:list',
    items: [
      { type: 'link', label: 'Anime List', sub: '/animelist/azazel1z', url: 'https://myanimelist.net/animelist/azazel1z', icon: 'si:myanimelist' },
      { type: 'link', label: 'Manga List', sub: '/mangalist/azazel1z', url: 'https://myanimelist.net/mangalist/azazel1z', icon: 'si:myanimelist' },
      { type: 'link', label: 'Letterboxd', sub: '/azazel1z',           url: 'https://letterboxd.com/azazel1z/',           icon: 'si:letterboxd' },
      { type: 'link', label: 'Pinterest',  sub: '/azazel1z',           url: 'https://in.pinterest.com/azazel1z/',         icon: 'si:pinterest' },
      { type: 'link', label: 'Spotify',    sub: '/azazel1z',           url: 'https://open.spotify.com/user/tzjq03bh99kc6cgfi7ivb2m9m', icon: 'si:spotify' },
      { type: 'link', label: 'Steam',      sub: '/azazel1z',           url: 'https://steamcommunity.com/id/azazel1z/',    icon: 'si:steam' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: 'glyph:mail',
    items: [
      { type: 'form', label: 'Send me a message', sub: 'goes straight to my inbox', icon: 'glyph:mail' },
      { type: 'link', label: 'Discord', sub: 'azazel1z', url: 'https://discord.com/users/524272076438372352', icon: 'si:discord' },
    ],
  },
];

// Which column the page opens on.
const DEFAULT_CATEGORY = 'socials';

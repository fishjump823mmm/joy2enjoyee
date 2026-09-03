const projectDialog = document.querySelector('#project-dialog');
const dialogBody = document.querySelector('#dialog-body');
const dialogIndex = document.querySelector('#dialog-index');
const toast = document.querySelector('.toast');

const directoryStage = document.querySelector('.directory-stage');
const directoryItems = [...document.querySelectorAll('[data-directory-item]')];
const directoryDots = [...document.querySelectorAll('[data-directory-dot]')];
const wideDirectoryQuery = window.matchMedia('(min-width: 761px)');
let activeDirectory = 0;

function setActiveDirectory(index, shouldScroll = false) {
  const count = directoryItems.length;
  activeDirectory = (index + count) % count;
  const previous = (activeDirectory - 1 + count) % count;
  const next = (activeDirectory + 1) % count;

  directoryItems.forEach((item, itemIndex) => {
    const isWide = wideDirectoryQuery.matches;
    item.classList.toggle('is-left', isWide && itemIndex === previous);
    item.classList.toggle('is-center', isWide && itemIndex === activeDirectory);
    item.classList.toggle('is-right', isWide && itemIndex === next);
    item.classList.toggle('is-selected', itemIndex === activeDirectory);
    item.setAttribute('aria-hidden', 'false');
    item.tabIndex = 0;
  });
  directoryDots.forEach((dot, dotIndex) => {
    const selected = dotIndex === activeDirectory;
    dot.classList.toggle('is-active', selected);
    if (selected) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });

  if (shouldScroll && !wideDirectoryQuery.matches) {
    directoryItems[activeDirectory].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

directoryDots.forEach((dot, index) => dot.addEventListener('click', () => setActiveDirectory(index, true)));
directoryStage.addEventListener('pointermove', (event) => {
  if (!wideDirectoryQuery.matches) return;
  const rect = directoryStage.getBoundingClientRect();
  const relativeX = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left));
  const nearestIndex = Math.floor(relativeX / rect.width * directoryItems.length);
  if (nearestIndex !== activeDirectory) setActiveDirectory(nearestIndex);
});
directoryStage.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  setActiveDirectory(activeDirectory + (event.key === 'ArrowRight' ? 1 : -1), true);
});
let directoryScrollFrame = 0;
directoryStage.addEventListener('scroll', () => {
  if (wideDirectoryQuery.matches || directoryScrollFrame) return;
  directoryScrollFrame = requestAnimationFrame(() => {
    directoryScrollFrame = 0;
    const stageCenter = directoryStage.getBoundingClientRect().left + directoryStage.clientWidth / 2;
    const nearestIndex = directoryItems.reduce((nearest, item, index) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - stageCenter);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Infinity }).index;
    if (nearestIndex !== activeDirectory) setActiveDirectory(nearestIndex);
  });
}, { passive: true });
wideDirectoryQuery.addEventListener('change', () => setActiveDirectory(activeDirectory));
setActiveDirectory(0);

const image = (src, alt = '') => `<img class="dialog-cover" src="${src}" alt="${alt}">`;
const video = (src, poster, label) => `<video class="dialog-video" controls playsinline preload="metadata" poster="${poster}" aria-label="${label}"><source src="${src}" type="video/mp4">当前浏览器无法播放该视频。</video>`;
const gallery = (items, extra = '') => `<div class="dialog-gallery ${extra}">${items.map(([src, alt]) => `<img src="${src}" alt="${alt}" loading="lazy">`).join('')}</div>`;
const title = (eyebrow, heading, tag) => `<div class="dialog-title-row"><div><p>${eyebrow}</p><h2 id="dialog-title">${heading}</h2></div><span class="dialog-tag">${tag}</span></div>`;
const summary = (label, copy) => `<div class="dialog-summary"><h3>${label}</h3><div>${copy}</div></div>`;
const reserved = (copy) => `<div class="reserved-slot"><div><strong>VIDEO SLOT</strong><span>${copy}</span></div></div>`;

const projectContent = {
  taro: {
    index: 'AIGC_01 / TARO_ACCOUNT',
    html: `${title('ACCOUNT OPERATION / AIGC PRODUCTION', '“桃乐 Taro”数字人账号', 'PERSONAL')}<img class="dialog-cover" src="assets/images/aigc/taro-guitar.jpg" alt="桃乐数字人弹吉他画面"><div class="dialog-stats"><div><strong>153 → 15,515</strong><span>FOLLOWERS</span></div><div><strong>1085.3W</strong><span>TOP VIDEO VIEWS</span></div><div><strong>1365W+</strong><span>30-DAY MATRIX VIEWS</span></div></div>${summary('ROLE', '<p>2026.02.25 左右接手，04.30 起量。除既有建模外，独立完成底图生成、Suno 翻唱、对口型、发布与账号运营。</p><p>通过 4–5 轮底图迭代、榜单热点判断、共鸣文案与评论区点歌机制推动账号增长。</p>')}${gallery([['assets/images/aigc/taro-data-1.jpg','桃乐账号数据截图一'],['assets/images/aigc/taro-data-2.jpg','桃乐账号数据截图二'],['assets/images/aigc/taro-data-3.jpg','桃乐账号数据截图三']], 'three')}<a class="dialog-link" href="https://canva.link/29fyhj4htagf1oo" target="_blank" rel="noreferrer">VIEW EXTENDED WORKS ↗</a>`
  },
  'twin-realms': {
    index: 'AIGC_02 / TWIN_REALMS',
    html: `${title('AIGC DIGITAL HUMAN MV', '《双生无界》', 'TEAM')} ${video('assets/video/twin-realms.mp4', 'assets/images/aigc/twin-realms.jpg', '双生无界 AIGC 数字人 MV')} ${summary('ROLE', '<p>负责约 01:00–02:30 的视觉段落：人物三视图、换装、场景生成与画面动态化。</p><p>音频由团队原创制作，本人仅参与少量协作。</p>')} ${gallery([['assets/images/aigc/twin-audio.png','双生无界音频制作流程']], '')}`
  },
  plubble: {
    index: 'AIGC_03 / PLUBBLE',
    html: `${title('AIGC JEWELRY FILM', '《PLUBBLE》珠宝广告', 'TEAM / ORIGINAL CONCEPT')} ${video('assets/video/plubble.mp4', 'assets/images/aigc/plubble.jpg', 'PLUBBLE 珠宝广告')} ${summary('CONCEPT', '<p>原创“鸭嘴兽 PLU 环球收集灵性宝石”的核心概念，将不同地域的自然能量与文化转化为珠宝盲盒。</p>')} ${gallery([['assets/images/aigc/plubble-concept.png','PLUBBLE 原创概念页面']], '')}`
  },
  delulu: {
    index: 'AIGC_04 / DELULU',
    html: `${title('AIGC MV', '《DELULU》MV', 'TEAM')} ${reserved('待替换为本人负责的裁剪片段')} ${summary('ROLE', '<p>团队作品。第一版保留个人负责片段入口，收到裁剪文件后直接替换。</p>')}`
  },
  afterlike: {
    index: 'AIGC_05 / AFTERLIKE',
    html: `${title('ANIMAL ALL-STARS MV', '《AFTERLIKE》动物群星版', 'PERSONAL')} ${video('assets/video/afterlike.mp4', 'assets/images/aigc/afterlike.jpg', 'AFTERLIKE 动物群星版 MV')} ${summary('WORKFLOW', '<p>独立完成全部画面：Nano Banana 先生成场景、再加入动物；即梦完成对口型与图生视频；最后合成剪辑。音乐使用原曲升调版本。</p>')} ${gallery([['assets/images/aigc/afterlike-1.jpg','AFTERLIKE 画面一'],['assets/images/aigc/afterlike-2.jpg','AFTERLIKE 画面二'],['assets/images/aigc/afterlike-3.jpg','AFTERLIKE 画面三'],['assets/images/aigc/afterlike-4.jpg','AFTERLIKE 画面四'],['assets/images/aigc/afterlike-5.jpg','AFTERLIKE 画面五']], 'three')}`
  },
  'love-aigc': {
    index: 'AIGC_06 / LOVE_GUIDE_SEQUENCE',
    html: `${title('AIGC SEQUENCE', '《恋爱撤回指南》AIGC片段', 'RESERVED')} ${reserved('待补充 AIGC 裁剪片段')} ${gallery([['assets/images/video/love-guide-2.jpg','恋爱撤回指南剧照一'],['assets/images/video/love-guide-3.jpg','恋爱撤回指南剧照二']], '')}`
  },
  'love-guide': {
    index: 'VIDEO_01 / LOVE_WITHDRAWAL_GUIDE',
    html: `${title('ROMANTIC COMEDY', '《恋爱撤回指南》', '23:07 / VIDEO WORK')} ${video('assets/video/love-guide.mp4', 'assets/images/video/love-guide-cover.jpg', '恋爱撤回指南完整成片')} ${gallery([['assets/images/video/love-guide-2.jpg','恋爱撤回指南剧照二'],['assets/images/video/love-guide-3.jpg','恋爱撤回指南剧照三'],['assets/images/video/love-guide-4.jpg','恋爱撤回指南剧照四'],['assets/images/video/love-guide-5.jpg','恋爱撤回指南剧照五'],['assets/images/video/love-guide-6.jpg','恋爱撤回指南剧照六'],['assets/images/video/love-guide-7.jpg','恋爱撤回指南剧照七']], 'three')} ${summary('VIDEO', '<p>完整成片，可直接在线播放；AIGC 片段在 AIGC 分类中保留独立入口。</p>')}`
  },
  'seeking-sound': { index: 'VIDEO_02 / SEEKING_THE_SOUND', html: `${title('ORIGINAL SHORT FILM', '《寻声》', '16:25 / 2025')} ${image('assets/images/video/seeking-sound.jpg', '寻声海报')} ${summary('ROLE', '<p>编剧 / 制片 / 演员</p>')}` },
  'outside-theater': { index: 'VIDEO_03 / OUTSIDE_THE_THEATER', html: `${title('ORIGINAL SHORT FILM', '《剧场外》', 'TEAM')} ${image('assets/images/video/outside-theater.jpg', '剧场外画面')} ${summary('ROLE', '<p>美术：置景 / 妆造 / 道具</p>')}` },
  finding: { index: 'VIDEO_04 / FINDING', html: `${title('ORIGINAL SHORT FILM', '《寻》', '14:24 / 2023')} ${image('assets/images/video/finding.jpg', '寻画面')} ${summary('ROLE', '<p>美术：置景 / 妆造 / 道具</p>')}` },
  'hello-haining': { index: 'VIDEO_05 / HELLO_HAINING', html: `${title('PROMOTIONAL VIDEO', '《你好，海宁》', 'TEAM')} ${image('assets/images/video/hello-haining.jpg', '你好海宁画面')} ${summary('AWARD', '<p>海宁市文旅国际短视频大赛二等奖</p>')}` },
  'little-red-flower': { index: 'VIDEO_06 / LITTLE_RED_FLOWER', html: `${title('IMITATION', '《送你一朵小红花》', '2023')} ${image('assets/images/video/little-red-flower.jpg', '送你一朵小红花仿拍画面')} ${summary('ROLE', '<p>美术：置景 / 妆造 / 道具</p>')}` },
  'sweet-peach': { index: 'VIDEO_07 / SWEET_NOT_PEACH', html: `${title('ADVERTISEMENT', '《甜蜜，不“桃”走》', '00:54 / 2022')} ${image('assets/images/video/sweet-peach.jpg', '甜蜜不桃走画面')} ${summary('ROLE', '<p>策划 / 剪辑 / 特效制作</p>')}` },
  coffee: { index: 'VIDEO_08 / COFFEE', html: `${title('ADVERTISEMENT', '《拒绝乏味 就喝咖位》', '00:53 / TEAM')} ${image('assets/images/video/coffee.jpg', '拒绝乏味就喝咖位画面')} ${summary('ROLE', '<p>团队作品 / 无明确分工</p>')}` },
  'qingwen-kiss': { index: 'VIDEO_09 / QINGWEN_KISS', html: `${title('ADVERTISEMENT', '《一颗清瘟 一个亲吻》', '00:32 / PERSONAL')} ${image('assets/images/video/qingwen-kiss.jpg', '一颗清瘟一个亲吻画面')} ${summary('ROLE', '<p>独立完成。中国大学生广告艺术节学院奖 2023 春季征集大赛优秀奖。</p>')}` },
  'dreams-come-true': { index: 'VIDEO_10 / DREAMS_COME_TRUE', html: `${title('INTERACTIVE VIDEO', '《美梦成真》', 'TEAM / 2021')} ${image('assets/images/video/dreams-come-true.jpg', '美梦成真互动视频')} ${summary('ROLE', '<p>团队作品 / 无明确分工</p>')}` },
  'practice-room': {
    index: 'PROJECT_01 / PRACTICE_ROOM_4',
    html: `${title('TV PROGRAM', '《天赐的声音7》衍生节目《奇妙练歌房4》', 'EDITOR')} ${image('assets/images/projects/practice-room-1.jpg', '奇妙练歌房4现场')} ${summary('RESPONSIBILITY', '<p>第 2 期、第 9 期及卫视大屏精编版第 2 期责任编辑。</p><p>负责前期策划、艺人对接、台本与道具单、技术彩排、现场 K 歌及打分系统运行，并参与上线前审片与跨组需求对齐。</p>')} ${gallery([['assets/images/projects/practice-room-2.jpg','奇妙练歌房4现场二'],['assets/images/projects/practice-room-3.jpg','奇妙练歌房4现场三'],['assets/images/projects/practice-room-4.jpg','奇妙练歌房4现场四']], 'three')}<a class="dialog-link" href="https://zmtv.cztv.com/cmsh5-share/prod/cztv-tvPlay/index.html?pageId=20113744" target="_blank" rel="noreferrer">VIEW PROMO ↗</a>`
  },
  'ai-spring-festival': {
    index: 'PROJECT_02 / AI_SPRING_FESTIVAL',
    html: `${title('NETEASE AI SPRING FESTIVAL', '《音舞次元串烧》', 'FULL PIPELINE')} ${video('assets/video/ai-spring-festival.mp4', 'assets/images/projects/ai-spring-festival.jpg', '音舞次元串烧')} ${summary('ROLE', '<p>独立负责单节目全流程制作：围绕多首歌曲制作桃乐唱跳画面并完成串联剪辑。</p>')}<a class="dialog-link" href="https://y.music.163.com/g/yida/act/chunwan/K_ipyv1gy4j9?app_version=9.4.65&fromRN=1&market=search&userid=260640198&dlt=0846&page=dca30144380144169b722bd503c24e13" target="_blank" rel="noreferrer">VIEW OFFICIAL PAGE ↗</a>`
  },
  'cloud-tv': {
    index: 'PROJECT_03 / YUN_CUN_TV',
    html: `${title('APRIL FOOLS SPECIAL', '“云村TV——愚人节特别节目”', 'PRODUCTION SUPPORT')} ${reserved('OFFICIAL PAGE AVAILABLE')} ${summary('ROLE', '<p>协助项目负责人推进制作，主要负责与外部供应商沟通对接。</p>')}<a class="dialog-link" href="https://y.music.163.com/g/yida/act/0401YCTV/U_h4pkm98m6n?app_version=9.4.80&dlt=0846&userid=352385996&encryptUid=f757ccc1d858ca73b92395e2a866d336ddb68a60f40462d863a6ee896fc01b69&page=d56ce536a12e46eebcf06bf8ec0b3577" target="_blank" rel="noreferrer">VIEW OFFICIAL PAGE ↗</a>`
  },
  textbook: {
    index: 'PROJECT_04 / AI_VARIETY_TEXTBOOK',
    html: `${title('INDUSTRY × ACADEMIA', '大千影业 × 浙江大学 AI综艺教材合作', 'PROJECT LEAD')}<div class="reserved-slot"><div><strong>AI × VARIETY</strong><span>DAQIAN PICTURES / ZHEJIANG UNIVERSITY</span></div></div>${summary('ROLE', '<p>牵头校企跨界合作，组织浙大团队赴北京、成都两地开展行业调研与前后期团队访谈，统筹前期沟通及 2026.02–2026.08 教材编撰推进。</p><p>目前编撰进入收尾阶段，预计 2027 年初出版。</p>')}`
  }
};

function openDialog(project) {
  const content = projectContent[project];
  if (!content) return;
  dialogIndex.textContent = content.index;
  dialogBody.innerHTML = content.html;
  projectDialog.showModal();
  document.body.classList.add('dialog-open');
}

function closeDialog() {
  projectDialog.querySelectorAll('video').forEach((item) => item.pause());
  projectDialog.close();
  dialogBody.innerHTML = '';
  document.body.classList.remove('dialog-open');
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openDialog(button.dataset.project));
});

function createMagneticCarousel(panel) {
  const items = [...panel.querySelectorAll('[data-lightbox]')];
  items.forEach((item) => { item.querySelector('img').loading = 'eager'; });
  const compactQuery = window.matchMedia('(max-width: 760px)');
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  let openIndex = -1;
  let animationFrame = 0;
  let current = [];
  let target = [];

  const dimensions = () => {
    const compact = compactQuery.matches;
    return {
      width: compact ? 72 : 88,
      height: compact ? 300 : 340,
      hoverWidth: compact ? 72 : 188,
      hoverHeight: compact ? 300 : 410,
      gap: compact ? 8 : 12,
      influence: 220
    };
  };

  const render = () => {
    items.forEach((item, index) => {
      item.style.width = `${current[index].width}px`;
      item.style.height = `${current[index].height}px`;
    });
  };

  const startAnimation = () => {
    if (animationFrame) return;
    const step = () => {
      let moving = false;
      current.forEach((size, index) => {
        const destination = target[index];
        const widthDelta = destination.width - size.width;
        const heightDelta = destination.height - size.height;
        if (Math.abs(widthDelta) > .15 || Math.abs(heightDelta) > .15) {
          size.width += widthDelta * .18;
          size.height += heightDelta * .18;
          moving = true;
        } else {
          size.width = destination.width;
          size.height = destination.height;
        }
      });
      render();
      animationFrame = moving ? requestAnimationFrame(step) : 0;
    };
    animationFrame = requestAnimationFrame(step);
  };

  const setCollapsedTarget = () => {
    const { width, height } = dimensions();
    target = items.map(() => ({ width, height }));
    startAnimation();
  };

  const close = () => {
    openIndex = -1;
    panel.classList.remove('has-open');
    items.forEach((item) => {
      item.classList.remove('is-open');
      item.setAttribute('aria-expanded', 'false');
    });
    setCollapsedTarget();
  };

  const open = (index) => {
    if (openIndex === index) {
      close();
      return;
    }
    openIndex = index;
    const { width, height, gap } = dimensions();
    const availableWidth = panel.clientWidth - gap * (items.length - 1);
    const sideWidth = compactQuery.matches ? 44 : 32;
    const maxOpenSize = compactQuery.matches
      ? Math.min(320, panel.clientWidth - 32)
      : Math.max(260, Math.min(500, availableWidth - sideWidth * (items.length - 1)));
    const selectedImage = items[index].querySelector('img');
    const aspectRatio = selectedImage.naturalWidth && selectedImage.naturalHeight
      ? selectedImage.naturalWidth / selectedImage.naturalHeight
      : 1;
    const openWidth = aspectRatio >= 1 ? maxOpenSize : maxOpenSize * aspectRatio;
    const openHeight = aspectRatio >= 1 ? maxOpenSize / aspectRatio : maxOpenSize;
    panel.classList.add('has-open');
    items.forEach((item, itemIndex) => {
      const selected = itemIndex === index;
      item.classList.toggle('is-open', selected);
      item.setAttribute('aria-expanded', String(selected));
    });
    target = items.map((_, itemIndex) => itemIndex === index
      ? { width: openWidth, height: openHeight }
      : { width: sideWidth, height });
    startAnimation();
    if (compactQuery.matches) items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const followPointer = (event) => {
    if (!hoverQuery.matches || openIndex !== -1) return;
    const rect = panel.getBoundingClientRect();
    const { width, height, hoverWidth, hoverHeight, gap, influence } = dimensions();
    const start = (rect.width - (items.length * width + (items.length - 1) * gap)) / 2;
    target = items.map((_, index) => {
      const center = start + index * (width + gap) + width / 2;
      const distance = Math.abs(event.clientX - rect.left - center);
      const proximity = Math.max(0, 1 - distance / influence);
      const factor = proximity * proximity * (3 - 2 * proximity);
      return {
        width: width + (hoverWidth - width) * factor,
        height: height + (hoverHeight - height) * factor
      };
    });
    startAnimation();
  };

  const initial = dimensions();
  current = items.map(() => ({ width: initial.width, height: initial.height }));
  target = items.map(() => ({ width: initial.width, height: initial.height }));
  render();

  panel.addEventListener('pointermove', followPointer);
  panel.addEventListener('pointerleave', () => { if (openIndex === -1) setCollapsedTarget(); });
  panel.addEventListener('click', (event) => { if (event.target === panel && openIndex !== -1) close(); });
  items.forEach((item, index) => {
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', (event) => {
      event.stopPropagation();
      open(index);
    });
  });
  window.addEventListener('resize', close);

  return { close };
}

const magneticCarousels = new Map(
  [...document.querySelectorAll('[data-photo-panel]')].map((panel) => [panel.dataset.photoPanel, createMagneticCarousel(panel)])
);

document.querySelector('[data-dialog-close]').addEventListener('click', closeDialog);
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) closeDialog();
});
projectDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});

document.querySelectorAll('[data-photo-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.photoTab;
    magneticCarousels.forEach((carousel) => carousel.close());
    document.querySelectorAll('[data-photo-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    document.querySelectorAll('[data-photo-panel]').forEach((panel) => { panel.hidden = panel.dataset.photoPanel !== selected; });
  });
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      toast.textContent = 'WECHAT COPIED';
    } catch {
      toast.textContent = button.dataset.copy;
    }
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 1800);
  });
});

const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach((section) => observer.observe(section));

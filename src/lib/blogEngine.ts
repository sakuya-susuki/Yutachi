// src/lib/blogEngine.ts
/**
 * Yutachi 博客文章列表交互引擎
 * 提供分类联动、全文检索、标签筛选、动态排序与 URL 深度链接支持。
 */

export interface CatEntry {
  label: string;
  title: string;
  desc: string;
}

export interface PostItemCache {
  el: HTMLElement;
  title: string;
  desc: string;
  tags: string[];
  cat: string;
  date: number;
  updated: number;
}

export interface BlogEngineState {
  search: string;
  tag: string;
  cat: string;
}

/**
 * 从 DOM 数据岛解析分类配置
 */
function parseCategoryConfig(): { config: CatEntry[]; getEntry: (label: string) => CatEntry } {
  const fallback: CatEntry = { label: 'all', title: '文章', desc: '这里汇集了所有的记录与思考。' };
  let config: CatEntry[] = [];

  try {
    const raw = document.getElementById('cat-config')?.textContent || '[]';
    config = JSON.parse(raw);
  } catch {
    config = [fallback];
  }

  const getEntry = (label: string): CatEntry => {
    return config.find(c => c.label === label) ?? config[0] ?? fallback;
  };

  return { config, getEntry };
}

/**
 * 预处理 DOM 文章项数据，避免在高频搜索和过滤中频繁访问 DOM
 */
function buildItemCache(items: NodeListOf<HTMLElement>): PostItemCache[] {
  return Array.from(items).map(item => {
    let tags: string[] = [];
    try {
      tags = JSON.parse(item.getAttribute('data-tags') || '[]').map((t: string) => t.toLowerCase());
    } catch {
      tags = [];
    }

    return {
      el: item,
      title: item.querySelector('h3, h2')?.textContent?.toLowerCase() || '',
      desc: item.querySelector('.post-desc')?.textContent?.toLowerCase() || '',
      tags,
      cat: item.getAttribute('data-category') || '',
      date: Number(item.getAttribute('data-date') || 0),
      updated: Number(item.getAttribute('data-updated') || item.getAttribute('data-date') || 0)
    };
  });
}

/**
 * 核心渲染函数：根据当前 state 筛选文章并更新 UI
 */
function renderFilteredView(
  state: BlogEngineState,
  cache: PostItemCache[],
  elements: {
    countDisplay: HTMLElement | null;
    titleEl: HTMLElement | null;
    descEl: HTMLElement | null;
    getEntry: (label: string) => CatEntry;
  }
) {
  let visibleCount = 0;

  cache.forEach(data => {
    const matchesSearch = !state.search || data.title.includes(state.search) || data.desc.includes(state.search);
    const matchesTag = !state.tag || data.tags.includes(state.tag);
    const matchesCat = state.cat === 'all' || data.cat === state.cat;

    if (matchesSearch && matchesTag && matchesCat) {
      data.el.classList.remove('filtered-out');
      visibleCount++;
    } else {
      data.el.classList.add('filtered-out');
    }
  });

  // 更新总篇数计数
  if (elements.countDisplay) {
    elements.countDisplay.textContent = `共 ${visibleCount} 篇`;
  }

  // 平滑过渡大标题与描述
  if (elements.titleEl && elements.descEl) {
    const entry = elements.getEntry(state.cat);
    elements.titleEl.classList.add('fade-out');
    elements.descEl.classList.add('fade-out');

    setTimeout(() => {
      if (elements.titleEl) elements.titleEl.textContent = entry.title;
      if (elements.descEl) elements.descEl.textContent = entry.desc;
      elements.titleEl?.classList.remove('fade-out');
      elements.descEl?.classList.remove('fade-out');
    }, 180);
  }
}

/**
 * 初始化并启动博客过滤引擎
 */
export const initBlogEngine = () => {
  const descEl = document.getElementById('category-desc-text');
  const titleEl = document.getElementById('page-main-title');
  const countDisplay = document.getElementById('post-count-display');
  const listContainer = document.getElementById('posts-list-container');
  const postItems = document.querySelectorAll('.post-item') as NodeListOf<HTMLElement>;

  // 如果页面上没有文章列表容器，直接跳过
  if (postItems.length === 0) return;

  const catBtns = document.querySelectorAll('.cat-btn');
  const tagBadges = document.querySelectorAll('.tag-badge');
  const tagPills = document.querySelectorAll('.tag-pill');
  const clearFilterBtn = document.getElementById('clear-tag-filter');
  const sortBtns = document.querySelectorAll('.sort-btn');
  // 同时兼容桌面端侧边栏和移动端工具栏的搜索输入框
  const searchInputs = document.querySelectorAll<HTMLInputElement>('.search-input, #search-input');

  const { getEntry } = parseCategoryConfig();
  const itemCache = buildItemCache(postItems);

  // 状态机
  const state: BlogEngineState = {
    search: '',
    tag: '',
    cat: 'all'
  };

  const render = () => {
    renderFilteredView(state, itemCache, { countDisplay, titleEl, descEl, getEntry });
  };

  // ── 1. 分类筛选 ──────────────────────────────────────
  const setCategory = (targetCat: string) => {
    state.cat = targetCat;
    catBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-cat') || 'all';
      if (btnCat === targetCat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    render();
  };

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat') || 'all';
      setCategory(cat);
    });
  });

  // ── 2. 搜索框（支持多输入框联动与中文拼音组合输入） ────
  let isComposing = false;
  searchInputs.forEach(input => {
    input.addEventListener('compositionstart', () => {
      isComposing = true;
    });

    input.addEventListener('compositionend', () => {
      isComposing = false;
      const val = input.value.toLowerCase().trim();
      state.search = val;
      // 同步其他搜索输入框的值
      searchInputs.forEach(other => {
        if (other !== input) other.value = input.value;
      });
      render();
    });

    input.addEventListener('input', () => {
      if (isComposing) return;
      const val = input.value.toLowerCase().trim();
      state.search = val;
      // 同步其他搜索输入框的值
      searchInputs.forEach(other => {
        if (other !== input) other.value = input.value;
      });
      render();
    });
  });

  // ── 3. 标签筛选 ──────────────────────────────────────
  const setTag = (targetTag: string) => {
    state.tag = targetTag;
    tagBadges.forEach(badge => {
      if (badge.getAttribute('data-tag')?.toLowerCase() === targetTag) {
        badge.classList.add('active');
      } else {
        badge.classList.remove('active');
      }
    });
    render();
  };

  tagBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const tag = badge.getAttribute('data-tag')?.toLowerCase() || '';
      setTag(state.tag === tag ? '' : tag);
    });
  });

  tagPills.forEach(pill => {
    pill.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const tag = pill.getAttribute('data-tag')?.toLowerCase() || '';
      setTag(state.tag === tag ? '' : tag);
    });
  });

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', e => {
      e.preventDefault();
      setTag('');
    });
  }

  // ── 4. 排序控制 ──────────────────────────────────────
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!listContainer) return;

      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sortType = btn.getAttribute('data-sort');

      listContainer.classList.add('sorting-transition');
      setTimeout(() => {
        const regularItems = itemCache.filter(d => !d.el.classList.contains('pinned-item'));

        regularItems.sort((a, b) => {
          if (sortType === 'oldest') return a.date - b.date;
          if (sortType === 'updated') return b.updated - a.updated;
          return b.date - a.date; // 默认最新
        });

        regularItems.forEach(item => {
          listContainer.appendChild(item.el);
        });

        listContainer.classList.remove('sorting-transition');
      }, 150);
    });
  });

  // ── 5. URL 参数智能直达 ──────────────────────────────
  // 支持外部链接例如 /posts?cat=记 或 /posts?tag=xxx 自动激活筛选
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat');
  const initialTag = urlParams.get('tag');
  const initialQuery = urlParams.get('q');

  if (initialQuery) {
    state.search = initialQuery.toLowerCase().trim();
    searchInputs.forEach(i => {
      i.value = initialQuery;
    });
  }

  if (initialTag) {
    setTag(initialTag.toLowerCase().trim());
  }

  if (initialCat) {
    setCategory(initialCat);
  } else {
    render();
  }
};

<template>
  <aside v-if="tocItems.length" class="article-toc">
    <div class="toc-head">
      <span>目录</span>
      <small>{{ tocItems.length }}</small>
    </div>
    <nav>
      <button
        v-for="item in tocItems"
        :key="item.id"
        type="button"
        class="toc-link"
        :class="[`level-${item.level}`, { active: item.id === activeId }]"
        @click="scrollToHeading(item.id)"
      >
        {{ item.title }}
      </button>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

const props = defineProps<{
  toc?: string;
  content?: string;
}>();

const tocItems = ref<TocItem[]>([]);
const activeId = ref("");

let scrollTicking = false;

const normalizeTitle = (value: string) => {
  return value
    .replace(/[#*_`~>\[\]()]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
};

const parseManualToc = () => {
  return String(props.toc || "")
    .split("\n")
    .map((line) => {
      const match = line.match(/^(\s*)[-*+]\s+(.+)$/);
      if (!match) return null;
      const indent = match[1].replace(/\t/g, "  ").length;
      const title = match[2].trim();
      if (!title) return null;
      return {
        title,
        level: Math.min(3, Math.floor(indent / 2) + 1),
      };
    })
    .filter(Boolean) as { title: string; level: number }[];
};

const collectHeadings = () => {
  const headingEls = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".article-detail-content h1, .article-detail-content h2, .article-detail-content h3",
    ),
  ).filter((heading) => heading.id && heading.textContent?.trim());

  const headings = headingEls.map((heading) => ({
    id: heading.id,
    title: heading.textContent?.trim() || "",
    level: Number(heading.tagName.slice(1)) || 1,
    key: normalizeTitle(heading.textContent || ""),
  }));

  const manualToc = parseManualToc();
  if (!manualToc.length) {
    return headings.map(({ id, title, level }) => ({ id, title, level }));
  }

  const usedIds = new Set<string>();
  const matched = manualToc
    .map((item) => {
      const key = normalizeTitle(item.title);
      const heading = headings.find(
        (candidate) =>
          !usedIds.has(candidate.id) &&
          (candidate.key === key ||
            candidate.key.includes(key) ||
            key.includes(candidate.key)),
      );
      if (!heading) return null;
      usedIds.add(heading.id);
      return {
        id: heading.id,
        title: item.title,
        level: item.level,
      };
    })
    .filter(Boolean) as TocItem[];

  return matched.length ? matched : headings.map(({ id, title, level }) => ({
    id,
    title,
    level,
  }));
};

const updateActiveHeading = () => {
  scrollTicking = false;
  if (!tocItems.value.length) return;

  const anchorTop = 132;
  let current = tocItems.value[0].id;
  for (const item of tocItems.value) {
    const heading = document.getElementById(item.id);
    if (!heading) continue;
    if (heading.getBoundingClientRect().top <= anchorTop) {
      current = item.id;
    } else {
      break;
    }
  }
  activeId.value = current;
};

const onScroll = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateActiveHeading);
};

const refreshToc = async () => {
  await nextTick();
  window.setTimeout(() => {
    tocItems.value = collectHeadings();
    activeId.value = tocItems.value[0]?.id || "";
    updateActiveHeading();
  }, 0);
};

const scrollToHeading = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

watch(() => [props.toc, props.content], refreshToc, { immediate: true });

window.addEventListener("scroll", onScroll, { passive: true });

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped lang="less">
.article-toc {
  padding: 14px;
  border: 1px solid var(--line-color);
  border-radius: 14px;
  background: var(--surface-color);
  box-shadow: 0 8px 18px var(--shadow-color);
}

.toc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  color: var(--text-color);

  span {
    font-size: 15px;
    font-weight: 800;
  }

  small {
    min-width: 26px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: var(--primary-color);
    background: var(--primary-weak);
    font-size: 12px;
    font-weight: 800;
  }
}

nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-link {
  width: 100%;
  min-height: 30px;
  padding: 5px 8px;
  border-left: 2px solid transparent;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  line-height: 1.45;
  text-align: left;
  overflow-wrap: anywhere;
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    color: var(--text-color);
    background: color-mix(in srgb, var(--panel-color) 72%, transparent);
  }

  &.active {
    color: var(--primary-color);
    border-left-color: var(--primary-color);
    background: var(--primary-weak);
    font-weight: 800;
  }

  &.level-2 {
    padding-left: 20px;
  }

  &.level-3 {
    padding-left: 32px;
    font-size: 12px;
  }
}
</style>

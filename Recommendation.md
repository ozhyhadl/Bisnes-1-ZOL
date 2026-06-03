# Recommendation — Sales Backlog (executable)

Назначение: исполняемый бэклог задач для AI-агента (Claude Code / Copilot). Каждая задача — самодостаточная единица: contract, файлы, точные строки копирайта, acceptance criteria, проверка.

**Цель — рост конверсии в покупку.** Все правки оцениваются по влиянию на CR, AOV, scroll-to-pricing, mobile CR.

---

## Глобальные правила для агента

При выполнении любой задачи:

1. **Не менять русский headline для en-локали.** Копирайт на en — primary, остальные локали переводятся отдельно (es, fr, de, it, pt, pl, hi, uk, ru). Если задача меняет текст, обновить **все 10 локалей** в [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts).
2. **Использовать существующий i18n-доступ** через `useLanguage().t("section.key")`. Не хардкодить строки в JSX.
3. **Проверка после каждой задачи (обязательно):**
   - `npm run lint`
   - `npm run build`
   - `npm test` (если есть тесты на затронутый компонент)
   - открыть `npm run dev` на :8080 и визуально подтвердить.
4. **Atomic commit** на ветке `dev-1`: `feat(sales): T<N> — <короткое описание>`.
5. **Не трогать Paddle priceId** без явного подтверждения от пользователя.
6. **Не удалять чужие переводы** — если перевода нет, скопировать en и пометить `// TODO: translate`.
7. **Mobile проверять** на ширине 375px (iPhone 13 mini) и 390px.

---

## Sprint 1 — Hero и единый CTA

### T1. Headline на результат

**Контекст:** текущий headline в [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) под ключом `hero.headline` — "Stop Prompting. Start Running Your Business." Продаёт идею, не результат. На первом экране нужна outcome-формула.

**Файлы:** [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — ключ `hero.headline` (все 10 локалей).

**Точная замена (en):**
> `Ready-made contracts, posts, and plans in minutes — 500+ Claude Skills in one bundle.`

**Acceptance criteria:**
- В `hero.headline.en` — новая строка ровно как выше.
- Все 9 остальных локалей переведены (не оставлять старую строку).
- Hero рендерится без переноса >3 строк на desktop 1440px и >4 строк на mobile 375px.
- `npm run build` проходит.

---

### T2. Цена и one-time на CTA первого экрана

**Контекст:** `hero.primaryCta` сейчас "Get Instant Access". Не говорит, что одноразово и сколько стоит — пользователь боится клика.

**Файлы:**
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — `hero.primaryCta`, `hero.helper`.
- [src/components/HeroSection.tsx](src/components/HeroSection.tsx) — убедиться, что helper рендерится под CTA.

**Точная замена (en):**
- `hero.primaryCta`: `Get the Bundle — $15`
- `hero.helper`: `One-time payment · Instant download · Lifetime access`

**Acceptance criteria:**
- CTA-кнопка показывает текст с ценой.
- Helper строка под CTA, мелким шрифтом, не первичный visual weight.
- На mobile 375px текст CTA не переносится на 2 строки ни в одной из 10 локалей. Если переносится — задача T20 берёт сокращение для mobile.

---

### T3. Унификация всех CTA на странице

**Контекст:** сейчас 8 разных формулировок CTA, что размывает один offer.

**Файлы:** [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — ключи:
- `header.primaryCta`
- `hero.primaryCta` (готов после T2)
- `steps.cta`
- `whatAreSkills.cta`
- `targetUsers.cta`
- `skillsList.cta`
- `faq.cta` (если есть)
- `finalCta.cta`
- `pricing.cta` (исключение, см. T4)

**Точная замена (en) для всех кроме pricing:**
> `Get the Bundle — $15`

**Pricing (T4 ниже):** `Buy Now — $15`

**Acceptance criteria:**
- В коде нет ни одного места, где CTA-текст хардкоден в JSX (всё через `t()`).
- 8 CTA вне Pricing все равны `Get the Bundle — $15` на en (и эквивалент в других локалях).
- Pricing CTA = `Buy Now — $15`.
- Скриншот mobile + desktop с подтверждением.

---

### T4. Снять CAPS и привести Pricing CTA в систему

**Контекст:** `pricing.cta` сейчас "BUY NOW AND START" — CAPS ломает терминальную эстетику остального лендинга.

**Файлы:** [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — `pricing.cta`. CSS не трогать (нет `text-transform: uppercase` в `PricingSection`).

**Точная замена (en):** `Buy Now — $15`

**Acceptance criteria:**
- Кнопка отображается без uppercase.
- Шрифт и вес кнопки соответствуют другим CTA.

---

### T5. Trust-строка → outcome-чипы + логотипы

**Контекст:** текущая `hero.trustStrip` — "★★★★★ 4.9/5 | 1,200+ buyers | Works in Claude.ai, Code & Cowork". Цифры голословны (нет источника), компатибельность — это не доверие.

**Файлы:**
- [src/components/HeroSection.tsx](src/components/HeroSection.tsx) — заменить строку на массив чипов + ряд логотипов.
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — добавить ключи:
  - `hero.outcomeChips` (массив из 3 строк)
  - `hero.platformsLabel` ("Works with")
- Логотипы svg положить в `src/assets/logos/` (claude.svg, claude-code.svg, n8n.svg). Если нет — поставить TODO-плейсхолдеры с текстом и оставить задачу T5b на дизайн.

**Точная замена (en):**
- `hero.outcomeChips`: `["Blog posts", "Contracts", "Sales emails"]`
- `hero.platformsLabel`: `Works with`

**Acceptance criteria:**
- В hero видны 3 чипа + ряд из 3 логотипов под CTA.
- Старая trust-строка удалена.
- Чипы на mobile в одну строку, без переноса.
- Если svg ещё нет — заглушка с текстом-названием платформы и комментарий `// TODO: add logo svg`.

---

### T6. Удалить дублирующий eyebrow

**Контекст:** `hero.eyebrow` = "⚡ AI Cloud Base" дублирует логотип в Header.

**Файлы:**
- [src/components/HeroSection.tsx](src/components/HeroSection.tsx) — удалить рендер eyebrow.
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — оставить ключ (не удалять, чтобы не ломать историю), либо удалить если используется только в Hero.

**Acceptance criteria:**
- На hero нет строки "⚡ AI Cloud Base".
- Грид первого экрана не сдвинулся (компенсировать spacing).

---

## Sprint 2 — Pricing и доверие

### T7. Поднять цену bundle и подготовить A/B

**Контекст:** $15 воспринимается как "спам-цена". Нужен тест $19/$27.

**Файлы:**
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — все вхождения "$15".
- [src/components/PricingSection.tsx](src/components/PricingSection.tsx) — переменная `currentPrice`.
- Paddle: НЕ менять priceId без подтверждения. Создать TODO-плейсхолдер `// TODO: confirm new Paddle price` в месте чекаута.

**Acceptance criteria:**
- В коде есть единая константа `BUNDLE_PRICE = "$19"` (или `"$27"` по решению пользователя), использованная везде.
- Все CTA-тексты `Get the Bundle — $19` в копирайте.
- Не запускать в prod без обновления Paddle priceId.

**Блокер:** требуется подтверждение пользователя по Paddle.

---

### T8. Заменить ценовой якорь $707

**Контекст:** разница 47x ($707→$15) ломает доверие. Норма — 5-10x.

**Файлы:**
- [src/components/PricingSection.tsx](src/components/PricingSection.tsx) — удалить таблицу из 7 line-items со старыми ценами.
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — `pricing.lineItems`, `pricing.totalValue`, `pricing.todayPrice`. Добавить `pricing.anchor`.

**Точная замена (en):**
- `pricing.anchor`: `Sold separately, these templates run $200–$300. Bundle price: $19.`

**Acceptance criteria:**
- На странице нет числа $707 и нет 7-строчной таблицы.
- Над финальной ценой одна строка-якорь.
- Зачёркнутая старая цена есть — но это $200–$300, не $707.

---

### T9. Money-back guarantee badge

**Контекст:** нет risk reversal. Это снимает финальное возражение.

**Файлы:**
- [src/components/PricingSection.tsx](src/components/PricingSection.tsx) — badge под CTA.
- [src/components/FinalCTASection.tsx](src/components/FinalCTASection.tsx) — то же.
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — новый ключ `common.guarantee`.

**Точная замена (en):** `7-day money-back guarantee · No questions asked`

**Acceptance criteria:**
- Badge виден под обеими CTA-кнопками (Pricing, FinalCTA).
- Иконка щита/чека рядом с текстом (Lucide icon).
- Юридически: проверить, что мы реально готовы возвращать. Если нет — задача блокируется до решения.

---

### T10. Блок отзывов

**Контекст:** "1,200+ buyers" — декларация. Нужны 3-5 реальных отзывов.

**Файлы (новый компонент):**
- `src/components/TestimonialsSection.tsx` — карточки с avatar/name/role/quote/result.
- `src/data/testimonials.ts` — массив объектов `{name, role, avatar, quote, result}`.
- [src/pages/Index.tsx](src/pages/Index.tsx) — вставить **перед** PricingSection.
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — `testimonials.title`, `testimonials.subtitle`.

**Acceptance criteria:**
- Минимум 3 карточки.
- Если реальных отзывов нет — компонент готов, но в `testimonials.ts` массив помечен `// TODO: replace with real testimonials`. **Не публиковать в prod с фейковыми отзывами.** Если нет — задача доходит до состояния "готова, ждёт контента".
- Карусель/grid responsive.

**Блокер:** нужны реальные отзывы от пользователя.

---

### T11. Sample output скиллов

**Контекст:** нет демонстрации результата.

**Файлы:**
- [src/components/SkillsListSection.tsx](src/components/SkillsListSection.tsx) или новый `src/components/SampleOutputSection.tsx`.
- 1-2 раскрывающихся блока: "Sample: Contract output", "Sample: Blog post output".
- Контент markdown в `src/data/sampleOutputs.ts`.

**Acceptance criteria:**
- Блок collapsed by default.
- Раскрытие через `<details>` или Radix Accordion.
- Контент — реальный output одного из скиллов, не lorem.

---

## Sprint 3 — Структура страницы

### T12. Поменять местами Steps и WhatAreSkills

**Файлы:** [src/pages/Index.tsx](src/pages/Index.tsx) — переставить компоненты.

**Acceptance criteria:**
- Порядок: Hero → WhatAreSkills → Steps → TargetUsers → SkillsList → Pricing+Upsell → FAQ → FinalCTA.

---

### T13. Сократить TargetUsers до 3 персон

**Файлы:**
- [src/components/TargetUsersSection.tsx](src/components/TargetUsersSection.tsx) — рендерить 3 первые персоны.
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — `targetUsers.personas` оставить только: `solopreneurs`, `freelancers`, `agencyOwners`.

**Acceptance criteria:**
- На странице 3 карточки персон вместо 6.
- Лишние ключи в landingCopy либо удалены, либо оставлены с комментарием `// hidden — bring back if AOV drops`.

---

### T14. Inline-чекбокс upsell в Pricing

**Контекст:** Upsell-секция визуально равна Pricing → конкурируют.

**Файлы:**
- [src/components/PricingSection.tsx](src/components/PricingSection.tsx) — внутри карточки добавить чекбокс над CTA.
- [src/components/UpsellOfferSection.tsx](src/components/UpsellOfferSection.tsx) — удалить из [src/pages/Index.tsx](src/pages/Index.tsx).
- Логика: state `addOnSelected`, итог `total = bundle + (addOnSelected ? 10 : 0)`. Передать в Paddle checkout.

**Точная замена (en):** label чекбокса — `+ Add 1,800 N8N Workflows for $10 (save $5)`

**Acceptance criteria:**
- Отдельной секции Upsell нет.
- Чекбокс работает, итог пересчитывается визуально.
- Paddle checkout получает корректный набор товаров (требует подтверждения priceId — блокер до пользователя).

---

### T15. FinalCTA — уникальный closing pitch

**Файлы:**
- [src/components/FinalCTASection.tsx](src/components/FinalCTASection.tsx) — добавить 3 элемента: guarantee badge (T9), urgency (T24), price-reason "now vs later".
- [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — `finalCta.priceReason`.

**Точная замена (en):** `finalCta.priceReason`: `$19 is the beta price. After public launch — $39.`

**Acceptance criteria:**
- FinalCTA не дублирует Hero ни по headline, ни по бенефитам.
- Виден guarantee badge, urgency-блок (если T21 готов), price reason.

---

## Sprint 4 — Mobile

### T16. Сжать mobile hero

**Файлы:** [src/components/HeroSection.tsx](src/components/HeroSection.tsx) — Tailwind responsive: `hidden md:block` для второстепенных элементов.

**Acceptance criteria (на 375px):**
- В первом экране (без скролла) видны: headline, 1 строка body, CTA, helper.
- Trust-чипы и логотипы — ниже fold, видны после первого скролла.
- LCP не ухудшился (проверить Lighthouse mobile).

---

### T17. Sticky mobile CTA

**Файлы:**
- Новый `src/components/StickyMobileCTA.tsx` — fixed bottom, `md:hidden`, появляется через IntersectionObserver когда Hero CTA уходит из viewport, скрывается когда видна PricingSection или FinalCTA.
- Монтировать в [src/pages/Index.tsx](src/pages/Index.tsx).

**Текст (en):** `Get the Bundle — $19`

**Acceptance criteria:**
- На mobile после скролла Hero — sticky CTA внизу.
- Не перекрывает PricingSection и FinalCTA.
- z-index не конфликтует с LanguageSuggestionBanner.

---

### T18. Скрыть декоративный header TerminalWindow на mobile

**Файлы:** компонент TerminalWindow (найти и обновить, использовать `hidden md:flex` для блока с тремя точками).

**Acceptance criteria:**
- На mobile нет полосы с точками + prompt.
- На desktop без изменений.

---

### T19. Сжать line-items в Pricing на mobile

**Файлы:** [src/components/PricingSection.tsx](src/components/PricingSection.tsx) — на mobile line-items в `<details>` с label "What's included".

**Acceptance criteria:**
- На mobile видна сразу финальная цена + CTA.
- Список разворачивается по тапу.

---

### T20. Сократить длинные локали на mobile

**Файлы:** [src/i18n/landingCopy.ts](src/i18n/landingCopy.ts) — добавить опциональные `*Mobile` ключи для RU, DE, UK, PT для `hero.headline`, `hero.primaryCta`, `hero.helper`. Если ключа нет — fallback на основной.

**Acceptance criteria:**
- На 375px ни один CTA не переносится на 2 строки в RU/DE/UK/PT.
- Hero headline в RU/DE/UK на mobile ≤ 2 строк.

---

## Sprint 5 — Urgency

### T21. Persistent 10-минутный таймер

**Контекст:** план уже в [todo](todo).

**Файлы (новые):**
- `src/hooks/useCountdown.ts` — хук, читает из `localStorage` ключ `aicldbase_offer_deadline` (timestamp). Если нет — устанавливает `Date.now() + 10*60*1000`. Возвращает `{minutes, seconds, isExpired}`.
- `src/components/OfferCountdown.tsx` — рендер `MM:SS` + label.
- Вставить в [src/components/HeroSection.tsx](src/components/HeroSection.tsx) (под CTA) и [src/components/PricingSection.tsx](src/components/PricingSection.tsx) (над CTA).

**Точная замена (en):** label — `Offer ends in`

**Acceptance criteria:**
- Перезагрузка страницы не сбрасывает таймер.
- При `isExpired === true` срабатывает T22.
- В DevTools (Application → Local Storage) виден ключ.
- Не используется `setInterval` без cleanup (memory leak).

---

### T22. Force-sale popup на 0:00

**Файлы (новые):**
- `src/components/ForceSalePopup.tsx` — Radix Dialog. Открывается когда `useCountdown().isExpired === true`. Закрытие → запись `aicldbase_popup_dismissed = true` в localStorage (чтобы не задалбывало).

**Контент (en):**
- Title: `Last chance — offer expires now.`
- Body: `The $19 beta price is closing. After this session it goes back to $39.`
- CTA: `Buy Now — $19`
- Secondary: `Close`

**Acceptance criteria:**
- Popup не открывается дважды в одной сессии.
- ESC и клик по backdrop закрывают.
- a11y: focus trap, `aria-modal`, return focus после закрытия.

---

### T23. Cohort-механика для upsell

**Файлы:** [src/components/PricingSection.tsx](src/components/PricingSection.tsx) — рядом с чекбоксом T14.

**Текст (en):** `N8N add-on at $10 only with the bundle today. Not sold separately.`

**Acceptance criteria:** строка видна возле чекбокса.

---

### T24. Цена-причина в FinalCTA

См. T15.

---

## Sprint 6 — Добивающий proof

### T25. Видео-демо 30-60 сек

**Файлы:**
- Новый `src/components/DemoVideoSection.tsx` — `<video>` с poster, `playsInline`, `muted`, кнопка play.
- Видео в `public/demo.mp4` (mp4 + webm).
- [src/pages/Index.tsx](src/pages/Index.tsx) — перед Pricing.

**Acceptance criteria:**
- Lazy-load (компонент через React.lazy).
- LCP не ухудшился.
- Видео не autoplay.
- Если файла нет — компонент готов, плейсхолдер `// TODO: add demo.mp4`.

---

### T26. SkillsList collapsed на mobile

**Файлы:** [src/components/SkillsListSection.tsx](src/components/SkillsListSection.tsx) — на mobile показывать первые 8-10 скиллов, кнопка "Show full directory (501)".

**Acceptance criteria:**
- На mobile секция занимает ≤ 1.5 экрана до раскрытия.
- На desktop без изменений.

---

## Sprint 7 — Аналитика и оптимизация (нужно для измерения эффекта)

### T27. Events на ключевые действия

**Файлы:**
- `src/lib/analytics.ts` — обертка над Meta Pixel + кастомные events.
- Все CTA-клики, чекбокс upsell, открытие popup, истечение таймера, скролл до Pricing.

**Список events:**
- `cta_click` (with location: hero/header/steps/pricing/final/sticky)
- `upsell_toggle` (selected: true/false)
- `popup_force_sale_shown`
- `popup_force_sale_cta_click`
- `scroll_to_pricing`
- `purchase_initiated`
- `purchase_completed`

**Acceptance criteria:**
- В Network видны fetch к нашему collector / Meta CAPI.
- Нет PII в payload.

---

### T28. Exit-intent popup (desktop)

**Файлы:** новый `src/components/ExitIntentPopup.tsx` — слушает `mouseleave` на document когда `clientY < 0`. Показывает 1 раз за сессию.

**Контент (en):**
- Title: `Wait — before you go.`
- Body: `Take the bundle at the beta price ($19). 7-day money-back guarantee.`
- CTA: `Buy Now — $19`

**Acceptance criteria:**
- Только desktop (mobile нет mouseleave-up).
- Sessionstorage флаг чтобы не показывать повторно.

---

## Правила копирайтинга (для агента)

- **Headline = outcome.** Не "stop X", а "get Y".
- **CTA = глагол + результат + цена.** `Get the Bundle — $19`. Не `Get Started`.
- **Числа конкретные.** `501 skills`, `1,800 workflows`, `7-day guarantee`. Не "many", не "lots".
- **Один CTA-глагол** на лендинге (исключение Pricing — `Buy`).
- **Microcopy под CTA** объясняет, что произойдёт после клика.
- **Active voice, 2nd person.** "You get..." вместо "Users will receive...".

---

## KPI (как измерять успех)

| Метрика | Где смотрим | Цель |
|---|---|---|
| CR landing → checkout init | T27 events | +30% baseline |
| CR landing → purchase | Paddle dashboard + T27 | +20% |
| AOV | Paddle dashboard | +10% (через T14 upsell) |
| Hero CTA CTR | T27 `cta_click hero` / sessions | ≥ 8% |
| Scroll-to-pricing | T27 `scroll_to_pricing` / sessions | ≥ 60% |
| Mobile vs desktop CR gap | Paddle + analytics | сократить ≥ на 50% |

---

## Порядок исполнения для агента

| # | Спринт | Задачи | Блокеры |
|---|---|---|---|
| 1 | Sprint 1 | T1, T2, T3, T4, T5, T6 | T5 — нужны svg логотипов (можно начать с заглушек) |
| 2 | Sprint 7 | T27 | — |
| 3 | Sprint 5 | T21, T22, T23, T24 | — |
| 4 | Sprint 2 | T7, T8, T9, T10, T11 | T7 — Paddle priceId; T9 — политика возвратов; T10 — реальные отзывы |
| 5 | Sprint 3 | T12, T13, T14, T15 | T14 — Paddle |
| 6 | Sprint 4 | T16–T20 | — |
| 7 | Sprint 6 | T25, T26 | T25 — видео-файл |
| 8 | Sprint 7 | T28 | — |

**Старт:** агент берет T1, выполняет contract → acceptance → проверка → коммит. Переходит к T2. И так далее.

**Если задача упирается в блокер** (Paddle, контент, юр. вопросы) — оставить на ветке готовую реализацию + флаг feature toggle, не мерджить в main, спросить пользователя.

import { CampaignBrief } from './types';

export function generateMarkdown(data: CampaignBrief): string {
  const getCheckbox = (condition: boolean) => condition ? '- [x]' : '- [ ]';

  return `# 📋 Кампанеен брифинг — AutoKrasi

## БЛОК 1 — 🎯 КАМПАНЕЙНА РАМКА

### 1. ⚡ Период на кампанията
**Начало:** ${data.startDate || '___________'}
**Край:** ${data.endDate || '___________'}

### 2. ⚡ Каква е основната цел на кампанията?
${getCheckbox(data.primaryGoal === 'Brand awareness')} **Brand awareness** — искам повече хора да ме познават
${getCheckbox(data.primaryGoal === 'Трафик към autokrasi.bg')} **Трафик към autokrasi.bg** — онлайн продажби
${getCheckbox(data.primaryGoal === 'Трафик към магазина в Плевен')} **Трафик към магазина в Плевен** — офлайн посещения
${getCheckbox(data.primaryGoal === 'Сезонен push')} **Сезонен push** — точно в момента тези продукти са търсени
${getCheckbox(data.primaryGoal === 'Launch на нов продукт')} **Launch на нов продукт** — представяме го на аудиторията
${getCheckbox(data.primaryGoal === 'Почистване на склад')} **Почистване на склад** — разтоварване на конкретни наличности

### 3. ⚡ Тема на кампанията в едно изречение
${data.theme || '___________'}

### 4. Има ли конкретен trigger, който диктува timing-а?
${data.trigger || '___________'}

### 5. Кои формати искаш да присъстват в кампанията?
${getCheckbox(data.formats.includes('Тествам и оценявам'))} 🧪 **Тествам и оценявам**
${getCheckbox(data.formats.includes('How-to'))} 📚 **How-to / tutorial**
${getCheckbox(data.formats.includes('Talking head'))} 💬 **Talking head**
${getCheckbox(data.formats.includes('Brand story'))} 📖 **Brand story**
${getCheckbox(data.formats.includes('Meme'))} 😂 **Meme / хумор**
${getCheckbox(data.formats.includes('Q&A'))} ❓ **Q&A**
${getCheckbox(data.formats.includes('Оставям на вас'))} **Оставям на вас да решите**

## БЛОК 2 — 📦 ПРОДУКТИ

### 6. ⚡ Списък с продукти в кампанията
| # | Име на продукта | Линк | Приоритет |
|---|-----------------|------|-----------|
${data.products.map((p, i) => `| ${i + 1} | ${p.name || '-'} | ${p.link || '-'} | ${p.priority} |`).join('\n')}

### 7. Има ли продукт(и), които трябва да се разтоварят?
${data.inventoryPush || '___________'}

### 8. ⚡ За всеки HERO продукт — твоите лични впечатления
${data.products.filter(p => p.priority === 'HERO').map(p => {
  const insight = data.heroInsights[p.id] || { used: '', likes: '', dislikes: '', recommendTo: '' };
  return `**Продукт: ${p.name || 'Неозаглавен'}**
1. Ползвал ли си го лично? → ${insight.used || '-'}
2. Какво ти ХАРЕСВА в него? → ${insight.likes || '-'}
3. Какво НЕ ти харесва / слабости? → ${insight.dislikes || '-'}
4. На кой тип клиент би го препоръчал и защо? → ${insight.recommendTo || '-'}
`;
}).join('\n')}

### 9. ⚡ Какво казват клиентите за тези продукти в магазина?
**Типични въпроси на клиентите:**
${data.customerQuestions || '___________'}

**Защо го купуват:**
${data.customerReasons || '___________'}

**Често срещани съмнения преди покупка:**
${data.customerFears || '___________'}

**Неща, които клиентите НЕ знаят, но трябва да знаят:**
${data.customerUnknowns || '___________'}

### 10. Имаш ли конкретна история/анекдот с някой продукт?
${data.anecdote || '___________'}

## БЛОК 3 — 📚 ПРЕДИШЕН ОПИТ & ПОЗИЦИОНИРАНЕ

### 11. Тези продукти промотирани ли са преди?
${getCheckbox(data.promotedBefore === 'Не')} Не — първи път са в кампания
${getCheckbox(data.promotedBefore === 'Да')} Да — резултатът беше: ${data.promotedBefore === 'Да' ? data.promotedResult : '___________'}
${getCheckbox(data.promotedBefore === 'Частично')} Частично: ${data.promotedBefore === 'Частично' ? data.promotedResult : '___________'}

### 12. ⚡ Имаме ли нещо ексклузивно?
${data.exclusive || '___________'}

### 13. Какво НЕ искаме да повтаряме от предишни кампании?
${data.avoid || '___________'}

## БЛОК 4 — 🎨 ТВОРЧЕСКИ ОРИЕНТИР

### 14. Референсни клипове
${data.references.length > 0 ? data.references.map((r, i) => `**Референц ${i + 1}:** ${r.link}\n**Защо го харесваш:** ${r.reason}\n`).join('\n') : '___________'}

### 15. Задължителни послания/ъгли
${data.mandatoryMessages || '___________'}

### 16. Забрани — неща, които да НЕ споменаваме
${getCheckbox(data.donts.includes('Без споменаване на конкуренти по име'))} Без споменаване на конкуренти по име
${getCheckbox(data.donts.includes('Без цени във видеото'))} Без цени във видеото
${getCheckbox(data.donts.includes('Без промо-код'))} Без промо-код / отстъпки
${getCheckbox(data.donts.includes('Без споменаване на доставчика по име'))} Без споменаване на доставчика по име
${getCheckbox(data.donts.includes('Без политика'))} Без политика / еврото / актуални обществени теми
${getCheckbox(data.donts.includes('Без хумор за сметка на клиенти'))} Без хумор за сметка на клиенти
${getCheckbox(data.donts.includes('Друго'))} Друго: ${data.otherDont || '___________'}

### 17. Continuity
${getCheckbox(data.continuity === 'Самостоятелни')} **Самостоятелни** — всеки клип стои сам за себе си
${getCheckbox(data.continuity === 'Tematichen arc')} **Tematichen arc** — обща тема, но без строг ред
${getCheckbox(data.continuity === 'Мини-сериал')} **Мини-сериал** — има story arc
${getCheckbox(data.continuity === 'Оставям на вас')} **Оставям на вас** — нямам предпочитание

### 18. Специфичен CTA?
${getCheckbox(data.cta === 'Стандартен CTA')} Стандартен CTA
${getCheckbox(data.cta === 'Ела в магазина')} "Ела в магазина до [дата]"
${getCheckbox(data.cta === 'Поръчай от autokrasi.bg')} "Поръчай от autokrasi.bg"
${getCheckbox(data.cta === 'Пиши в коментар')} "Пиши в коментар твоята кола / твоя опит"
${getCheckbox(data.cta === 'Тагни приятел')} "Тагни приятел, на когото ще му трябва"
${getCheckbox(data.cta === 'Друго')} Друго: ${data.otherCta || '___________'}

## БЛОК 5 — 📅 АВАЙЛАБИЛИТИ

### 19. Кога можеш да снимаш през кампанията?
${data.shootAvailability || '___________'}

### 20. Специфични реквизити/инструменти?
${data.propsReq || '___________'}

### 21. Предпочитана локация на заснемане?
${getCheckbox(data.location === 'В магазина')} В магазина
${getCheckbox(data.location === 'Пред магазина (отвън)')} Пред магазина (отвън)
${getCheckbox(data.location === 'В/около кола')} В/около кола
${getCheckbox(data.location === 'Терен')} Терен (къмпинг, път, природа)
${getCheckbox(data.location === 'Смесено')} Смесено — различни за различните клипове
${getCheckbox(data.location === 'Без предпочитание')} Без предпочитание

## БЛОК 6 — 🎁 ФИНАЛНО

### 22. Нещо, което не сме попитали, но трябва да знаем?
${data.anythingElse || '___________'}
`;
}

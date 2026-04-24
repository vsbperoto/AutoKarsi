import { useState, useRef, useEffect } from 'react';
import { Download, FileDown, Copy, CheckCircle2, AlertCircle, Plus, Trash2, CloudUpload, Loader2 } from 'lucide-react';
import { INITIAL_BRIEF, CampaignBrief, Priority, Product, HeroInsight } from './types';
import { Card, Label, Input, Textarea, Helper, Checkbox, Radio, Button } from './components/ui';
import { generateMarkdown } from './lib/export';
import { saveBriefToDatabase } from './lib/firebase-service';

export default function App() {
  const [brief, setBrief] = useState<CampaignBrief>(() => {
    try {
      const saved = localStorage.getItem('autokrasi_brief_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Local storage error", e);
    }
    return INITIAL_BRIEF;
  });
  
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    localStorage.setItem('autokrasi_brief_v1', JSON.stringify(brief));
  }, [brief]);

  const updateBrief = (updates: Partial<CampaignBrief>) => {
    setBrief(prev => ({ ...prev, ...updates }));
  };

  const handleCopy = async () => {
    const md = generateMarkdown(brief);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown(brief);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Campaign_Brief_AutoKrasi_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Attempt to save. If config is missing, this will fail gracefully.
    try {
      const result = await saveBriefToDatabase(brief);
      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        alert("Грешка при запис в базата данни. Системата за автоматично свързване е временно недостъпна.\n\n" + (result.error || ''));
      }
    } catch (e) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-600">AutoKrasi</h1>
              <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest">Кампанеен Брифинг v1.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleCopy} className="!px-4 !py-2 !text-sm">
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              Копирай Чернова
            </Button>
            <Button onClick={handleDownload} className="!px-6 !py-2">
              <Download className="w-4 h-4" />
              Свали Markdown
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Intro */}
        <div className="bg-[#0F172A] p-6 text-white rounded-xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2 relative z-10">
            <AlertCircle className="w-4 h-4" />
            Инструкции
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
            Този брифинг ни помага да разберем <strong>твоята визия</strong> и <strong>пулса на клиентите</strong>.
            Ние вадим техническите данни—от теб искаме личния опит. Няма грешни отговори!
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400 relative z-10">
            <span className="flex items-center gap-1"><span className="text-blue-500">⚡</span>Критични полета</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-slate-400"></span>Опционални</span>
          </div>
        </div>

        {/* BLOCK 1 */}
        <Card>
          <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">01</span>
               🎯 Кампанейна Рамка
            </h2>
          </div>
          <div className="p-6 space-y-8 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Начало</Label>
                <Input type="date" value={brief.startDate} onChange={e => updateBrief({ startDate: e.target.value })} />
              </div>
              <div>
                <Label required>Край</Label>
                <Input type="date" value={brief.endDate} onChange={e => updateBrief({ endDate: e.target.value })} />
              </div>
            </div>

            <div>
              <Label required>Основна цел</Label>
              <Helper>Избери само една основна цел.</Helper>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Brand awareness', 'Трафик към autokrasi.bg', 'Трафик към магазина в Плевен', 'Сезонен push', 'Launch на нов продукт', 'Почистване на склад'].map(goal => (
                  <Radio key={goal} label={goal} checked={brief.primaryGoal === goal} onChange={() => updateBrief({ primaryGoal: goal })} />
                ))}
              </div>
            </div>

            <div>
              <Label required>Тема в едно изречение</Label>
              <Input className="mt-2 text-base font-medium" placeholder="Напр. Месец на добавките Bardahl..." value={brief.theme} onChange={e => updateBrief({ theme: e.target.value })} />
              <Helper>Пиши както говориш на клиент в сервиза.</Helper>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <Label>Конкретен trigger за timing-а? (Опционално)</Label>
              <Input className="mt-2" placeholder="Опиши ако има..." value={brief.trigger} onChange={e => updateBrief({ trigger: e.target.value })} />
              <Helper>Пример: начало на къмпинг сезон, промо от доставчик</Helper>
            </div>

            <div>
              <Label>Формати на клиповете</Label>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Тествам и оценявам', 'How-to', 'Talking head', 'Brand story', 'Meme', 'Q&A', 'Оставям на вас'].map(fmt => (
                  <Checkbox 
                    key={fmt} 
                    label={fmt === 'Тествам и оценявам' ? `🧪 ${fmt}` : fmt} 
                    checked={brief.formats.includes(fmt)} 
                    onChange={(c) => {
                      const newFmts = c ? [...brief.formats, fmt] : brief.formats.filter(f => f !== fmt);
                      updateBrief({ formats: newFmts });
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* BLOCK 2 */}
        <Card>
          <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">02</span>
               📦 Продукти
            </h2>
            <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => updateBrief({ products: [...brief.products, { id: Date.now().toString(), name: '', link: '', priority: 'SUPPORTING' }] })}>
              <Plus className="w-3 h-3" /> Добави продукт
            </Button>
          </div>
          <div className="p-6 space-y-8 bg-white">
            <div>
              <Label required>Списък с продукти</Label>
              
              <div className="space-y-3 mt-3">
                {brief.products.map((p, i) => (
                  <div key={p.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg relative group shadow-sm hover:border-blue-300 transition-colors">
                    <div className="flex-1">
                      <Input placeholder="Име на продукта" className="bg-white" value={p.name} onChange={e => {
                        const newProducts = [...brief.products];
                        newProducts[i].name = e.target.value;
                        updateBrief({ products: newProducts });
                      }} />
                    </div>
                    <div className="flex-1">
                      <Input placeholder="Линк (autokrasi.bg)" className="bg-white" value={p.link} onChange={e => {
                        const newProducts = [...brief.products];
                        newProducts[i].link = e.target.value;
                        updateBrief({ products: newProducts });
                      }} />
                    </div>
                    <div className="w-full sm:w-40 flex gap-2">
                       <select 
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
                        value={p.priority}
                        onChange={e => {
                          const newProducts = [...brief.products];
                          newProducts[i].priority = e.target.value as Priority;
                          updateBrief({ products: newProducts });
                        }}
                      >
                        <option value="HERO">🔥 HERO</option>
                        <option value="SUPPORTING">📦 SUPPORT</option>
                        <option value="EXPERIMENTAL">🧪 EXP</option>
                      </select>
                      {brief.products.length > 1 && (
                        <button onClick={() => {
                          const newProducts = brief.products.filter((_, idx) => idx !== i);
                          updateBrief({ products: newProducts });
                        }} className="p-2.5 text-slate-400 hover:text-red-600 transition-colors bg-white border border-slate-200 hover:border-red-200 rounded-lg shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <Label>Има ли продукти за разтоварване (inventory натиск)?</Label>
              <Textarea className="mt-2 h-20 bg-white" value={brief.inventoryPush} onChange={e => updateBrief({ inventoryPush: e.target.value })} placeholder="Няма..." />
              <Helper>Ако имаш 200 бройки нещо и искаш да ги свалиш, кажи.</Helper>
            </div>

            {brief.products.filter(p => p.priority === 'HERO').length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="text-xl">🔥</span> 
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Инсайти за HERO продуктите</h3>
                </div>
                {brief.products.filter(p => p.priority === 'HERO').map(p => {
                  const insight = brief.heroInsights[p.id] || { used: '', likes: '', dislikes: '', recommendTo: '' };
                  const setInsight = (update: Partial<HeroInsight>) => {
                    updateBrief({ heroInsights: { ...brief.heroInsights, [p.id]: { ...insight, ...update } } });
                  };
                  return (
                    <div key={p.id} className="p-5 bg-orange-50/50 border border-orange-100 rounded-xl space-y-5">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 bg-white border border-orange-200 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">HERO</span>
                        <h4 className="font-bold text-slate-800">{p.name || 'Неозаглавен HERO продукт'}</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>1. Ползвал ли си го лично?</Label>
                          <Input className="bg-white" value={insight.used} onChange={e => setInsight({ used: e.target.value })} placeholder="Да / Не / Отчасти" />
                        </div>
                        <div>
                          <Label>2. Какво ти ХАРЕСВА в него?</Label>
                          <Textarea className="bg-white" value={insight.likes} onChange={e => setInsight({ likes: e.target.value })} />
                        </div>
                        <div>
                          <Label>3. Какво НЕ ти харесва / слабости?</Label>
                          <Textarea className="bg-white" value={insight.dislikes} onChange={e => setInsight({ dislikes: e.target.value })} />
                        </div>
                        <div>
                          <Label>4. На кой тип клиент би го препоръчал и защо?</Label>
                          <Textarea className="bg-white" value={insight.recommendTo} onChange={e => setInsight({ recommendTo: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-6 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-2">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-100 w-full pb-3 flex items-center gap-2">
                   <span className="text-blue-500">💬</span> Пулсът на клиента
                 </h3>
              </div>
              
              <div>
                <Label required>Типични въпроси на клиентите</Label>
                <Textarea value={brief.customerQuestions} onChange={e => updateBrief({ customerQuestions: e.target.value })} placeholder="Когато влязат в магазина, какво питат най-често?" />
              </div>
              <div>
                <Label required>Защо го купуват?</Label>
                <Textarea value={brief.customerReasons} onChange={e => updateBrief({ customerReasons: e.target.value })} placeholder="По твое мнение..." />
              </div>
              <div>
                <Label required>Съмнения/страхове преди покупка</Label>
                <Textarea value={brief.customerFears} onChange={e => updateBrief({ customerFears: e.target.value })} placeholder="Какво ги спира?" />
              </div>
              <div>
                <Label required>Неща, които НЕ знаят, но трябва</Label>
                <Textarea value={brief.customerUnknowns} onChange={e => updateBrief({ customerUnknowns: e.target.value })} placeholder="Често срещани грешки..." />
              </div>
              <div>
                <Label>История / Анекдот (Само ако има реална)</Label>
                <Textarea value={brief.anecdote} onChange={e => updateBrief({ anecdote: e.target.value })} placeholder="Например: Един клиент дойде и..." />
              </div>
            </div>
          </div>
        </Card>

        {/* BLOCK 3 */}
        <Card>
          <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">03</span>
               📚 Опит & Позициониране
            </h2>
          </div>
          <div className="p-6 space-y-6 bg-white">
            <div>
              <Label>Промотирани ли са преди?</Label>
              <div className="mt-3 flex flex-col gap-3">
                <Radio label="Не — първи път са в кампания" checked={brief.promotedBefore === 'Не'} onChange={() => updateBrief({ promotedBefore: 'Не' })} />
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <Radio label="Да — резултатът беше:" checked={brief.promotedBefore === 'Да'} onChange={() => updateBrief({ promotedBefore: 'Да' })} />
                  </div>
                  {brief.promotedBefore === 'Да' && <Input className="flex-1" value={brief.promotedResult} onChange={e => updateBrief({ promotedResult: e.target.value })} />}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <Radio label="Частично (1-2 продукта):" checked={brief.promotedBefore === 'Частично'} onChange={() => updateBrief({ promotedBefore: 'Частично' })} />
                  </div>
                  {brief.promotedBefore === 'Частично' && <Input className="flex-1" value={brief.promotedResult} onChange={e => updateBrief({ promotedResult: e.target.value })} />}
                </div>
              </div>
            </div>

            <div>
              <Label required>Ексклузивност</Label>
              <Textarea className="mt-2" value={brief.exclusive} onChange={e => updateBrief({ exclusive: e.target.value })} placeholder="Ако няма, напиши 'стандартни продукти'..." />
              <Helper>Имаме ли по-добра цена, гаранция, наличност спрямо конкуренти?</Helper>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <Label>Какво НЕ искаме да повтаряме?</Label>
              <Textarea className="mt-2 bg-white" value={brief.avoid} onChange={e => updateBrief({ avoid: e.target.value })} placeholder="Нямам забележки..." />
              <Helper>Подходи или грешки от предишни кампании</Helper>
            </div>
          </div>
        </Card>

        {/* BLOCK 4 */}
        <Card>
          <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">04</span>
               🎨 Творчески Ориентир
            </h2>
            <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => updateBrief({ references: [...brief.references, { id: Date.now().toString(), link: '', reason: '' }] })}>
              <Plus className="w-3 h-3" /> Добави Реф
            </Button>
          </div>
          <div className="p-6 space-y-8 bg-white">
            
            <div>
              <Label>Референсни клипове (Опционално)</Label>
              <div className="space-y-4 mt-3">
                {brief.references.map((r, i) => (
                  <div key={r.id} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-1 rounded">Линк {i + 1}</span>
                       <button onClick={() => updateBrief({ references: brief.references.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white border border-slate-200 rounded-md">
                         <Trash2 className="w-3 h-3" />
                       </button>
                    </div>
                    <Input placeholder="URL към видео (TikTok, IG, YT...)" className="bg-white" value={r.link} onChange={e => {
                      const newRefs = [...brief.references];
                      newRefs[i].link = e.target.value;
                      updateBrief({ references: newRefs });
                    }} />
                    <Input placeholder="Защо го харесваш?" className="bg-white" value={r.reason} onChange={e => {
                      const newRefs = [...brief.references];
                      newRefs[i].reason = e.target.value;
                      updateBrief({ references: newRefs });
                    }} />
                  </div>
                ))}
                {brief.references.length === 0 && <p className="text-xs text-slate-400 italic p-4 bg-slate-50 border border-slate-100 border-dashed rounded-lg text-center">Няма добавени референции.</p>}
              </div>
            </div>

            <div>
              <Label>Задължителни послания</Label>
              <Textarea className="mt-2" value={brief.mandatoryMessages} onChange={e => updateBrief({ mandatoryMessages: e.target.value })} />
              <Helper>Пример: "Да споменем, че има безплатна доставка над 100лв."</Helper>
            </div>

             <div>
              <Label>Забрани — Какво да НЕ споменаваме</Label>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Без споменаване на конкуренти по име', 'Без цени във видеото', 'Без промо-код', 'Без споменаване на доставчика по име', 'Без политика', 'Без хумор за сметка на клиенти'].map(d => (
                   <Checkbox 
                    key={d} 
                    label={d} 
                    checked={brief.donts.includes(d)} 
                    onChange={(c) => {
                      const newDonts = c ? [...brief.donts, d] : brief.donts.filter(x => x !== d);
                      updateBrief({ donts: newDonts });
                    }} 
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                 <div className="sm:w-64">
                   <Checkbox 
                      label="Друго:" 
                      checked={brief.donts.includes('Друго')} 
                      onChange={(c) => {
                        const newDonts = c ? [...brief.donts, 'Друго'] : brief.donts.filter(x => x !== 'Друго');
                        updateBrief({ donts: newDonts });
                      }} 
                    />
                 </div>
                  {brief.donts.includes('Друго') && <Input className="flex-1" value={brief.otherDont} onChange={e => updateBrief({ otherDont: e.target.value })} placeholder="Опиши..." />}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              <div>
                <Label>Continuity (Свързаност)</Label>
                <div className="mt-3 flex flex-col gap-3">
                  {['Самостоятелни', 'Tematichen arc', 'Мини-сериал', 'Оставям на вас'].map(c => (
                    <Radio key={c} label={c} checked={brief.continuity === c} onChange={() => updateBrief({ continuity: c })} />
                  ))}
                </div>
              </div>
              <div>
                <Label>Специфичен CTA (Call to action)</Label>
                <div className="mt-3 flex flex-col gap-3">
                  {['Стандартен CTA', 'Ела в магазина', 'Поръчай от autokrasi.bg', 'Пиши в коментар', 'Тагни приятел'].map(c => (
                    <Radio key={c} label={c === 'Стандартен CTA' ? 'Стандартен' : `"${c}"`} checked={brief.cta === c} onChange={() => updateBrief({ cta: c })} />
                  ))}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Radio label="Друго" checked={brief.cta === 'Друго'} onChange={() => updateBrief({ cta: 'Друго' })} />
                    {brief.cta === 'Друго' && <Input className="flex-1" value={brief.otherCta} onChange={e => updateBrief({ otherCta: e.target.value })} placeholder="Опиши..." />}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Card>

        {/* BLOCK 5 & 6 */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <div className="p-6 border-b border-slate-100 bg-white">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">05</span>
                 📅 График
              </h2>
            </div>
            <div className="p-6 space-y-6 bg-white h-full">
               <div>
                <Label>Кога можеш да снимаш?</Label>
                <Input className="mt-2" value={brief.shootAvailability} onChange={e => updateBrief({ shootAvailability: e.target.value })} placeholder="Дни и часове..." />
              </div>
              <div>
                <Label>Специфични реквизити налични?</Label>
                <Input className="mt-2" value={brief.propsReq} onChange={e => updateBrief({ propsReq: e.target.value })} placeholder="Термометри, допълнителни коли..." />
              </div>
               <div>
                <Label>Предпочитана локация</Label>
                <div className="mt-3 flex flex-col gap-2">
                   {['В магазина', 'Пред магазина (отвън)', 'В/около кола', 'Терен', 'Смесено', 'Без предпочитание'].map(l => (
                    <Radio key={l} label={l} checked={brief.location === l} onChange={() => updateBrief({ location: l })} />
                   ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-blue-200 shadow-md shadow-blue-100">
            <div className="p-6 border-b border-blue-100 bg-blue-50/50">
              <h2 className="text-sm font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                 <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs shadow-sm">06</span>
                 🎁 Финално
              </h2>
            </div>
            <div className="p-6 bg-white h-full">
              <Label>Нещо, което пропуснахме?</Label>
              <Textarea className="mt-3 h-40 bg-slate-50" value={brief.anythingElse} onChange={e => updateBrief({ anythingElse: e.target.value })} placeholder="Странни ограничения, лични предпочитания..." />
              <Helper>Свободен текст. Всичко важно.</Helper>
            </div>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center justify-center py-10 border-t border-slate-200 mt-12 bg-white -mx-6 px-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-md justify-center">
            <Button onClick={handleDownload} variant="secondary" className="text-sm !px-6 !py-3">
              <Download className="w-4 h-4 mr-1" />
              Свали Markdown
            </Button>
            
            <Button 
              onClick={handleSaveToDatabase} 
              disabled={isSaving}
              className={`text-base !px-8 !py-3 shadow-xl transition-all ${
                saveStatus === 'success' 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50' 
                  : saveStatus === 'error'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200/50'
                    : 'shadow-blue-200/50 hover:-translate-y-0.5'
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mr-1" />
              ) : (
                <CloudUpload className="w-5 h-5 mr-1" />
              )}
              {isSaving ? 'Запазване...' : saveStatus === 'success' ? 'Запазено в базата!' : 'Запази в Базата Данни'}
            </Button>
          </div>
          
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold text-center">
            Ние правим техническото, ти даваш личния поглед.
          </p>
        </div>

      </main>
    </div>
  );
}


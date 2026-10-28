import React, { useState } from 'react';
import { BIMetrics, MESBatch, ComplaintRecord } from '../types/fsd';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Download, 
  MessageCircle, 
  Share2, 
  Filter,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface Module4BIEngineProps {
  metrics: BIMetrics;
  batches: MESBatch[];
  complaints: ComplaintRecord[];
}

export const Module4BIEngine: React.FC<Module4BIEngineProps> = ({
  metrics,
  batches,
  complaints,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'shopee' | 'dcard' | 'official'>('all');
  const [exportNotice, setExportNotice] = useState<boolean>(false);

  // Social feed mock items
  const socialReviews = [
    {
      id: 'soc-1',
      channel: '蝦皮旗艦店 (Shopee)',
      author: 'u***9',
      rating: 4,
      text: '羊毛襪穿起來超級保暖，不過腳後跟穿了一週有起一點點毛球。客服秒回送了50元折價券，很有誠意！',
      sentiment: 'positive',
      keywords: ['保暖吸汗', '腳後跟毛球', '客服秒補償50元'],
      date: '2026-04-22',
    },
    {
      id: 'soc-2',
      channel: 'Dcard 穿搭板',
      author: '匿名台大男同學',
      rating: 5,
      text: '他們家精梳棉運動襪耐磨度真的讚，洗了十次都沒起毛。掃出貨單 QR Code 照著反面洗滌教學洗真的有效！',
      sentiment: 'positive',
      keywords: ['反面洗滌教學實用', '保暖吸汗'],
      date: '2026-04-21',
    },
    {
      id: 'soc-3',
      channel: '官方旗艦商城',
      author: '王*宇',
      rating: 2,
      text: '買了美麗諾羊毛健行襪，搭配我的粗皮登山靴，後腳跟洗幾次起毛有點明顯。',
      sentiment: 'negative',
      keywords: ['洗幾次起毛', '粗糙球鞋後跟'],
      date: '2026-04-20',
    },
    {
      id: 'soc-4',
      channel: 'FB 戶外裝備交流社團',
      author: '登山老手 Mark',
      rating: 5,
      text: '天然純羊毛本來遇到摩擦就會有短纖毛羽，這是正常物理特性。反面洗加洗衣袋就改善很多了，讚賞品牌清楚標示 Martindale 耐磨轉數！',
      sentiment: 'positive',
      keywords: ['反面洗滌教學實用', '保暖吸汗'],
      date: '2026-04-18',
    },
  ];

  const filteredReviews = selectedChannel === 'all'
    ? socialReviews
    : socialReviews.filter((r) => {
        if (selectedChannel === 'shopee') return r.channel.includes('Shopee');
        if (selectedChannel === 'dcard') return r.channel.includes('Dcard');
        return r.channel.includes('官方');
      });

  // Export full audit data as CSV
  const handleExportCSV = () => {
    const headers = ['ComplaintID', 'OrderID', 'SKU', 'Customer', 'BatchID', 'Grade', 'Confidence', 'Status', 'Voucher', 'Timestamp'];
    const rows = complaints.map((c) => [
      c.id,
      c.orderId,
      c.sku,
      `"${c.customerName}"`,
      c.batchId,
      c.pillingGrade,
      `${c.confidence}%`,
      c.status,
      c.voucherCode,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KNTL_Pilling_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-2">
            <span>功能規格 BI-01 ~ BI-02</span>
            <span aria-hidden="true">·</span>
            <span>營運數據大腦與負評預警 (BI & Social Listening)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            全通路輿情監控與品質客服 ROI 看板
          </h1>
          <p className="mt-2 text-stone-600 max-w-3xl text-sm sm:text-base leading-relaxed">
            運用 NLP 語意分析即時辨識 Shopee、Dcard 等社群評價中的起毛關鍵字與情感極性，全面掌握客服免寄回即時補償帶來的處理時長縮減、逆物流成本節省與顧客回購躍升。
          </p>
        </div>

        {/* CSV Export Action Button */}
        <div className="shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>匯出稽核報表 (CSV)</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>報表已成功產出並下載！已包含所有客訴批次關聯、AI 評定等級與補償明細。</span>
        </div>
      )}

      {/* BI-02: 品保與客服 ROI 營運看板 (4 Key Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>全廠綜合起毛客訴率</span>
            <TrendingUp className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {metrics.globalComplaintRate}%
          </div>
          <div className="text-xs text-stone-500">
            總出貨量 {metrics.totalShippedAll.toLocaleString()} 雙 / 客訴 {metrics.totalComplaintsAll} 件
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>平均客訴處理時長 (AHT)</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
            2.4 秒
          </div>
          <div className="text-xs text-emerald-700 font-medium">
            相較傳統人工 48h 審核，縮減 99.9%
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>免寄回節省逆物流運費</span>
            <DollarSign className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            NT$ {metrics.totalSavedReturnShippingCost.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500">
            每件省下 NT$80 來回物流與拆包檢驗成本
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>客訴賠付後回購率 (Retention)</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {metrics.repurchaseRetentionRate}
          </div>
          <div className="text-xs text-stone-500">
            秒核發 $50 購物金轉化為下次購買客單
          </div>
        </div>
      </div>

      {/* Main Grid: NLP Social Listening on Left, Keywords on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: BI-01 Cross-Platform Sentiment & Comments */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span>規格編號 BI-01</span>
                  <span aria-hidden="true">·</span>
                  <span>全通路聲量 NLP 情感分析</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  即時輿情串流與情感極性
                </h3>
              </div>

              {/* Channel Filter Buttons */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
                {[
                  { id: 'all', label: '全部通路' },
                  { id: 'shopee', label: '蝦皮' },
                  { id: 'dcard', label: 'Dcard' },
                  { id: 'official', label: '官網' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id as any)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      selectedChannel === ch.id
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentiment Polarity Ratio Bar */}
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-100 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>情感極性分佈</span>
                <span className="font-mono text-stone-500">
                  正面 {metrics.sentimentIndex.positive}% · 中立 {metrics.sentimentIndex.neutral}% · 負面 {metrics.sentimentIndex.negative}%
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex bg-stone-200">
                <div
                  style={{ width: `${metrics.sentimentIndex.positive}%` }}
                  className="bg-emerald-600"
                  title="正面評價"
                />
                <div
                  style={{ width: `${metrics.sentimentIndex.neutral}%` }}
                  className="bg-stone-400"
                  title="中立反饋"
                />
                <div
                  style={{ width: `${metrics.sentimentIndex.negative}%` }}
                  className="bg-rose-500"
                  title="起毛負評"
                />
              </div>
            </div>

            {/* Live Social Comment Stream */}
            <div className="space-y-3">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-lg border border-stone-200/90 bg-[#FAF8F5] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800">{rev.channel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.author}</span>
                    </div>
                    <span className="font-mono text-[11px]">{rev.date}</span>
                  </div>

                  <p className="text-stone-800 text-xs sm:text-sm leading-relaxed">
                    {rev.text}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {rev.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-stone-600 bg-white border border-stone-200 px-2 py-0.5 rounded"
                      >
                        #{kw}
                      </span>
                    ))}
                    <span
                      className={`ml-auto text-[11px] font-semibold ${
                        rev.sentiment === 'positive'
                          ? 'text-emerald-700'
                          : rev.sentiment === 'negative'
                          ? 'text-rose-600'
                          : 'text-stone-500'
                      }`}
                    >
                      {rev.sentiment === 'positive' ? '正面讚許' : '起毛負面預警'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Keyword Frequency & ROI Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Keyword Frequency Cloud & Heatmap */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span>規格編號 BI-01</span>
                <span aria-hidden="true">·</span>
                <span>起毛核心字詞分析</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-1">
                熱門關鍵字聲量榜
              </h3>
            </div>

            <div className="space-y-2.5">
              {metrics.topKeywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono font-bold text-stone-400">
                      0{idx + 1}
                    </span>
                    <span className="font-medium text-stone-800">{kw.word}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] ${
                        kw.sentiment === 'positive'
                          ? 'text-emerald-700'
                          : kw.sentiment === 'negative'
                          ? 'text-rose-600'
                          : 'text-stone-500'
                      }`}
                    >
                      {kw.sentiment === 'positive' ? '正向' : kw.sentiment === 'negative' ? '負向' : '中立'}
                    </span>
                    <span className="font-mono font-bold text-stone-900 tabular-nums">
                      {kw.count} 則
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departmental ROI Comparison */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              跨部門起毛治理 ROI 效益評估
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900">前端體驗透明化效益 (FE-01 ~ FE-03)</div>
                <div className="text-stone-600">
                  Martindale 數位標籤與情境推薦使顧客選購錯誤鞋款的機率降低 <strong>46%</strong>，減少因預期落差造成的糾紛。
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900">AI 客服與免寄回秒賠償 (CS-01 ~ CS-03)</div>
                <div className="text-stone-600">
                  取消實體退貨寄回，客訴處理成本降低 <strong>82%</strong>，客戶 NPS 滿意度自 64 分提升至 89 分。
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900">MES 批次即時追溯 (QA-01 ~ QA-03)</div>
                <div className="text-stone-600">
                  將機台張力偏鬆問題鎖定在首批 142 件客訴內，即時攔截該批其餘 4,000 雙未出貨庫存，避免超過 120 萬潛在損失。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

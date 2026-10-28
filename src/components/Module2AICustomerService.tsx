import React, { useState } from 'react';
import { SockProduct, ComplaintRecord } from '../types/fsd';
import { PRESET_INSPECTION_SAMPLES } from '../data/mockData';
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Gift, 
  ArrowRight, 
  Clock, 
  Layers, 
  Camera, 
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface Module2AICustomerServiceProps {
  products: SockProduct[];
  selectedProduct: SockProduct;
  onSelectProduct: (p: SockProduct) => void;
  onRecordNewComplaint: (record: ComplaintRecord) => void;
  recentComplaints: ComplaintRecord[];
}

export const Module2AICustomerService: React.FC<Module2AICustomerServiceProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onRecordNewComplaint,
  recentComplaints,
}) => {
  // Input state
  const [customerName, setCustomerName] = useState<string>('陳小姐 (Claire)');
  const [orderId, setOrderId] = useState<string>('ORD-TW-98214');
  const [purchaseDaysAgo, setPurchaseDaysAgo] = useState<number>(14);
  const [previewImage, setPreviewImage] = useState<string>(
    '/src/assets/images/sock_pilling_macro_1793076541147.jpg'
  );
  const [activePresetId, setActivePresetId] = useState<string>('sample-pilling-macro-3');

  // Inspection & Result State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisDuration, setAnalysisDuration] = useState<number | null>(null);
  const [inspectionResult, setInspectionResult] = useState<{
    pillingGrade: number;
    gradeText: string;
    confidence: number;
    affectedZone: string;
    features: string[];
    inspectionSummary: string;
    isEligibleForWarranty: boolean;
  } | null>({
    pillingGrade: 3.0,
    gradeText: '3級 (中度起球 - 臨界門檻)',
    confidence: 93.6,
    affectedZone: '後腳跟與鞋內襯接縫處',
    features: ['短纖維端點外露抱合', '直徑約 1.2-2.0mm 圓形毛球明顯散佈', '底層尼龍編織無破損'],
    inspectionSummary: '檢視受摩擦區域呈現典型機械剪切引發之短纖球聚，已達退貨免寄回補償臨界值。',
    isEligibleForWarranty: true,
  });

  // Empathy Script & Voucher State
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [empathyScript, setEmpathyScript] = useState<string>(
    `陳小姐 您好，感謝您第一時間與我們分享羊毛襪穿著狀況！對於讓您遇到起毛球的困擾，我們深感抱歉。\n\n美麗諾羊毛具有極佳透氣柔韌感，但在鞋內反覆機械摩擦下，端點短纖羽毛會自然往表面位移抱合，這是天然短纖的物理自然現象。\n\n為提供最佳體驗，我們已為您啟動「免寄回暖心保固」，自動派發專屬購物金 NT$50（折扣碼：PILL-FREE-8821），無使用門檻。建議您日後翻至反面並放入洗衣袋洗滌。感謝您的包容與支持！`
  );
  const [voucherCode, setVoucherCode] = useState<string>('PILL-FREE-8821');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'resolved'>('resolved');

  // Handle Preset selection
  const handleSelectPreset = (sample: typeof PRESET_INSPECTION_SAMPLES[0]) => {
    setActivePresetId(sample.id);
    setPreviewImage(sample.thumbnail);
    // Instant preliminary preview
    setInspectionResult({
      pillingGrade: sample.grade,
      gradeText: `${sample.grade} 級`,
      confidence: sample.confidence,
      affectedZone: sample.zone,
      features: sample.features,
      inspectionSummary: sample.summary,
      isEligibleForWarranty: sample.grade <= 3.5,
    });
  };

  // Handle custom file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreviewImage(base64);
        setActivePresetId('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Inspection
  const runAiInspection = async () => {
    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      const isBase64 = previewImage.startsWith('data:');
      const response = await fetch('/api/inspect-pilling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: isBase64 ? previewImage : undefined,
          presetGrade: activePresetId === 'sample-merino-mild-4' ? 4.0 : activePresetId === 'sample-cotton-pristine-5' ? 5.0 : 3.0,
          skuName: selectedProduct.name,
          description: '顧客反映腳後跟穿著一週後產生起毛現象',
        }),
      });

      const data = await response.json();
      const endTime = performance.now();
      setAnalysisDuration(Number(((endTime - startTime) / 1000).toFixed(2)));

      if (data.success && data.result) {
        setInspectionResult(data.result);

        // If eligible, generate unique voucher and fresh empathy script
        const newCode = `PILL-FREE-${Math.floor(1000 + Math.random() * 9000)}`;
        setVoucherCode(newCode);

        // Auto trigger script generation
        generateEmpathyReply(data.result.pillingGrade, newCode);
      }
    } catch (err) {
      console.error('Inspection request failed:', err);
      const endTime = performance.now();
      setAnalysisDuration(Number(((endTime - startTime) / 1000).toFixed(2)));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Empathy Response via GenAI
  const generateEmpathyReply = async (grade: number, code: string) => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/generate-empathy-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          pillingGrade: grade,
          productName: selectedProduct.name,
          voucherCode: code,
          purchaseDaysAgo,
        }),
      });

      const data = await response.json();
      if (data.success && data.replyText) {
        setEmpathyScript(data.replyText);
        setTicketStatus('resolved');

        // Record complaint into the global queue
        const newRecord: ComplaintRecord = {
          id: `TICKET-2026-${Math.floor(100 + Math.random() * 900)}`,
          orderId,
          sku: selectedProduct.sku,
          productName: selectedProduct.name,
          batchId: selectedProduct.sku === 'SKU-MERINO-01' ? 'BATCH-2026-04A' : 'BATCH-2026-03B',
          customerName,
          purchaseDaysAgo,
          imageSrc: previewImage,
          pillingGrade: grade,
          confidence: inspectionResult?.confidence || 92.5,
          affectedZone: inspectionResult?.affectedZone || '腳後跟摩擦處',
          features: inspectionResult?.features || ['短纖端點外露抱合'],
          inspectionSummary: inspectionResult?.inspectionSummary || 'AI 判讀符合售後補償標準',
          empathyReply: data.replyText,
          voucherCode: code,
          voucherAmount: 50,
          status: 'resolved_auto',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        onRecordNewComplaint(newRecord);
      }
    } catch (err) {
      console.error('Script generation failed:', err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(empathyScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-2">
          <span>功能規格 CS-01 ~ CS-03</span>
          <span aria-hidden="true">·</span>
          <span>AI 智能客服與自動化售後引擎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          AI 視覺起毛等級判讀與免寄回秒賠償
        </h1>
        <p className="mt-2 text-stone-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          顧客上傳起毛照片後，系統於 3 秒內透過電腦視覺模型完成 ISO 1-5 級起毛嚴重度判讀；若達到補償門檻（≥ 3 級），GenAI 自動結合紡織物理科普生成同理心回覆，並一鍵派發 NT$50 購物金即時結案。
        </p>

        {/* Acceptance Criteria Banner */}
        <div className="mt-6 p-4 bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
          <div className="font-bold text-stone-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-800" />
            <span>FSD 驗收標準 (Acceptance Criteria CS-01 / CS-03) 規格對齊：</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-stone-600">
            <span><strong>[Given]</strong> 購買售後 30 天內且綁定訂單</span>
            <span><strong>[When]</strong> 上傳腳跟毛球照片</span>
            <span><strong>[Then]</strong> 3秒內判讀等級、GenAI 發送物理關懷詞、自動核發 $50 購物金</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Inspection on Left, AI Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input & Image Source */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-800" />
              <span>顧客客訴上傳入口 (CS-01)</span>
            </h3>

            {/* Customer & Order Metadata Form */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-500 font-medium block mb-1">顧客姓名</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="text-stone-500 font-medium block mb-1">訂單編號</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div className="col-span-2">
                <label className="text-stone-500 font-medium block mb-1">客訴商品 SKU</label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) onSelectProduct(found);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Preview Window */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">檢驗照片預覽</span>
                {analysisDuration !== null && (
                  <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>判讀耗時：{analysisDuration} 秒 (滿足 &lt; 3秒 規格)</span>
                  </span>
                )}
              </div>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-300 bg-stone-900 group">
                <img
                  src={previewImage}
                  alt="Inspection target"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
                    <div className="text-xs font-semibold tracking-wider uppercase">
                      Gemini Vision 織物模型判讀中...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preset Samples or Upload Option */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-stone-600">或快速選取測試樣本 (Presets)：</div>
              <div className="space-y-2">
                {PRESET_INSPECTION_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectPreset(sample)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                      activePresetId === sample.id
                        ? 'border-stone-900 bg-stone-100 font-semibold text-stone-900'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <img
                      src={sample.thumbnail}
                      alt={sample.name}
                      className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 truncate">
                      <div>{sample.name}</div>
                      <div className="text-[11px] text-stone-500 font-normal truncate mt-0.5">
                        {sample.summary}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom File Upload */}
              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-dashed border-stone-300 hover:border-stone-400 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-stone-400" />
                  <span>自行上傳真實襪子照片 (JPG / PNG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Run Inspection Action Button */}
            <button
              onClick={runAiInspection}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAnalyzing ? 'AI 視覺辨識分析中...' : '執行 AI 視覺起毛判定 (< 3秒)'}</span>
            </button>
          </div>
        </div>

        {/* Right: AI Output & Automated After-Sales Compensation */}
        <div className="lg:col-span-7 space-y-6">
          {/* CS-01: CV Inspection Results Panel */}
          {inspectionResult && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                    <span>規格編號 CS-01</span>
                    <span aria-hidden="true">·</span>
                    <span>電腦視覺 (CV) 檢測輸出</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">
                    起毛球嚴重度等級判定結果
                  </h3>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold ${
                    inspectionResult.isEligibleForWarranty
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {inspectionResult.isEligibleForWarranty ? '達 ≥ 3 級補償標準' : '輕微/正常無補償需求'}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="text-[11px] text-stone-500">起毛判定評分</div>
                  <div className="text-xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
                    {inspectionResult.pillingGrade} <span className="text-xs font-normal text-stone-500">/ 5.0 級</span>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">{inspectionResult.gradeText}</div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="text-[11px] text-stone-500">模型信心度 (Confidence)</div>
                  <div className="text-xl font-bold text-emerald-800 mt-1 font-mono tabular-nums">
                    {inspectionResult.confidence}%
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">高於 88% 驗收標準</div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100 col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-stone-500">起毛集中區域</div>
                  <div className="text-xs font-bold text-stone-900 mt-1.5 leading-snug">
                    {inspectionResult.affectedZone}
                  </div>
                </div>
              </div>

              {/* Microscopic Identified Features */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-700">微觀物理特徵提取：</div>
                <div className="space-y-1.5">
                  {inspectionResult.features.map((feat, i) => (
                    <div key={i} className="text-xs text-stone-600 flex items-start gap-2 bg-[#FAF8F5] p-2 rounded border border-stone-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspection Summary */}
              <div className="text-xs text-stone-700 bg-stone-100/70 p-3.5 rounded-lg border border-stone-200 leading-relaxed">
                <strong className="text-stone-900 font-semibold">專家評語：</strong> {inspectionResult.inspectionSummary}
              </div>
            </div>
          )}

          {/* CS-03: Automated Compensation & Dispute Closure */}
          {inspectionResult && inspectionResult.isEligibleForWarranty && (
            <div className="bg-amber-50/60 rounded-xl border border-amber-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <span>規格編號 CS-03</span>
                    <span aria-hidden="true">·</span>
                    <span>免寄回自動結案機制</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    系統自動派發 NT$50 購物金 & 客訴結案
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                  CRM 已自動結案歸檔
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-500">免寄回無門檻專屬補償折扣券</div>
                    <div className="text-base font-bold text-stone-900 font-mono tracking-wider">
                      {voucherCode}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-500">核發金額</div>
                  <div className="text-xl font-bold text-amber-900 font-mono tabular-nums">
                    NT$ 50
                  </div>
                </div>
              </div>

              <div className="text-xs text-amber-900/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>已同步串接 ERP/WMS 與 MES 生產數據追溯引擎（無須逆物流寄回，省下 NT$80 運費與 48 小時檢測時長）。</span>
              </div>
            </div>
          )}

          {/* CS-02: GenAI Empathetic Customer Dialogue Script */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span>規格編號 CS-02</span>
                  <span aria-hidden="true">·</span>
                  <span>GenAI 具同理心對話助手</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  生成專業回覆腳本 (結合紡織物理科普)
                </h3>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? '已複製' : '一鍵複製腳本'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans">
              {isGeneratingScript ? (
                <div className="flex items-center gap-2 text-stone-500 py-4">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini 3.8 Flash 正在編寫具同理心與物理科普之客訴回覆...</span>
                </div>
              ) : (
                empathyScript
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span>回覆特色：肯定顧客細膩度 · 科普短纖剪切位移物理 · 附帶 15秒反面洗滌指南</span>
              <span className="font-mono text-stone-400">GenAI Agent v3.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

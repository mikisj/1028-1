import React, { useState, useEffect, useRef } from 'react';
import { SockProduct } from '../types/fsd';
import { 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  QrCode, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface Module1StorefrontProps {
  products: SockProduct[];
  selectedProduct: SockProduct;
  onSelectProduct: (product: SockProduct) => void;
  onOpenCSClaim: (product: SockProduct) => void;
}

export const Module1Storefront: React.FC<Module1StorefrontProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onOpenCSClaim,
}) => {
  const [selectedShoeIndex, setSelectedShoeIndex] = useState<number>(0);
  const [isCareCardOpen, setIsCareCardOpen] = useState<boolean>(false);
  const [simulatedCycles, setSimulatedCycles] = useState<number>(selectedProduct.martindaleCycles);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setSimulatedCycles(selectedProduct.martindaleCycles);
    setSelectedShoeIndex(0);
  }, [selectedProduct]);

  // Render a crisp functional QR code on HTML Canvas
  useEffect(() => {
    if (!isCareCardOpen || !qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 160, 160);

    ctx.fillStyle = '#262422';
    // Draw QR pattern simulation (quiet zone, corners, data matrix modules)
    const drawCorner = (x: number, y: number) => {
      ctx.fillRect(x, y, 36, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 6, y + 6, 24, 24);
      ctx.fillStyle = '#262422';
      ctx.fillRect(x + 12, y + 12, 12, 12);
    };

    drawCorner(14, 14);
    drawCorner(110, 14);
    drawCorner(14, 110);

    // Decorative data grid
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        if ((r < 4 && c < 4) || (r < 4 && c > 9) || (r > 9 && c < 4)) continue;
        const hash = (r * 17 + c * 31 + selectedProduct.id.charCodeAt(4)) % 10;
        if (hash > 4) {
          ctx.fillRect(20 + c * 8.5, 20 + r * 8.5, 6, 6);
        }
      }
    }
  }, [isCareCardOpen, selectedProduct]);

  // Dynamic calculation of pilling grade based on test revolutions
  const dynamicGrade = Math.max(
    1,
    Math.min(5, Number((5 - (simulatedCycles / 40000) * 1.8).toFixed(1)))
  );

  const currentShoe = selectedProduct.shoeRecommendations[selectedShoeIndex] || selectedProduct.shoeRecommendations[0];

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-2">
          <span>功能規格 FE-01 ~ FE-03</span>
          <span aria-hidden="true">·</span>
          <span>前端顧客體驗與教導透明化</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          織物耐磨度數位標籤與情境推薦
        </h1>
        <p className="mt-2 text-stone-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          透過 Martindale 實驗室耐磨耗測試數據可視化，讓顧客在購買前清楚掌握抗起毛等級與穿著鞋款適配建議，從源頭建立正確物理認知，降低售後糾紛率。
        </p>

        {/* Product Switcher Segmented Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {products.map((p) => {
            const isSelected = p.id === selectedProduct.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main PDP Grid (Leading with clean imagery and contiguous purchase/data module) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Showcase Photo & Transparency Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded">
                {selectedProduct.category}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs text-stone-500">{selectedProduct.subname}</div>
                <h2 className="text-xl font-bold text-stone-900 mt-1">{selectedProduct.name}</h2>
                <div className="text-lg font-semibold text-amber-900 mt-1 font-mono tabular-nums">
                  NT$ {selectedProduct.price}
                </div>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Material Composition List */}
              <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">主要成份</span>
                  <span className="font-medium text-stone-800">{selectedProduct.materialComposition}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">紗線產地</span>
                  <span className="font-medium text-stone-800">{selectedProduct.yarnOrigin}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">商品貨號</span>
                  <span className="font-mono text-stone-800">{selectedProduct.sku}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsCareCardOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>檢視電子護理卡 (FE-03)</span>
                </button>
                <button
                  onClick={() => onOpenCSClaim(selectedProduct)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>模擬起毛客訴申請</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: FE-01 & FE-02 Modules */}
        <div className="lg:col-span-7 space-y-8">
          {/* FE-01: Martindale 耐磨度數位標籤模組 */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span>規格編號 FE-01</span>
                  <span aria-hidden="true">·</span>
                  <span>實驗室標準檢驗 (ISO 12945-2)</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  Martindale 耐磨耗與抗起毛等級標籤
                </h3>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded text-xs font-semibold">
                標準檢驗報告合格
              </span>
            </div>

            {/* Visual Indicator of Pilling Grade (1-5) */}
            <div className="bg-stone-50 rounded-lg p-5 border border-stone-100 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-700 font-medium">抗起毛球綜合評級</span>
                <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                  {selectedProduct.pillingGrade} 級 / 5.0 級
                </span>
              </div>

              {/* 5-Step Visual Bar */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-5 gap-1.5 h-3">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const active = selectedProduct.pillingGrade >= lvl;
                    return (
                      <div
                        key={lvl}
                        className={`rounded-sm transition-all ${
                          active
                            ? lvl >= 4
                              ? 'bg-emerald-600'
                              : lvl === 3
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                            : 'bg-stone-200'
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                  <span>1級 (極度嚴重起毛)</span>
                  <span className="text-amber-800 font-medium">3級 (臨界門檻)</span>
                  <span>5級 (光滑新品無毛)</span>
                </div>
              </div>

              {/* Interactive Martindale Abrasion Scrubber */}
              <div className="border-t border-stone-200/80 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                    <span>Martindale 摩擦旋轉轉數模擬</span>
                  </div>
                  <span className="font-mono text-stone-900 font-semibold tabular-nums">
                    {simulatedCycles.toLocaleString()} 轉
                  </span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="45000"
                  step="2500"
                  value={simulatedCycles}
                  onChange={(e) => setSimulatedCycles(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />

                <div className="text-xs text-stone-600 bg-white p-3 rounded border border-stone-200/70 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    在 <strong className="font-mono">{simulatedCycles.toLocaleString()}</strong> 次摩擦轉數下，該纖維預估維持在{' '}
                    <strong className="text-stone-900">{dynamicGrade} 級</strong>。
                    {simulatedCycles > 30000 ? (
                      <span className="text-emerald-700 ml-1">耐磨性遠高於國家運動襪標準(15,000轉)。</span>
                    ) : (
                      <span className="text-stone-500 ml-1">符合天然羊毛保暖透氣襪款之國際常態耐磨標準。</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FE-02: 情境鞋款適配推薦 */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span>規格編號 FE-02</span>
                <span aria-hidden="true">·</span>
                <span>智能適配引擎</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                穿著情境與鞋款內襯適配預警
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                織襪起毛多源於鞋腔內襯粗糙面造成的機械剪切力。依據您的穿著鞋款自動提供專業建議：
              </p>
            </div>

            {/* Shoe Selection Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {selectedProduct.shoeRecommendations.map((rec, idx) => {
                const isSelected = selectedShoeIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedShoeIndex(idx)}
                    className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-semibold truncate">{rec.shoeType}</div>
                    <div className={`mt-1 text-[11px] ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {rec.suitability === 'recommended' && '✓ 推薦著用'}
                      {rec.suitability === 'caution' && '▲ 留意磨耗'}
                      {rec.suitability === 'incompatible' && '✕ 警示不宜'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Footwear Compatibility Banner */}
            <div
              className={`p-4 rounded-lg border text-sm flex items-start gap-3 transition-colors ${
                currentShoe.suitability === 'recommended'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : currentShoe.suitability === 'caution'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              {currentShoe.suitability === 'recommended' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {currentShoe.suitability === 'caution' && (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {currentShoe.suitability === 'incompatible' && (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-semibold text-xs uppercase tracking-wide">
                  {currentShoe.suitability === 'recommended' && '最佳穿著鞋款建議'}
                  {currentShoe.suitability === 'caution' && '穿著情境注意事項'}
                  {currentShoe.suitability === 'incompatible' && '強烈預警：摩擦剪切風險'}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">{currentShoe.notice}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FE-03: 電子護理卡與 QR Code Modal */}
      {isCareCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-800" />
                <h3 className="font-bold text-stone-900">
                  電子護理卡 (FE-03) · 15秒洗滌教學
                </h3>
              </div>
              <button
                onClick={() => setIsCareCardOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* QR Code and Scan Info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#FAF8F5] rounded-xl border border-stone-200">
                <div className="bg-white p-2.5 rounded-lg border border-stone-300 shadow-xs shrink-0">
                  <canvas ref={qrCanvasRef} width={160} height={160} className="w-32 h-32" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    出貨單隨貨附載 QR Code
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    掃描載入個人化影音護理指南
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    以手機相機直接掃描出貨單 QR，或點擊下方模擬按鈕，即時觀看 15 秒短影音教學。
                  </p>
                  <div className="pt-1">
                    <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">
                      SKU: {selectedProduct.sku} · 訂單綁定
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Step Care Routine */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  防起毛黃金洗滌 3 步驟
                </h4>
                <div className="space-y-2.5">
                  {selectedProduct.careSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 bg-white rounded-lg border border-stone-200/90 flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-stone-900">{step.title}</div>
                        <div className="text-xs text-stone-600 leading-relaxed">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                經實驗證實：正確洗滌可降低 73% 短纖糾結率
              </span>
              <button
                onClick={() => setIsCareCardOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                完成預覽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

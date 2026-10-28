import React, { useState, useEffect } from 'react';
import { MESBatch, ComplaintRecord } from '../types/fsd';
import { 
  Factory, 
  AlertOctagon, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Activity, 
  Sliders, 
  ArrowUpRight, 
  ShieldAlert,
  Search,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';

interface Module3TraceabilityProps {
  batches: MESBatch[];
  onToggleQuarantine: (batchId: string) => void;
  recentComplaints: ComplaintRecord[];
}

export const Module3Traceability: React.FC<Module3TraceabilityProps> = ({
  batches,
  onToggleQuarantine,
  recentComplaints,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.batchId || 'BATCH-2026-04A');
  const [thresholdRate, setThresholdRate] = useState<number>(3.0);
  const [aoiScanning, setAoiScanning] = useState<boolean>(true);
  const [scanOffset, setScanOffset] = useState<number>(0);
  const [inspectionCount, setInspectionCount] = useState<number>(1420);
  const [detectedDefects, setDetectedDefects] = useState<number>(18);

  // Active batch
  const currentBatch = batches.find((b) => b.batchId === selectedBatchId) || batches[0];

  // AOI Laser Scanning Animation Loop
  useEffect(() => {
    let animId: number;
    const interval = setInterval(() => {
      setScanOffset((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 60);

    const countInterval = setInterval(() => {
      if (aoiScanning) {
        setInspectionCount((prev) => prev + 1);
        if (Math.random() < 0.08) {
          setDetectedDefects((prev) => prev + 1);
        }
      }
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(countInterval);
    };
  }, [aoiScanning]);

  // Is batch exceeding quarantine threshold?
  const isExceedingThreshold = currentBatch ? currentBatch.complaintRate >= thresholdRate : false;

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-2">
          <span>功能規格 QA-01 ~ QA-03</span>
          <span aria-hidden="true">·</span>
          <span>AI 影像品檢與供應鏈品質溯源 (AOI + MES 整合)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          產線 AOI 瑕疵辨識與客訴批次根因追溯
        </h1>
        <p className="mt-2 text-stone-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          抽檢端結合 AOI 工業相機即時捕捉微觀毛羽瑕疵；前端客訴單透過條碼自動對齊 ERP/MES，一秒鎖定紗線批號與織造機台張力設定，客訴率超過 3% 立即啟動庫存凍結防護。
        </p>

        {/* Batch Selector Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-2">檢視生產批號：</span>
          {batches.map((batch) => {
            const isSelected = batch.batchId === selectedBatchId;
            const isQuarantined = batch.quarantineStatus === 'quarantined';
            return (
              <button
                key={batch.batchId}
                onClick={() => setSelectedBatchId(batch.batchId)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="font-mono">{batch.batchId}</span>
                {isQuarantined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">
                    庫存已凍結
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: QA-01 Left, QA-02 & QA-03 Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QA-01 AOI Factory Inspection Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span>規格編號 QA-01</span>
                  <span aria-hidden="true">·</span>
                  <span>生產抽檢端 AOI 工業相機</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  織物表面即時光學瑕疵檢測
                </h3>
              </div>

              <button
                onClick={() => setAoiScanning(!aoiScanning)}
                className={`px-2.5 py-1 text-xs font-medium rounded border cursor-pointer ${
                  aoiScanning
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-stone-100 text-stone-600 border-stone-300'
                }`}
              >
                {aoiScanning ? '● 串流檢測中' : '❚❚ 檢測暫停'}
              </button>
            </div>

            {/* Industrial Camera Canvas Simulation */}
            <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-800 bg-stone-950 group">
              <img
                src="/src/assets/images/sock_pilling_macro_1793076541147.jpg"
                alt="AOI Camera Frame"
                className="w-full h-full object-cover filter contrast-110 brightness-90"
                referrerPolicy="no-referrer"
              />

              {/* Scanning Laser Line */}
              {aoiScanning && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] pointer-events-none transition-all duration-75"
                  style={{ top: `${scanOffset}%` }}
                />
              )}

              {/* Simulated Defect Bounding Boxes */}
              <div className="absolute top-[35%] left-[28%] w-24 h-16 border-2 border-rose-500/90 bg-rose-500/10 pointer-events-none animate-pulse">
                <span className="absolute -top-5 left-0 text-[10px] bg-rose-600 text-white font-mono px-1 py-0.5 rounded font-bold">
                  DEFECT: 短纖拉扯 [x:142, y:88]
                </span>
              </div>

              <div className="absolute top-[60%] left-[55%] w-18 h-14 border border-amber-400/90 bg-amber-400/10 pointer-events-none">
                <span className="absolute -top-5 left-0 text-[10px] bg-amber-600 text-white font-mono px-1 py-0.5 rounded">
                  WARNING: 纖維浮毛
                </span>
              </div>

              {/* Camera Telemetry Overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[11px] font-mono text-cyan-400 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded">
                <span>CAM-02 · RES: 2560x1440 · 60 FPS</span>
                <span>STATUS: NG DETECTED</span>
              </div>
            </div>

            {/* AOI Inspection Real-Time Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-stone-500 text-[11px]">即時掃描支數</div>
                <div className="text-base font-bold text-stone-900 font-mono mt-0.5 tabular-nums">
                  {inspectionCount.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-stone-500 text-[11px]">攔截異常數</div>
                <div className="text-base font-bold text-rose-800 font-mono mt-0.5 tabular-nums">
                  {detectedDefects}
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-stone-500 text-[11px]">抽檢不良率</div>
                <div className="text-base font-bold text-stone-900 font-mono mt-0.5 tabular-nums">
                  {((detectedDefects / inspectionCount) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QA-02 Traceability & QA-03 Automated Quarantine */}
        <div className="lg:col-span-7 space-y-6">
          {/* QA-03: 異常批次自動攔截 (Threshold Alert Banner) */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span>規格編號 QA-03</span>
                  <span aria-hidden="true">·</span>
                  <span>自動化庫存攔截機制</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  批次客訴率預警與 WMS 庫存凍結
                </h3>
              </div>

              {/* Threshold Adjuster */}
              <div className="flex items-center gap-2 text-xs bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                <span className="text-stone-600 font-medium">客訴率警戒閾值：</span>
                <span className="font-mono font-bold text-amber-900">{thresholdRate.toFixed(1)}%</span>
              </div>
            </div>

            {/* Quarantine Status Notice */}
            {currentBatch.quarantineStatus === 'quarantined' ? (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    <span>【已觸發庫存自動凍結】批次 {currentBatch.batchId} 達 {currentBatch.complaintRate}% (超過 {thresholdRate}%)</span>
                  </div>
                  <button
                    onClick={() => onToggleQuarantine(currentBatch.batchId)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>解除凍結</span>
                  </button>
                </div>
                <p className="text-xs text-rose-800/90 leading-relaxed">
                  系統已自動透過 API 向 ERP/WMS 倉儲系統下達「停止揀貨出庫」指令，並同步通報紡織廠品管課與機台工程師進行張力參數複校。
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>批次 {currentBatch.batchId} 客訴率為 {currentBatch.complaintRate}%（低於 {thresholdRate}% 警戒線），出貨運行正常。</span>
                </div>
                <button
                  onClick={() => onToggleQuarantine(currentBatch.batchId)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>手動凍結</span>
                </button>
              </div>
            )}
          </div>

          {/* QA-02: 客訴與生產數據追溯引擎 */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span>規格編號 QA-02</span>
                <span aria-hidden="true">·</span>
                <span>客訴與生產數據追溯引擎 (ERP/MES)</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-1">
                批次根因關聯報告：紗線批號 · 機台號碼 · 紡織張力
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                前端客訴自動對齊生產履歷，直觀定位起毛異常之工藝根因：
              </p>
            </div>

            {/* Traceability Spec Details Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex justify-between items-center font-semibold text-stone-700">
                <span>MES 追溯核心參數</span>
                <span className="font-mono text-stone-500">Lot ID: {currentBatch.yarnLot}</span>
              </div>

              <div className="divide-y divide-stone-100 bg-white">
                <div className="grid grid-cols-3 px-4 py-2.5">
                  <span className="text-stone-500">對應商品與貨號</span>
                  <span className="col-span-2 font-medium text-stone-900">{currentBatch.productName} ({currentBatch.sku})</span>
                </div>

                <div className="grid grid-cols-3 px-4 py-2.5">
                  <span className="text-stone-500">紗線供應商與批號</span>
                  <span className="col-span-2 font-mono font-medium text-stone-900">
                    {currentBatch.yarnSupplier} · <strong className="text-amber-900">{currentBatch.yarnLot}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 px-4 py-2.5">
                  <span className="text-stone-500">織造機台號碼</span>
                  <span className="col-span-2 font-mono font-medium text-stone-900">
                    {currentBatch.machineId}
                  </span>
                </div>

                <div className="grid grid-cols-3 px-4 py-2.5">
                  <span className="text-stone-500">機台氣圈與圓編張力</span>
                  <span className="col-span-2 font-mono font-medium text-stone-900">
                    {currentBatch.cylinderTension}
                    {currentBatch.cylinderTension.includes('偏鬆') && (
                      <span className="ml-2 text-rose-600 font-normal">
                        ⚠ 根因診斷：張力不足導致短纖線圈未緊扣，穿著受摩擦時易位移脫出抱合！
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-3 px-4 py-2.5">
                  <span className="text-stone-500">出貨總數 / 客訴件數</span>
                  <span className="col-span-2 font-mono text-stone-900">
                    {currentBatch.totalShipped.toLocaleString()} 雙 /{' '}
                    <strong className={currentBatch.complaintRate >= 3.0 ? 'text-rose-600 font-bold' : ''}>
                      {currentBatch.complaintCount} 件 ({currentBatch.complaintRate}%)
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Connected Complaints Timeline */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-stone-700">最近關聯客訴單（即時串接 Module 2）：</div>
              <div className="space-y-2">
                {recentComplaints.slice(0, 3).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-semibold text-stone-900">
                        {comp.id} · {comp.customerName}
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        起毛評級：<strong className="text-stone-800">{comp.pillingGrade} 級</strong> · {comp.affectedZone}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        已派發 NT${comp.voucherAmount} 結案
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

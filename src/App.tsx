import React, { useState, useEffect } from 'react';
import { ActiveTab, SockProduct, MESBatch, ComplaintRecord, BIMetrics } from './types/fsd';
import { INITIAL_PRODUCTS, INITIAL_COMPLAINT_RECORDS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Module1Storefront } from './components/Module1Storefront';
import { Module2AICustomerService } from './components/Module2AICustomerService';
import { Module3Traceability } from './components/Module3Traceability';
import { Module4BIEngine } from './components/Module4BIEngine';
import { CheckCircle2, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('storefront');
  const [products] = useState<SockProduct[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<SockProduct>(INITIAL_PRODUCTS[0]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(INITIAL_COMPLAINT_RECORDS);

  // MES Batches Store
  const [batches, setBatches] = useState<MESBatch[]>([
    {
      batchId: 'BATCH-2026-04A',
      sku: 'SKU-MERINO-01',
      productName: '極輕量 美麗諾羊毛機能厚底襪',
      yarnSupplier: '紐西蘭精梳紡織 (Southern Wool Co.)',
      yarnLot: 'LOT-NZW-8821',
      machineId: 'KM-04 (Lonati 400針)',
      cylinderTension: '4.8 N (偏鬆，容差±0.2N)',
      spindleRpm: 280,
      productionDate: '2026-03-12',
      totalShipped: 4200,
      complaintCount: 142,
      complaintRate: 3.38,
      quarantineStatus: 'quarantined',
      lastUpdated: '2026-04-18',
    },
    {
      batchId: 'BATCH-2026-03B',
      sku: 'SKU-COTTON-02',
      productName: '全精梳棉 緩震無痕運動中筒襪',
      yarnSupplier: '遠東精密紡織 (Far Eastern Yarn)',
      yarnLot: 'LOT-FEC-3304',
      machineId: 'KM-02 (Santoni 200針)',
      cylinderTension: '5.2 N (標準)',
      spindleRpm: 320,
      productionDate: '2026-03-28',
      totalShipped: 6500,
      complaintCount: 52,
      complaintRate: 0.80,
      quarantineStatus: 'normal',
      lastUpdated: '2026-04-20',
    },
    {
      batchId: 'BATCH-2026-02C',
      sku: 'SKU-DRESS-03',
      productName: '絲光雙股精梳棉 頂級紳士正裝襪',
      yarnSupplier: '日本鐘紡 (Kanebo Mercerized)',
      yarnLot: 'LOT-JPM-9901',
      machineId: 'KM-08 (Nagata 240針)',
      cylinderTension: '5.5 N (高緊度)',
      spindleRpm: 240,
      productionDate: '2026-04-02',
      totalShipped: 3800,
      complaintCount: 19,
      complaintRate: 0.50,
      quarantineStatus: 'normal',
      lastUpdated: '2026-04-24',
    },
  ]);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Quarantine Status on a batch
  const handleToggleQuarantine = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.batchId === batchId) {
          const nextStatus = b.quarantineStatus === 'normal' ? 'quarantined' : 'normal';
          showToast(
            nextStatus === 'quarantined'
              ? `已手動對批次 ${batchId} 執行 WMS 庫存凍結`
              : `已解除批次 ${batchId} 之庫存凍結狀態`
          );
          return {
            ...b,
            quarantineStatus: nextStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return b;
      })
    );
  };

  // Record a newly filed complaint from Module 2
  const handleRecordNewComplaint = (record: ComplaintRecord) => {
    setComplaints((prev) => [record, ...prev]);

    // Synchronize to MES Batches
    setBatches((prev) =>
      prev.map((b) => {
        if (b.batchId === record.batchId) {
          const newCount = b.complaintCount + 1;
          const newRate = Number(((newCount / b.totalShipped) * 100).toFixed(2));
          const shouldQuarantine = newRate >= 3.0;

          return {
            ...b,
            complaintCount: newCount,
            complaintRate: newRate,
            quarantineStatus: shouldQuarantine ? 'quarantined' : b.quarantineStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return b;
      })
    );

    showToast(
      `已自動核發 NT$${record.voucherAmount} 購物金給 ${record.customerName}，並同步累計至批次 ${record.batchId}！`
    );
  };

  // Calculate dynamic BI metrics based on current batches
  const totalShippedAll = batches.reduce((acc, b) => acc + b.totalShipped, 0);
  const totalComplaintsAll = batches.reduce((acc, b) => acc + b.complaintCount, 0);
  const globalComplaintRate = Number(((totalComplaintsAll / totalShippedAll) * 100).toFixed(2));

  const biMetrics: BIMetrics = {
    globalComplaintRate,
    totalShippedAll,
    totalComplaintsAll,
    averageHandlingTime: '2.4 秒',
    totalSavedReturnShippingCost: totalComplaintsAll * 80,
    repurchaseRetentionRate: '84.6%',
    sentimentIndex: {
      positive: 78,
      neutral: 14,
      negative: 8,
    },
    topKeywords: [
      { word: '保暖吸汗', count: 482, sentiment: 'positive' },
      { word: '洗幾次起毛', count: 184, sentiment: 'negative' },
      { word: '客服秒補償50元', count: 132, sentiment: 'positive' },
      { word: '粗糙球鞋後跟', count: 96, sentiment: 'neutral' },
      { word: '反面洗滌教學實用', count: 88, sentiment: 'positive' },
      { word: '腳後跟毛球', count: 74, sentiment: 'negative' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickDemo={() => {
          setActiveTab('customer_service');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'storefront' && (
          <Module1Storefront
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onOpenCSClaim={(p) => {
              setSelectedProduct(p);
              setActiveTab('customer_service');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'customer_service' && (
          <Module2AICustomerService
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onRecordNewComplaint={handleRecordNewComplaint}
            recentComplaints={complaints}
          />
        )}

        {activeTab === 'qa_traceability' && (
          <Module3Traceability
            batches={batches}
            onToggleQuarantine={handleToggleQuarantine}
            recentComplaints={complaints}
          />
        )}

        {activeTab === 'bi_analytics' && (
          <Module4BIEngine
            metrics={biMetrics}
            batches={batches}
            complaints={complaints}
          />
        )}
      </main>

      {/* Global Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white p-4 rounded-xl shadow-2xl border border-stone-700 flex items-start gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              系統跨模組即時同步通知
            </div>
            <div className="text-xs text-stone-200 leading-relaxed">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Clean Footer adhering to Anti-Slop Guidelines */}
      <footer className="border-t border-stone-200 bg-white py-8 mt-16 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">織履品質管理系統</span>
            <span aria-hidden="true">·</span>
            <span>Functional Specification Document (FSD) 全模組實裝</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>ISO 12945-2 耐磨檢測</span>
            <span aria-hidden="true">·</span>
            <span>ASTM D3512 起毛等級</span>
            <span aria-hidden="true">·</span>
            <span>ERP / MES 數位孿生</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

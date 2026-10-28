export type ActiveTab = 'storefront' | 'customer_service' | 'qa_traceability' | 'bi_analytics';

export interface SockProduct {
  id: string;
  sku: string;
  name: string;
  subname: string;
  price: number;
  category: string;
  materialComposition: string;
  yarnOrigin: string;
  martindaleCycles: number;
  pillingGrade: number; // 1.0 to 5.0
  abrasionIndexText: string;
  image: string;
  description: string;
  shoeRecommendations: {
    shoeType: string;
    suitability: 'recommended' | 'caution' | 'incompatible';
    notice: string;
  }[];
  careSteps: {
    step: number;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface ComplaintRecord {
  id: string;
  orderId: string;
  sku: string;
  productName: string;
  batchId: string;
  customerName: string;
  purchaseDaysAgo: number;
  imageSrc: string;
  pillingGrade: number;
  confidence: number;
  affectedZone: string;
  features: string[];
  inspectionSummary: string;
  empathyReply: string;
  voucherCode: string;
  voucherAmount: number;
  status: 'resolved_auto' | 'pending_manual';
  createdAt: string;
}

export interface MESBatch {
  batchId: string;
  sku: string;
  productName: string;
  yarnSupplier: string;
  yarnLot: string;
  machineId: string;
  cylinderTension: string;
  spindleRpm: number;
  productionDate: string;
  totalShipped: number;
  complaintCount: number;
  complaintRate: number;
  quarantineStatus: 'normal' | 'quarantined';
  lastUpdated: string;
}

export interface BIMetrics {
  globalComplaintRate: number;
  totalShippedAll: number;
  totalComplaintsAll: number;
  averageHandlingTime: string;
  totalSavedReturnShippingCost: number;
  repurchaseRetentionRate: string;
  sentimentIndex: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topKeywords: {
    word: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
}

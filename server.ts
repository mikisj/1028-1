import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// In-memory operational store to link complaints to MES batches and BI metrics
interface BatchData {
  batchId: string;
  sku: string;
  productName: string;
  yarnSupplier: string;
  yarnLot: string;
  machineId: string;
  cylinderTension: string; // e.g. "4.8 N"
  spindleRpm: number;
  productionDate: string;
  totalShipped: number;
  complaintCount: number;
  complaintRate: number; // percentage
  quarantineStatus: 'normal' | 'quarantined';
  lastUpdated: string;
}

let batchesStore: BatchData[] = [
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
    complaintRate: 3.38, // > 3.0% threshold!
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
];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// -------------------------------------------------------------
// Module 2 API: CS-01 AI Visual Pilling Grade Inspection Engine
// -------------------------------------------------------------
app.post('/api/inspect-pilling', async (req, res) => {
  try {
    const { imageBase64, mimeType, presetGrade, skuName, description } = req.body;

    // If Gemini API is available and image data is provided
    if (aiClient && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const prompt = `你是一位專業的國際紡織物性品檢專家與 ISO 12945 / ASTM D3512 紡織起毛球評定專家。
請分析這張織襪照片中的表面毛羽與起毛球 (Pilling) 現象：
1. 評定起毛嚴重程度等級 (起毛球等級 1.0 至 5.0，其中 5.0 為全新平整極佳、4.0 為輕微微毛茸無球、3.0 為中度起球有明顯小毛球、2.0 為明顯密集糾結大毛球、1.0 為極度嚴重整片毛球密集糾結)。
2. 評定信心度 (Confidence %，例如 89% ~ 96%)。
3. 判定起毛集中區域 (例如：腳後跟摩擦處、前腳掌承重區、襪筒阿基里斯腱處、襪底)。
4. 辨識 2~3 個具體的紡織微觀特徵 (例如：短纖維端點外露、機械摩擦引發纖維糾結、底紗彈性纖維未受損)。
5. 簡要專業品檢評語 (50字以內)。

請務必只輸出嚴格的 JSON 格式，不要包含任何 markdown 代碼塊標記 (如 \`\`\`json)，直接以 JSON 大括號開頭結尾：
{
  "pillingGrade": 3.2,
  "gradeText": "3級 (中度起球)",
  "confidence": 92.5,
  "affectedZone": "腳後跟與內側摩擦接觸區",
  "features": ["短纖端點局部外露並凝聚成簇", "表面纖維糾結為直徑約 0.8-1.5mm 之毛球", "地組織結構完整無破洞跳針"],
  "inspectionSummary": "檢視受摩擦區域呈現典型機械剪切引發之短纖球聚，底紗張力維持良好，屬中度起毛球狀態。",
  "isEligibleForWarranty": true
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        });

        const rawText = response.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          result: {
            ...parsed,
            isEligibleForWarranty: parsed.pillingGrade <= 3.5,
          },
        });
      } catch (geminiError: any) {
        console.warn('Gemini vision API encountered an error, falling back to heuristic engine:', geminiError?.message);
      }
    }

    // Heuristic fallback engine based on preset grade or default
    const grade = typeof presetGrade === 'number' ? presetGrade : 3.0;
    const gradeMap: Record<number, { text: string; zone: string; features: string[]; summary: string }> = {
      1: {
        text: '1級 (極度嚴重起球)',
        zone: '腳底至後跟大面積承壓區',
        features: ['纖維嚴重糾結成直徑 >2.5mm 密集毛球', '局部底紗微露', '表面絨感完全硬化結團'],
        summary: '全襪底與後腳跟區域纖維糾結極度密集，達退貨與即時補償最高標準。',
      },
      2: {
        text: '2級 (明顯起球)',
        zone: '後腳跟阿基里斯腱與鞋內側高摩擦點',
        features: ['密集可見顯著毛球聚集', '短纖維脫離主體紗線', '基底編織未破針'],
        summary: '鞋後包內襯粗糙面反覆摩擦拉出短纖，毛球明顯可辨，符合售後即時補償標準。',
      },
      3: {
        text: '3級 (中度起球 - 臨界值)',
        zone: '腳後跟與前掌受力點',
        features: ['散佈少量直徑約 1mm 毛球', '局部微毛茸外翻', '底紗彈性結構完好'],
        summary: '達標準起毛臨界第 3 級，因摩擦引發短纖聚簇，已觸發自動免寄回補償機制。',
      },
      4: {
        text: '4級 (輕度毛茸 - 良好)',
        zone: '腳掌側面低摩擦區',
        features: ['表面輕微絨毛外露', '尚未形成緊密球體', '布面維持柔順平整'],
        summary: '屬於正常初次洗滌之浮毛釋出，物理結構強韌，建議配合洗衣袋反面洗滌即可恢復。',
      },
      5: {
        text: '5級 (極佳無毛球 - 新品級)',
        zone: '全襪身',
        features: ['組織緊密平整', '完全無毛球與纏結', '光澤度均勻且紋理清晰'],
        summary: '布面平整度極佳，符合高規格 Martindale 20,000 轉以上之高耐磨抗起毛標準。',
      },
    };

    const targetInfo = gradeMap[Math.round(grade)] || gradeMap[3];
    return res.json({
      success: true,
      source: 'heuristic-engine',
      result: {
        pillingGrade: grade,
        gradeText: targetInfo.text,
        confidence: 93.4,
        affectedZone: targetInfo.zone,
        features: targetInfo.features,
        inspectionSummary: targetInfo.summary,
        isEligibleForWarranty: grade <= 3.5,
      },
    });
  } catch (err: any) {
    console.error('Inspection failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Module 2 API: CS-02 GenAI Empathetic Customer Response
// -------------------------------------------------------------
app.post('/api/generate-empathy-response', async (req, res) => {
  try {
    const { customerName, pillingGrade, productName, voucherCode, purchaseDaysAgo } = req.body;

    if (aiClient) {
      try {
        const prompt = `你是一家追求極致品質與透明溫度的台灣精品織襪品牌資深客服總監。
顧客「${customerName || '貴賓'}」在購買我們的「${productName || '精梳羊毛運動襪'}」約 ${purchaseDaysAgo || 14} 天後，因發現起毛現象（AI 視覺辨識等級：${pillingGrade || 3.0} 級）向我們反映。
請生成一段具備下列要素的顧客回覆訊息：
1. 誠摯的感謝與同理：肯定顧客對細節與觸感的重視，不推諉卸責。
2. 專業紡織物理機制簡潔科普：以溫暖易懂的語言解釋「天然短纖維（如羊毛/精梳棉）在鞋內反覆機械摩擦下，端點毛羽自然遷移並抱合為球」的物理現象，打破「起毛＝劣質」的刻板印象。
3. 立即解決方案：表明顧客滿意是第一原則，已為您免寄回一鍵核發「NT$50 專屬無門檻購物金」（折抵碼：${voucherCode || 'PILL-FREE-8821'}），並附上反面清洗與護理小技巧。
4. 語氣：親切、真誠、專業、具生活質感，總字數約 180~250 字。`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const replyText = response.text?.trim() || '';
        return res.json({ success: true, replyText });
      } catch (err: any) {
        console.warn('Gemini empathy text generation error, using fallback:', err?.message);
      }
    }

    // High quality fallback empathy response
    const fallbackText = `${customerName || '親愛的顧客'} 您好，感謝您第一時間與我們分享襪款的使用情況！
對於讓您遇到起毛球的困擾，我們深感抱歉，也十分感謝您對穿著品質的細膩關注。

天然高級天然羊毛與長絨精梳棉具有極佳透氣性與柔韌感，但在特定鞋款內裡（如粗糙皮質或運動鞋網布）的高頻摩擦下，纖維端點受剪切力作用會自然往表面遷移抱合，這是天然短纖的物理特性。

為了讓您能毫無負擔地持續享受舒適體驗，我們已為您啟動「免寄回暖心保固」，自動派發專屬購物金 NT$50（折扣代碼：${voucherCode || 'PILL-FREE-8821'}），無使用門檻。建議您日後洗滌時將襪子反面翻出並放入細網洗衣袋，能大幅減少摩擦延長織物柔順度。再次感謝您的支持與包容！`;

    return res.json({ success: true, replyText: fallbackText });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Module 3 API: MES Traceability & Automated Batch Quarantine
// -------------------------------------------------------------
app.get('/api/mes/batches', (req, res) => {
  res.json({ success: true, batches: batchesStore });
});

app.post('/api/mes/record-complaint', (req, res) => {
  const { batchId } = req.body;
  const batch = batchesStore.find((b) => b.batchId === batchId);
  if (batch) {
    batch.complaintCount += 1;
    batch.complaintRate = Number(((batch.complaintCount / batch.totalShipped) * 100).toFixed(2));
    if (batch.complaintRate >= 3.0 && batch.quarantineStatus === 'normal') {
      batch.quarantineStatus = 'quarantined';
    }
    batch.lastUpdated = new Date().toISOString().split('T')[0];
    return res.json({ success: true, updatedBatch: batch, triggeredQuarantine: batch.complaintRate >= 3.0 });
  }
  res.status(404).json({ success: false, error: 'Batch not found' });
});

app.post('/api/mes/quarantine-toggle', (req, res) => {
  const { batchId, status } = req.body;
  const batch = batchesStore.find((b) => b.batchId === batchId);
  if (batch) {
    batch.quarantineStatus = status || (batch.quarantineStatus === 'normal' ? 'quarantined' : 'normal');
    batch.lastUpdated = new Date().toISOString().split('T')[0];
    return res.json({ success: true, batch });
  }
  res.status(404).json({ success: false, error: 'Batch not found' });
});

// -------------------------------------------------------------
// Module 4 API: BI Social Listening & Quality ROI Metrics
// -------------------------------------------------------------
app.get('/api/bi/metrics', (req, res) => {
  const totalShippedAll = batchesStore.reduce((acc, b) => acc + b.totalShipped, 0);
  const totalComplaintsAll = batchesStore.reduce((acc, b) => acc + b.complaintCount, 0);
  const globalComplaintRate = Number(((totalComplaintsAll / totalShippedAll) * 100).toFixed(2));

  res.json({
    success: true,
    data: {
      globalComplaintRate,
      totalShippedAll,
      totalComplaintsAll,
      averageHandlingTime: '2.4 秒 (原先手動處理需 48 小時)',
      totalSavedReturnShippingCost: totalComplaintsAll * 80, // NT$80 saved per ticket by eliminating physical reverse logistics
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
    },
  });
});

// -------------------------------------------------------------
// Vite Middlewares (Dev) or Static Assets (Prod)
// -------------------------------------------------------------
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sock Pilling FSD server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();

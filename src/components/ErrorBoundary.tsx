import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-stone-900">
          <div className="max-w-md w-full bg-white rounded-xl border border-stone-200 p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 className="text-lg font-bold">頁面載入遇到非預期錯誤</h2>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              系統在初始化或渲染元件時發生異常。若您在 GitHub Pages 靜態環境打開，請確保已完成建置 (npm run build) 並啟用相對路徑支援。
            </p>
            {this.state.error && (
              <pre className="p-3 bg-stone-100 rounded text-[11px] font-mono text-stone-700 overflow-x-auto whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新載入頁面</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

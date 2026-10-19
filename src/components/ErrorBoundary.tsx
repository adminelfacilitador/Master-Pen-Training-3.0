import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render discrepancy:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#0e1017] border border-[#d4af37]/30 rounded-3xl text-center space-y-4 my-8 max-w-xl mx-auto shadow-2xl">
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-serif-gold text-white">
                {this.props.fallbackTitle || 'Aviso de Sincronización del Módulo'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
                El sistema salvaguardó el estado de la sesión. Puedes reanudar la vista o regresar al ecosistema sin pérdida de información.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#8a6c25] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reintentar Vista</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '';
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 border border-zinc-700 transition cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#d4af37]" />
                <span>Ecosistema</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('Three.js Error caught:', error);
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Three.js Error Details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState({
        hasError: false,
        error: undefined,
        retryCount: this.state.retryCount + 1
      });
    }
  };

  render() {
    if (this.state.hasError) {
      const isWebGLSupported = () => {
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch {
          return false;
        }
      };

      const webglSupported = isWebGLSupported();

      return (
        <div className="w-full h-96 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🏰</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              3D Model Display Error
            </h3>
            <p className="text-slate-400 mb-4">
              {!webglSupported
                ? "Your browser doesn't support WebGL, which is required for 3D models."
                : "Unable to load the 3D phoenix model. This might be due to network issues or browser compatibility."
              }
            </p>
            <p className="text-slate-500 text-sm mb-4">
              Please use the traditional house selection below.
            </p>

            {webglSupported && this.state.retryCount < 3 && (
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors mr-2"
              >
                Try Again ({3 - this.state.retryCount} attempts left)
              </button>
            )}

            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-slate-500 cursor-pointer">
                  Technical Details
                </summary>
                <pre className="text-xs text-red-400 mt-2 bg-slate-900/50 p-2 rounded overflow-auto max-h-20">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeErrorBoundary;

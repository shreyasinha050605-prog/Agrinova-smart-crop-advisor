import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Unknown runtime error" };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App runtime crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-2xl w-full border border-border bg-card rounded-2xl p-6 space-y-3">
            <h1 className="text-2xl font-semibold">Application crashed</h1>
            <p className="text-muted-foreground">
              A runtime error occurred. Refresh the page after fixing the issue below.
            </p>
            <pre className="text-sm bg-muted rounded-lg p-4 overflow-auto whitespace-pre-wrap break-words">
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

import { createPortal } from "react-dom";

export default function LivePreview({
  isOpen,
  onClose,
  previewUrl,
  isFullscreen,
  setIsFullscreen,
  resultName
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in ${isFullscreen ? '' : 'p-4'}`}>
      <div
        style={{ background: 'var(--bg-elevated)', border: isFullscreen ? 'none' : '1px solid var(--border-primary)' }}
        className={`overflow-hidden shadow-2xl flex flex-col animate-scale-in relative transition-all duration-300
          ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full h-[90vh] max-w-7xl rounded-2xl'}
        `}
      >
        <div
          style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-secondary)' }}
          className="p-4 flex justify-between items-center"
        >
          <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-base sm:text-lg flex items-center truncate">
            <span className="mr-2">📱</span> Live Preview {resultName ? `- ${resultName}` : ''}
          </h3>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View in New Tab */}
            <button
              type="button"
              onClick={() => window.open(previewUrl, '_blank')}
              title="View in new tab"
              className="p-2 rounded-lg transition-colors hover:bg-white/10 flex items-center text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">New Tab</span>
            </button>

            {/* Toggle Full Screen */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
              className="p-2 rounded-lg transition-colors hover:bg-white/10 flex items-center text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4" />
                  </svg>
                  <span className="hidden sm:inline">Exit Full</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" />
                  </svg>
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="p-2 rounded-lg transition-colors hover:bg-red-500/20 hover:text-red-400 flex items-center text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 relative">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading preview...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

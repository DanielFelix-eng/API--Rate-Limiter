import { useState, useCallback } from 'react'
import { Copy, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useToastContext } from '../ui/Toast'

export function CodeBlock({ 
  code, 
  language = 'bash', 
  title, 
  showLineNumbers = true,
  filename 
}) {
  const { success } = useToastContext()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }, [code, success])

  const lines = code.trim().split('\n')

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-xs text-slate-400 font-mono">{filename}</span>
          )}
          {title && (
            <span className="text-xs text-slate-300">{title}</span>
          )}
          <span className="text-xs text-slate-500 px-2 py-0.5 rounded bg-slate-700">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {expanded && (
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-slate-500 select-none w-6 text-right pr-2" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="flex-1">{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      )}
    </div>
  )
}

export function CodeTabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.language}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === i
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            role="tab"
            aria-selected={activeTab === i}
          >
            {tab.language}
          </button>
        ))}
      </div>
      <div className="bg-slate-900">
        <CodeBlock
          code={tabs[activeTab].code}
          language={tabs[activeTab].language}
          filename={tabs[activeTab].filename}
        />
      </div>
    </div>
  )
}
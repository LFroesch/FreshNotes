// frontend/src/components/EnhancedTextEditor.jsx
import { useState } from 'react';
import { EyeIcon, EditIcon, BoldIcon, ItalicIcon, CodeIcon, QuoteIcon, ListIcon } from 'lucide-react';

const EnhancedTextEditor = ({ value, onChange, placeholder = "Write your note here..." }) => {
  const [isPreview, setIsPreview] = useState(false);

  const renderMarkdown = (text) => {
    if (!text) return '<p class="text-base-content/50 italic">Nothing to preview yet...</p>';
    
    let processedText = text;
    
    const ensureProtocol = (url) => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return 'https://' + url;
    };
    
    // Process in order to avoid conflicts
    
    // 1. Headers
    processedText = processedText
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-base-content">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2 text-base-content">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-base-content">$1</h1>');
    
    // 2. Code blocks (must come before inline code and links)
    processedText = processedText
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-base-300 rounded p-3 my-2 overflow-x-auto"><code class="text-sm">$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-base-300 px-2 py-1 rounded text-sm">$1</code>');
    
    // 3. Markdown-style links [text](url) - process before auto-linking
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (match, text, url) => {
      const fullUrl = ensureProtocol(url);
      return `<a href="${fullUrl}" class="text-primary underline hover:text-primary-focus" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
    
    // 4. Auto-detect plain URLs (avoid URLs already in markdown links or code blocks)
    processedText = processedText.replace(
      /(?<!<[^>]*|`[^`]*|\[[^\]]*\]\()[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s<]*)?/gi,
      (match) => {
        return `<a href="${ensureProtocol(match)}" class="text-primary underline hover:text-primary-focus" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    // 5. Auto-detect URLs starting with http/https
    processedText = processedText.replace(
      /(?<!<[^>]*|`[^`]*|\[[^\]]*\]\()https?:\/\/[^\s<]+/gi,
      (match) => {
        return `<a href="${match}" class="text-primary underline hover:text-primary-focus" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    // 6. Bold and Italic
    processedText = processedText
      .replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em class="italic">$1</em>');
    
    // 7. Blockquotes
    processedText = processedText
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 my-2 text-base-content/80 italic">$1</blockquote>');
    
    // 8. Lists
    processedText = processedText
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc list-inside">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc list-inside">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal list-inside">$1</li>');
    
    // 9. Line breaks
    processedText = processedText.replace(/\n/gim, '<br>');
    
    return processedText;
  };

  const insertMarkdown = (before, after = '', placeholder = '') => {
    const textarea = document.querySelector('.enhanced-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.slice(0, start) + before + textToInsert + after + value.slice(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        const newPos = start + before.length + placeholder.length;
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleButtonClick = (e, action) => {
    e.preventDefault(); 
    e.stopPropagation();
    action();
  };

  const formatButtons = [
    { icon: BoldIcon, label: 'Bold', action: () => insertMarkdown('**', '**', 'bold text') },
    { icon: ItalicIcon, label: 'Italic', action: () => insertMarkdown('*', '*', 'italic text') },
    { icon: CodeIcon, label: 'Code', action: () => insertMarkdown('`', '`', 'code') },
    { icon: QuoteIcon, label: 'Quote', action: () => insertMarkdown('> ', '', 'quote') },
    { icon: ListIcon, label: 'List', action: () => insertMarkdown('- ', '', 'list item') },
  ];

  return (
    <div className="border border-base-300 rounded-lg bg-base-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-base-200 border-b border-base-300 overflow-visible">
        <div className="flex items-center gap-1">
          {formatButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleButtonClick(e, btn.action)}
              className="btn btn-ghost btn-xs tooltip"
              data-tip={btn.label}
            >
              <btn.icon className="size-4" />
            </button>
          ))}
          
          <div className="divider divider-horizontal mx-1"></div>
          
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => insertMarkdown('# ', '', 'Header'))}
            className="btn btn-ghost btn-xs"
            title="Header"
          >
            H1
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => insertMarkdown('## ', '', 'Header'))}
            className="btn btn-ghost btn-xs"
            title="Header 2"
          >
            H2
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsPreview(!isPreview);
          }}
          className={`btn btn-xs ${isPreview ? 'btn-primary' : 'btn-ghost'}`}
          title={isPreview ? 'Edit' : 'Preview'}
        >
          {isPreview ? <EditIcon className="size-4" /> : <EyeIcon className="size-4" />}
          <span className="ml-1 text-xs">{isPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            className="enhanced-textarea w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] p-4 resize-none border-0 focus:outline-none bg-transparent font-mono text-sm leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace"
            }}
          />
        )}
      </div>

      {/* Help */}
      <div className="px-3 py-2 bg-base-100 border-t border-base-300 text-xs text-base-content/60">
        <details>
          <summary className="cursor-pointer hover:text-base-content">Markdown shortcuts</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <span><kbd className="kbd kbd-xs">**bold**</kbd></span>
            <span><kbd className="kbd kbd-xs">*italic*</kbd></span>
            <span><kbd className="kbd kbd-xs">`code`</kbd></span>
            <span><kbd className="kbd kbd-xs"># header</kbd></span>
            <span><kbd className="kbd kbd-xs">- list</kbd></span>
            <span><kbd className="kbd kbd-xs">&gt; quote</kbd></span>
          </div>
        </details>
      </div>
    </div>
  );
};

export default EnhancedTextEditor;
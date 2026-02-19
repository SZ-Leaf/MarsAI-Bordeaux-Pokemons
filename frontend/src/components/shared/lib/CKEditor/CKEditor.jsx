import { useRef, useEffect } from 'react';
import '../../../../styles.css';

/**
 * Éditeur riche minimal (contentEditable + barre d'outils).
 * Aucune dépendance CKEditor. Props: value, onChange, placeholder?, disabled?, editorKey?
 */
function cmd(cmdName, value = null) {
  document.execCommand(cmdName, false, value);
}

export default function CKEditor({ value = '', onChange, placeholder = 'Saisissez le contenu...', disabled = false, editorKey }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
  }, [value, editorKey]);

  const handleInput = () => {
    if (ref.current) onChange?.(ref.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt('URL du lien:', 'https://');
    if (url) cmd('createLink', url);
  };

  return (
    <div className="ckeditor-wrap" key={editorKey}>
      <div className="ckeditor-toolbar">
        <button type="button" onClick={() => cmd('bold')} title="Gras">B</button>
        <button type="button" onClick={() => cmd('italic')} title="Italique">I</button>
        <button type="button" onClick={() => cmd('underline')} title="Souligné">S</button>
        <span className="ckeditor-toolbar-sep" />
        <button type="button" onClick={() => cmd('insertUnorderedList')} title="Liste à puces">•</button>
        <button type="button" onClick={() => cmd('insertOrderedList')} title="Liste numérotée">1.</button>
        <span className="ckeditor-toolbar-sep" />
        <button type="button" onClick={handleLink} title="Lien">Lien</button>
      </div>
      <div
        ref={ref}
        className="ckeditor-editable"
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
      />
    </div>
  );
}

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, EditorWatchdog, ContextWatchdog } from 'ckeditor5';
import '@ckeditor/ckeditor5-theme-lark/theme/index.css';

/**
 * Éditeur riche réutilisable (mise en forme texte uniquement, pas d'images).
 * Props: value (HTML), onChange(html), placeholder?, disabled?, minHeight?
 */
const EDITOR_CONFIG = {
  toolbar: {
    items: [
      'undo', 'redo',
      '|', 'heading',
      '|', 'bold', 'italic', 'underline', 'strikethrough',
      '|', 'link', 'bulletedList', 'numberedList',
      '|', 'blockQuote',
      '|', 'removeFormat',
    ],
    shouldNotGroupWhenFull: false,
  },
  removePlugins: [
    'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'ImageInsert',
    'MediaEmbed', 'Table', 'TableToolbar', 'TableProperties', 'TableCellProperties',
  ],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraphe', class: 'ck-heading_paragraph' },
      { model: 'heading2', view: 'h2', title: 'Titre 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Titre 3', class: 'ck-heading_heading3' },
    ],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://',
  },
  language: 'fr',
};

const editorPreset = {
  create: (elementOrData, config) => ClassicEditor.create(elementOrData, { ...EDITOR_CONFIG, ...config }),
  EditorWatchdog,
  ContextWatchdog,
};

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  minHeight = '200px',
  id,
  className = '',
}) {
  const handleChange = (event, editor) => {
    const data = editor.getData();
    onChange?.(data);
  };

  return (
    <div className={className} style={{ minHeight }}>
      <CKEditor
        editor={editorPreset}
        config={{
          ...EDITOR_CONFIG,
          placeholder: placeholder || 'Saisissez le contenu...',
        }}
        data={value}
        onChange={handleChange}
        disabled={disabled}
        id={id}
      />
    </div>
  );
}

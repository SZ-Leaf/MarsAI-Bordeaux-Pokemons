export class I18nError extends Error {
  
  constructor(messages) {
    if (!messages || typeof messages !== 'object') {
      throw new Error('I18nError requires a messages object');
    }
    
    super(messages.en); // keep a normal message for logs
    this.i18n = messages;
  }
  getMessage(lang = 'en') {
    return this.i18n[lang] || this.i18n.en;
  }
};

export const authError = (messages) => new I18nError(messages);
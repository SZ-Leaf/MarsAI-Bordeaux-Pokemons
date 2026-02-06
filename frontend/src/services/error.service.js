export class I18nError extends Error {
   constructor(messages) {
     super(messages.en); // keep a normal message for logs
     this.i18n = messages;
   }
}; 
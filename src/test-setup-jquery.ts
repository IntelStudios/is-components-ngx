import jQuery from 'jquery';

const globals = globalThis as typeof globalThis & {
  $: typeof jQuery;
  jQuery: typeof jQuery;
};

globals.$ = jQuery;
globals.jQuery = jQuery;

const mockEditor = {
  events: { on: () => undefined },
  edit: { off: () => undefined },
  $el: { atwho: () => undefined },
  $html: [{ querySelector: () => null }],
  commands: { exec: () => undefined },
};

(jQuery as typeof jQuery & { FroalaEditor: Record<string, unknown> }).FroalaEditor = {
  DefineIcon: () => undefined,
  RegisterCommand: () => undefined,
  KEYCODE: { ENTER: 13 },
};

jQuery.fn.froalaEditor = function froalaEditor() {
  this.data('froala.editor', mockEditor);
  return this;
};


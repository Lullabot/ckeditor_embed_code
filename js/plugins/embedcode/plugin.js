/**
 * @file
 * Plugin to embed code like an iframe.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

(function ($) {
  // Register the plugin within the editor.
  CKEDITOR.plugins.add('embedcode', {
    lang: 'en',

    // Register the icons.
    icons: 'embedcode',

    // The plugin initialization logic goes inside this method.
    init: function (editor) {
      var lang = editor.lang.embedcode;

      // Define an editor command that opens our dialog.
      editor.addCommand('embedcode', new CKEDITOR.dialogCommand('embedcodeDialog'));

      // Create a toolbar button that executes the above command.
      editor.ui.addButton('embedcode', {

        // The text part of the button (if available) and tooptip.
        label: lang.buttonTitle,

        // The command to execute on click.
        command: 'embedcode',

        // The button placement in the toolbar (toolbar group name).
        toolbar: 'insert',

        // The path to the icon.
        icon: this.path + 'icons/embedcode.png'
      });

      if (editor.contextMenu) {
        editor.addMenuGroup('embedcodeGroup');
        editor.addMenuItem('embedcodeItem', {
          label: lang.menuItemTitle,
          icon: this.path + 'icons/embedcode.png',
          command: 'embedcode',
          group: 'embedcodeGroup'
        });

        editor.contextMenu.addListener(function (element) {
          if (element.getAscendant('div', true)) {
            return { div: CKEDITOR.TRISTATE_OFF };
          }
        });
      }

      // Register our dialog file. this.path is the plugin folder path.
      CKEDITOR.dialog.add('embedcodeDialog', this.path + 'dialogs/embedcode.js');
    }
  });
})(jQuery);

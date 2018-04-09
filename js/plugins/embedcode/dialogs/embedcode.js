/**
 * @file
 * The embedcode dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add('embedcodeDialog', function (editor) {
  var lang = editor.lang.embedcode;

  return {

    // Basic properties of the dialog window: title, minimum size.
    title: lang.dialogTitle,
    minWidth: 400,
    minHeight: 150,

    // Dialog window contents definition.
    contents: [
    {
      // Definition of the Basic Settings dialog tab (page).
      id: 'tab-basic',
      label: 'Basic Settings',

      // The tab contents.
      elements: [
      {
        // Code textarea field.
        type: 'textarea',
        id: 'text',
        label: lang.dialogEmbedCodeText,

        // Validation checking whether the field is not empty.
        validate: CKEDITOR.dialog.validate.notEmpty(lang.dialogEmbedCodeTextNotEmpty),

        // Called by the main setupContent call on dialog initialization.
        setup: function (element) {
          if (element.hasClass('embedcode')) {
            this.setValue(element.getText());
          }
        },

        // Called by the main commitContent call on dialog confirmation.
        commit: function (element) {
          element.addClass('embedcode');
          element.setText(this.getValue());
        }
      }
      ]
    }
    ],

    // Invoked when the dialog is loaded.
    onShow: function () {

      // Get the selection in the editor.
      var selection = editor.getSelection();

      // Get the element at the start of the selection.
      var element = selection.getStartElement();

      // Get the div element closest to the selection, if any.
      if (element) {
        element = element.getAscendant('div', true);
      }

      // Create a new <div> element if it does not exist.
      if (!element || element.getName() !== 'div') {
        element = editor.document.createElement('div');
        // Flag the insertion mode for later use.
        this.insertMode = true;
      }
      else {
        this.insertMode = false;
      }

      // Store the reference to the <div> element in an internal property, for later use.
      this.element = element;

      // Invoke the setup methods of all dialog elements, so they can load the element attributes.
      if (!this.insertMode) {
        this.setupContent(this.element);
      }
    },

    // This method is invoked once a user clicks the OK button, confirming the dialog.
    onOk: function () {

      // The context of this function is the dialog object itself.
      // http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
      var dialog = this;

      var div = this.element;

      // Invoke the commit methods of all dialog elements, so the <div> element gets modified.
      this.commitContent(div);

      // Finally, in if insert mode, inserts the element at the editor caret position.
      if (this.insertMode) {
        editor.insertElement(div);
      }
    }
  };
});

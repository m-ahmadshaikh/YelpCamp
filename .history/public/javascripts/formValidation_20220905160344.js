bsCustomFileInput.init();

(function () {
  'use strict';
  $('.custom-file-input').on('change', function () {
    var files = Array.from(this.files);
    var fileName = files
      .map((f) => {
        return f.name;
      })
      .join(', ');
    $(this).siblings('.custom-file-label').addClass('selected').html(fileName);
  });

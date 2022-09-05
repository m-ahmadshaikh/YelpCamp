bsCustomFileInput.init();
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });
})();

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

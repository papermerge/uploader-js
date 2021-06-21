window.addEventListener('DOMContentLoaded', () => {
    let DU = DocumentUploader,
        uploader,
        upload_btn_trigger,
        upload_hidden_input;


    upload_btn_trigger = document.querySelector(".upload-trigger");
    upload_hidden_input = document.querySelector(".upload-hidden-input");

    upload_btn_trigger.addEventListener('click', () => {
        upload_hidden_input.click();
    });

});
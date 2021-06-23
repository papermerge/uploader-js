window.addEventListener('DOMContentLoaded', () => {
    let DU = DocumentUploader,
        uploader,
        upload_btn_trigger,
        upload_hidden_input;


    upload_btn_trigger = document.querySelector(".upload-trigger");
    upload_hidden_input = document.querySelector(".upload-hidden-input");
    DU.urlconf.prefix = '/01-uploader';

    upload_btn_trigger.addEventListener('click', () => {
        upload_hidden_input.click();
    });

    upload_hidden_input.addEventListener('change', (event) => {
        let data_transfer,
            files,
            uploader_view;

        files = event.target.files;

        uploader_view = new DU.UploaderView({
            files: files,
            lang: 'deu',
            parent_id: -1,
            options: {'el': document.querySelector('#uploader-view')}
        });
    });

});
window.addEventListener('DOMContentLoaded', () => {
    let DU = DocumentUploader,
        uploader,
        upload_btn_trigger,
        upload_hidden_input,
        files_list;


    upload_btn_trigger = document.querySelector(".upload-trigger");
    upload_hidden_input = document.querySelector(".upload-hidden-input");
    files_list = document.querySelector('#files-list');
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

        uploader_view.on('upload-success', (doc_dict) => {
            let li = document.createElement('li'),
                text;

            text = `id = ${doc_dict['id']}, title=${doc_dict['title']}`;
            text += ` parent_id=${doc_dict['parent_id']} lang=${doc_dict['lang']}`

            li.appendChild(document.createTextNode(text));
            files_list.appendChild(li);
        });
    });

});
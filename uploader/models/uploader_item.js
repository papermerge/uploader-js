import { Model } from "@papermerge/symposium";

import { urlconf } from "../urls";


function _human_size(bytes_count) {
    let arr = ['B', 'KB', 'MB', 'GB', 'TB'],
        output = "";

    if (!bytes_count) {
        console.log("Invalid bytes count provided");
        return;
    };

    for (let x = bytes_count, mult = 0; x > 1; x = x/1024, mult++) {
        output = x.toFixed(1) + " " + arr[mult];
    };

    return output;
}


class UploaderItem extends Model {

    constructor({file, lang, parent_id}) {

        if (!parent_id) {
          parent_id = -1;
        }

        this.title = file.name;
        this.size = file.size;
        this.file = file;
        this.lang = lang;
        this.file_type = file.type;
        this.progress = 0;
        this.parent_id = parent_id;
        this.status = UploaderItem.INIT

        // once uploader item instance is created
        // immediately start upload process.
        this.send();
    }

    is_success() {
      return this.status == UploaderItem.UPLOAD_SUCCESS;
    }

    is_error() {
      return this.status == UploaderItem.UPLOAD_ERROR;
    }

    is_progress() {
      return this.status == UploaderItem.UPLOAD_PROGRESS;
    }

    get human_size() {
       return _human_size(this.size);
    }

    set_progress(percent) {
        // percentage = (0..100), as integer
        this.set('progress', percent);
        this.trigger('change');
    }

    _build_form_data() {
        let form_data;

        form_data = new FormData();
        form_data.append("language", this.lang);
        form_data.append("file_name", this.file_name);
        form_data.append("file_type", this.file_type);
        form_data.append("parent", this.parent_id);
        form_data.append("file", this.file);

        return form_data;
    }

    send() {
        let xhr,
            percent,
            token = undefined,
            csrf_selector = undefined,
            csrf_header = undefined,
            that = this;

        xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', function(e) {
            let response = JSON.parse(e.currentTarget.response);

            if (e.currentTarget.status == 403) {
                // this is reponse when e.g. maximum number of nodes is reached
                that.status = UploaderItem.UPLOAD_ERROR;
            } else if (e.lengthComputable) {
                percent = Math.round((e.loaded * 100) / e.total);
                // notify subscribers of "upload_progress" event
               that.set_progress(percent);
            }
        });

        function transferFailed(e) {
            let response = JSON.parse(e.currentTarget.response);

            console.log(`Transfer failed for ${that.get('title')}`);

            that.status = UploaderItem.UPLOAD_ERROR;
        }

        function transferComplete(e) {
            let response = JSON.parse(e.currentTarget.response);

            console.log(`Complete? status = ${e.currentTarget.status}`);

            if (e.currentTarget.status == 200) {
                that.status = UploaderItem.UPLOAD_SUCCESS;
            } else if (e.currentTarget.status == 500) {
                that.status = UploaderItem.UPLOAD_ERROR;
            } else if ( e.currentTarget.status == 400 ) {
                that.status = UploaderItem.UPLOAD_ERROR;
            }
        }

        xhr.addEventListener("error", transferFailed);
        xhr.addEventListener("load", transferComplete);

        csrf_selector = settings.get('csrf-selector');
        csrf_header = settgins.get('csrf-header');

        if (csrf_selector) {
            token = document.querySelector(csrf_selector);
            if (!token) {
                console.warn("CSRF token DOM element not found");
            }
        }

        xhr.open("POST", urlconf.upload_url());
        if (csrf_header) {
            xhr.setRequestHeader(
                csrf_header,
                token
            );
        } else {
            console.warn("CSRF header configuration not found");
        }

        xhr.send(this._build_form_data());
    } // send
}

// this is initial state
// before uploading starts
UploaderItem.INIT = "init";

UploaderItem.UPLOAD_START = "upload_start";
UploaderItem.UPLOAD_ERROR = "upload_error";
UploaderItem.UPLOAD_SUCCESS = "upload_success";
UploaderItem.UPLOAD_PROGRESS = "upload_progress";


export { UploaderItem };
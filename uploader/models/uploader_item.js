import { Model } from "@papermerge/symposium";

import { urlconf } from "../urls";
import { settings } from "../conf";

import {
    human_size as _human_size
} from "../utils";

import {
    is_error_status_code as _is_error_status_code
} from "../utils";


class UploaderItem extends Model {

    constructor({file, lang, parent_id}) {
        super();

        if (!parent_id) {
          parent_id = -1;
        }

        this.title = file.name;
        this.size = file.size;
        this.file = file;
        this.lang = lang;
        this.file_type = file.type;
        this._progress = 0;
        this.parent_id = parent_id;
        this._status = UploaderItem.INIT
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

    get progress() {
        return this._progress;
    }

    set progress(percent) {
        // percentage = (0..100), as integer
        if (this._progress != percent) {
            this._progress = percent;
            this.trigger('change');
        }
    }

    get status() {
        return this._status;
    }

    set status(value) {
        if (this._status != value) {
            this._status = value;
            if (this._status == UploaderItem.UPLOAD_ERROR) {
                // on error, progress is set automatically
                // to 100% i.e. we are done with this item
                this._progress = 100;
            }
            this.trigger("change");
        }
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

    upload() {
        let xhr,
            percent,
            token = undefined,
            csrf_selector = undefined,
            csrf_header = undefined,
            that = this;

        xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', function(e) {
            let response;

            try {
                JSON.parse(e.currentTarget.response);
            } catch (error) {
                that.status = UploaderItem.UPLOAD_ERROR;
                return;
            }

            if (e.currentTarget.status == 403) {
                // this is reponse when e.g. maximum number of nodes is reached
                that.status = UploaderItem.UPLOAD_ERROR;
            } else if (e.lengthComputable) {
                percent = Math.round((e.loaded * 100) / e.total);
                // notify subscribers of "upload_progress" event
               that.progress = percent;
            }
        });

        function transferFailed(e) {
            let response;

            try {
                response = JSON.parse(e.currentTarget.response);
            } catch (error) {
                that.status = UploaderItem.UPLOAD_ERROR;
            }

            that.status = UploaderItem.UPLOAD_ERROR;
        }

        function transferComplete(event) {
            let response;

            if (event.target.status == 200) {
                that.status = UploaderItem.UPLOAD_SUCCESS;
                response = JSON.parse(event.target.response);
            } else if (_is_error_status_code(event.target.status)) {
                that.statusText = `Server Error: ${event.target.statusText}`;
                that.status = UploaderItem.UPLOAD_ERROR;
            }
        }

        xhr.addEventListener("error", transferFailed);
        xhr.addEventListener("load", transferComplete);

        csrf_selector = settings.get('csrf-selector');
        csrf_header = settings.get('csrf-header');

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
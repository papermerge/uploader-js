import { Collection } from "@papermerge/symposium";


class UploaderItems extends Collection {

    get progress() {
      let total_progress = 0;

      this.forEach(function(it) {
          total_progress += it.progress ;
      });

      if (this.length > 0) {
        total_progress = total_progress / this.length;
      }

      return total_progress;
    }

    get_summary_status() {
        let summary_status = {
           'success': 0,
           'error': 0,
        };

        this.forEach(it => {
            if ( it.is_success() ) {
                summary_status['success'] += 1;
            }
            if ( it.is_error() ) {
                summary_status['error'] += 1;
            }
        });

        return summary_status;
    }

    is_summary_success() {
        let summary_status = this.get_summary_status();
        return summary_status['success'] == this.length;
    }

    is_summary_error() {
        let summary_status = this.get_summary_status();
        return summary_status['error'] > 0;
    }

    add(item_or_items) {
        super.add(item_or_items);
        if (item_or_items['on']) {
            item_or_items.on(
                "upload-success",
                this._on_upload_success,
                this
            );
        }
    }

    _on_upload_success(doc_dict) {
        this.trigger("upload-success", doc_dict);
    }
}

export { UploaderItems };
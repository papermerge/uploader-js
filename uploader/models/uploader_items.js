import { Collection } from "@papermerge/symposium";


class UploaderItems extends Collection {

    get progress() {
      let total_progress = 0;

      this.each(function(it) {
          total_progress += it.get('progress') ;
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

        this.each(function(it) {
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
}

export { UploaderItems };
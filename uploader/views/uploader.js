import { View } from '@papermerge/symposium';
import { renderman } from "../renderman";

import { UploaderItems } from "../models/uploader_items";
import { UploaderItem } from "../models/uploader_item";


class UploaderView extends View {

  constructor({files, lang, parent_id, options}) {
    super(options);
    this.uploader_col = new UploaderItems();

    for(let file of files) {
      this.uploader_col.add(
        new UploaderItem({file, lang, parent_id})
      );
    }

    this.listenTo(this.uploader, 'change', this.render);
    this.listenTo(this.uploader, 'change', this.refresh_node_list);
    this.render();
  }

  get default_template_name() {
      return "templates/uploader.html";
  }

  get default_template_engine() {
      return renderman;
  }

  get default_context() {
      return {'items': this.uploader_col};
  }

  events() {
    let event_map = {
      'click .close': 'close',
      'click button.toggle-details': 'toggle_details'
    }

    return event_map;
  }

  toggle_details(event) {
    this.$el.find('.uploader-details').toggleClass('hidden');
  }

  close(event) {
    this.$el.html('');
  }
}


export { UploaderView };
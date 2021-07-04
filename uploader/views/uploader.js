import { View } from '@papermerge/symposium';
import { renderman } from "../renderman";

import { UploaderItems } from "../models/uploader_items";
import { UploaderItem } from "../models/uploader_item";


class UploaderView extends View {

    constructor({lang, parent, options}) {
        super(options);
        let parent_id;

        this.lang = lang;
        this.parent = parent;
        this.uploader_col = new UploaderItems();

        this.listenTo(this.uploader_col, 'change', this.render);
        this.listenTo(this.uploader_col, 'upload-success', this.on_upload_success);
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

    upload({files, lang, parent}) {
        let parent_id, item;

        if (parent) {
            parent_id = parent.id;
        }

        for(let file of files) {
            item =  new UploaderItem({file, lang, parent_id});
            this.uploader_col.add(item);
            item.upload();
        }
    }

    toggle_details(event) {
        this.$el.find(
            '.uploader-details-wrapper'
        ).toggleClass('hidden');
    }

    close(event) {
        this.$el.html('');
    }

    on_upload_success(doc_dict) {
        this.trigger("upload-success", doc_dict);
    }
}


export { UploaderView };
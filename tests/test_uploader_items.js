import { assert } from "chai";

import { UploaderItem } from '../uploader/models/uploader_item';
import { UploaderItems } from '../uploader/models/uploader_items';


describe("test/test_uploader_items.js", () => {

    it("Can instanciate a empty UploaderItems instance", () => {

        let items = new UploaderItems();

        assert.isDefined(items);
    });

    it("Triggers change event when one item changes", () => {
        /**
         * When `change` event is triggered on one of the items
         * the `change` event propagates up to the collection
         * object
         */
        let items = new UploaderItems(),
            item1,
            item2,
            counter = 0;

        item1 = new UploaderItem({
            file: new File([], 'whatever1.pdf'),
            lang: 'deu',
            parent_id: -1
        });

        item2 = new UploaderItem({
            file: new File([], 'whatever2.pdf'),
            lang: 'deu',
            parent_id: -1
        });

        items.add(item1);
        items.add(item2);

        items.on("change", () => {counter++});
        item1.status = UploaderItem.UPLOAD_ERROR; // => counter++
        item2.status = UploaderItem.UPLOAD_ERROR; // => counter++

        assert.equal(
            counter,
            2,
            "Counter != 2, although two items in collection changed"
        );
    });
});
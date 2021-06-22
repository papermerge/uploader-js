import { assert } from "chai";

import { UploaderItem } from '../uploader/models/uploader_item';



describe("test/test_uploader_item.js", () => {

    it("Can instanciate a empty UploaderItem instance", () => {

        let item = new UploaderItem({
            file: new File([], 'whatever.pdf'),
            lang: 'deu',
            parent_id: -1
        });

        assert.isDefined(item);
        assert.equal(
            item.status,
            UploaderItem.INIT,
            "Initial status of uploader item != INIT"
        );
    });

    it("Triggers change event when status changes", () => {

        let item = new UploaderItem({
            file: new File([], 'whatever.pdf'),
            lang: 'deu',
            parent_id: -1
        }),
        counter = 0;

        item.on("change", () => { counter++; });
        item.status = UploaderItem.UPLOAD_ERROR;

        assert.equal(
            counter,
            1,
            "Changing status didn't trigger change event"
        );
    });

});
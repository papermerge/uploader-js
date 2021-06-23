import { assert } from "chai";

import { is_error_status_code } from '../uploader/utils';
import { human_size } from '../uploader/utils';


describe("test/test_utils.js: is_error_status_code", () => {

    it("returns true for status errors", () => {
        assert.isTrue(is_error_status_code(404));
        assert.isTrue(is_error_status_code(500));
    });

    it("returns false for non error status codes", () => {
        assert.isFalse(is_error_status_code(200));
    });
});

describe("test/test_utils.js: human_size", () => {

    it("returns one digit after the point", () => {
        assert.equal(
            "250.0 KB", // <- one digit after the point
            human_size(250 * 1024)
        );
    });
});
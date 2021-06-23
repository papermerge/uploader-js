import { exceptions } from "@papermerge/symposium";


function human_size(bytes_count) {
    /*
    Builds a human readable file size.

    @param integer {bytes_count} - file size in bytes

    Returns a human readable text/string for file size:

        "350 KB"
        "2 MB"
    */
    let arr = ['B', 'KB', 'MB', 'GB', 'TB'],
        output = "";

    if (!bytes_count) {
        throw new exceptions.ValueError(
            "Invalid bytes count provided"
        );
    };

    for (let x = bytes_count, mult = 0; x > 1; x = x/1024, mult++) {
        output = x.toFixed(1) + " " + arr[mult];
    };

    return output;
}

function is_error_status_code(status_code) {
    /*
    Checks if {status_code} is an error code or not.

    @param {status_code} is an integer.

    Error status code in this case are HTTP
    error codes starting with 4 and 5 i.e. 4xx and 5xx.
    To figure out if a status code starts with digit 4 or
    5 we divide by 100 and take the integer part of it - as
    simple as that.
    */
    let div;

    div = parseInt(status_code / 100);

    return div == 4 || div == 5;
}

export { human_size, is_error_status_code };
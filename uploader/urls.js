
class UrlConf {
    /**
     *
     * Central point for managing urls.
     */

    constructor(prefix="/browser") {
        this._prefix = prefix;
    }

    upload_url() {
        return `${this.prefix}/upload/`;
    }

    root_url() {
        return this.prefix;
    }

    set prefix(value) {
        this._prefix = value;
    }

    get prefix() {
        return this._prefix;
    }
}

// there is only one UrlConf instance
let urlconf = new UrlConf();


export { urlconf };
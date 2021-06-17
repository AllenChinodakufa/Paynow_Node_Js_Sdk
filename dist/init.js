"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitResponse = void 0;
var constants_1 = require("./constants");
var InitResponse = (function () {
    function InitResponse(data) {
        this.status = data.status;
        this.success = this.status === constants_1.RESPONSE_OK;
        this.hasRedirect = (typeof data.browserurl !== 'undefined');
        if (!this.success) {
            this.error = data.error;
        }
        else {
            this.pollUrl = data.pollurl;
            if (this.hasRedirect) {
                this.redirectUrl = data.browserurl;
            }
            if (typeof data.instructions !== 'undefined') {
                this.instructions = data.instructions;
            }
        }
    }
    return InitResponse;
}());
exports.InitResponse = InitResponse;
//# sourceMappingURL=init.js.map
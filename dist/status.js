"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusResponse = void 0;
var constants_1 = require("./constants");
var StatusResponse = (function () {
    function StatusResponse(data) {
        if (data.status.toLowerCase() === constants_1.RESPONSE_ERROR) {
            this.error = data.error;
        }
        else {
            this.reference = data.reference;
            this.amount = data.amount;
            this.paynowReference = data.paynowreference;
            this.pollUrl = data.pollurl;
            this.status = data.status;
        }
    }
    return StatusResponse;
}());
exports.StatusResponse = StatusResponse;
//# sourceMappingURL=status.js.map
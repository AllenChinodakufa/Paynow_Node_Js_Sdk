// StatusResponse Class
/**
 *
 * @property {string} reference - merchant transaction reference .
 * @property {string} amount - original amount for the transaction.
 * @property {string} paynowReference  - the Paynow transaction reference.
 * @property {string} pollUrl - the URL on Paynow the merchant can poll to confirm the transaction’s status.
 * @property {string} status - transaction status returned from paynow.
 * @property {string} error - error message sent from Paynow  (if any).
 *
 * @param data data from the status response
 */

import { RESPONSE_ERROR } from './constants';

export class StatusResponse {
    reference: string;
    amount: string;
    paynowReference: string;
    pollUrl: string;
    status: string;
    error: string;

    constructor(data: any) {
        if (data.status.toLowerCase() === RESPONSE_ERROR) {
            this.error = data.error;
        } else {
            this.reference = data.reference;
            this.amount = data.amount;
            this.paynowReference = data.paynowreference;
            this.pollUrl = data.pollurl;
            this.status = data.status;
        }
    }
}

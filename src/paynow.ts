/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { URL_INITIATE_TRANSACTION, URL_INITIATE_MOBILE_TRANSACTION } from './constants';
import { InitResponse } from './init';
import Payment from './payment';
import { StatusResponse } from './status';
import { sha512 } from 'js-sha512';

export default class Paynow {
    constructor(
        public integrationId: string,
        public integrationKey: string,
        public resultUrl: string,
        public returnUrl: string
    ) { }

    /**
     * Send a payment to paynow
     *
     * @param payment
     */
    send(payment: Payment) {
        return this.init(payment);
    }

    /**
     * Send a mobile money payment to paynow
     *
     * @param payment
     */
    sendMobile(payment: Payment, phone: string, method: string) {
        return this.initMobile(payment, phone, method);
    }

    /**
     * Create a new Paynow payment
     *
     * @param reference This is the unique reference of the transaction
     * @param authEmail This is the email address of the person making payment. Required for mobile transactions
     * @returns
     */
    createPayment(reference: string, authEmail: string): Payment {
        return new Payment(reference, authEmail);
    }

    /**
     * Throw an exception with the given message
     *
     * @param message*
     * @returns void
     */
    fail(message: string): Error {
        throw new Error(message);
    }

    /**
     * Initialize a new transaction with PayNow
     *
     * @param payment
     * @returns
     */
    async init(payment: Payment) {
        this.validate(payment);
        const data = this.build(payment);

        console.log(URL_INITIATE_TRANSACTION);

        const res = await fetch(`${URL_INITIATE_TRANSACTION}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
            .then((response: Response) => this.parse(response))
            .catch(err => {
                console.log(
                    'An error occured while initiating mobile transaction',
                    err
                );
            });

        return res;
    }

    /**
     * Initialize a new mobile transaction with PayNow
     *
     * @param payment
     * @returns the response from the initiation of the transaction
     */
    async initMobile(payment: Payment, phone: string, method: string) {
        this.validate(payment);

        if (!this.isValidEmail(payment.authEmail)) {
            this.fail(
                'Invalid email. Please ensure that you pass a valid email address when initiating a mobile payment'
            );
        }

        const data = this.buildMobile(payment, phone, method);
        const res = await fetch(`${URL_INITIATE_MOBILE_TRANSACTION}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
            .then((response: Response) => this.parse(response))
            .catch(err => {
                console.log(
                    'An error occured while initiating mobile transaction',
                    err
                );
            });

        return res;
    }

    /**
     * Validates whether an email address is valid or not
     *
     * @param emailAddress The email address to validate
     *
     * @returns A value indicating an email is valid or not
     */
    isValidEmail(emailAddress: string) {
        if (!emailAddress || emailAddress.length === 0) { return false; }

        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
    }

    /**
     * Parses the response from Paynow
     *
     * @param response
     * @returns
     */
    parse(response: Response) {
        if (typeof response === 'undefined') {
            return null;
        }
        if (response) {
            const parsedResponseURL = this.parseQuery((response as unknown) as string);

            if (
                parsedResponseURL.status.toString() !== 'error' &&
                !this.verifyHash(parsedResponseURL)
            ) {
                throw new Error('Hashes do not match!');
            }

            return new InitResponse(parsedResponseURL);
        } else {
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Creates a SHA512 hash of the transactions
     *
     * @param values
     * @param integrationKey
     * @returns
     */
    generateHash(values: { [key: string]: string }, integrationKey: string) {
        let strres = '';

        for (const key of Object.keys(values)) {
            if (key !== 'hash') {
                strres += values[key];
            }
        }

        strres += integrationKey.toLowerCase();

        return sha512(strres).toUpperCase();
    }

    /**
     * Verify hashes at all interactions with server
     *
     * @param values
     */
    verifyHash(values: { [key: string]: string }) {
        if (typeof values.hash === 'undefined') {
            return false;
        } else {
            return values.hash === this.generateHash(values, this.integrationKey);
        }
    }

    /**
     * URL encodes the given string
     *
     * @param str {string}
     * @returns
     */
    urlEncode(url: string) {
        return encodeURI(url);
    }

    /**
     * URL decodes the given string
     *
     * @param str {string}
     * @returns
     */
    urlDecode(url: string) {
        return decodeURIComponent(
            (url + '').replace(/%(?![\da-f]{2})/gi, '%25').replace(/\+/g, '%20')
        );
    }

    /**
     * Parse responses from Paynow
     *
     * @param querystring
     */
    parseQuery(querystring: string) {
        const query: { [key: string]: string } = {};
        const pairs = (querystring[0] === '?'
            ? querystring.substr(1)
            : querystring
        ).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            query[this.urlDecode(pair[0])] = this.urlDecode(pair[1] || '');
        }

        // if(!this.verifyHash(query))
        //         throw new Error("Hash mismatch");
        return query;
    }

    /**
     * Build up a payment into the format required by Paynow
     *
     * @param payment
     * @returns
     */
    build(payment: Payment) {
        const data: { [key: string]: string } = {
            resulturl: this.resultUrl,
            returnurl: this.returnUrl,
            reference: payment.reference,
            amount: payment.total().toString(),
            id: this.integrationId,
            additionalinfo: payment.info(),
            authemail:
                typeof payment.authEmail === 'undefined' ? '' : payment.authEmail,
            status: 'Message'
        };

        for (const key of Object.keys(data)) {
            if (key === 'hash') { continue; }

            data[key] = this.urlEncode(data[key]);
        }

        data.hash = this.generateHash(data, this.integrationKey);

        return data;
    }

    /**
     * Build up a mobile payment into the format required by Paynow
     *
     * @param payment
     * @returns
     */
    buildMobile(
        payment: Payment,
        phone: string,
        method: string
    ): Error | { [key: string]: string } {
        const data: { [key: string]: string } = {
            resulturl: this.resultUrl,
            returnurl: this.returnUrl,
            reference: payment.reference,
            amount: payment.total().toString(),
            id: this.integrationId,
            additionalinfo: payment.info(),
            authemail: payment.authEmail,
            phone,
            method,
            status: 'Message'
        };

        for (const key of Object.keys(data)) {
            if (key === 'hash') { continue; }

            data[key] = this.urlEncode(data[key]);
        }

        data.hash = this.generateHash(data, this.integrationKey);

        return data;
    }

    /**
     * Check the status of a transaction
     *
     * @param url
     * @returns
     */
    async pollTransaction(url: string) {
        const res = await fetch(`${url}`, {
            method: 'POST',
            cache: 'no-cache',
            keepalive: true
        }).then((response: Response) => this.parse(response));

        return res;
    }

    /**
     * Parses the response from Paynow
     *
     * @param response
     * @returns
     */
    parseStatusUpdate(response: any) {
        if (response.length > 0) {
            response = this.parseQuery(response);

            if (!this.verifyHash(response)) {
                throw new Error('Hashes do not match!');
            }

            return new StatusResponse(response);
        } else {
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Validates an outgoing request before sending it to Paynow (data sanity checks)
     *
     * @param payment
     */
    validate(payment: Payment) {
        if (payment.items.length() <= 0) {
            this.fail('You need to have at least one item in cart');
        }

        if (payment.total() <= 0) {
            this.fail('The total should be greater than zero');
        }
    }
}

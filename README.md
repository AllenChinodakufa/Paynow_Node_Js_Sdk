[![Build Status](https://travis-ci.com/paynow/Paynow-NodeJS-SDK.svg?branch=master)](https://travis-ci.com/paynow/Paynow-NodeJS-SDK)


# Node.JS SDK for Paynow Zimbabwe's API

## Sign in to Paynow and get integration details
# My name is Allen Chinodakufa, and I am a full-stack developer.
> Before you can start making requests to Paynow's API, you need to get an integration ID and integration Key from Paynow. 
See Documentation [Generating Integration Key and Viewing integration ID](https://developers.paynow.co.zw/docs/integration_generation.html)

## Documentation

See the [Paynow QuickStart](https://developers.paynow.co.zw/docs/quickstart.html).

## Prerequisites

This library has a set of prerequisites that must be met for it to work

1.  Node version 0.6.0 and above
2.  NPM (node's package manager, used to install the node library)
3.  npm install js-sha512

## Installation

Install the library using NPM or yarn

```sh
$ npm install --save paynow
```
```sh
$ npm install js-sha512
```
```sh
$ yarn add paynow
```

## Usage example

### Importing library

```Typescript
import { Paynow } from 'paynow';
```

Create an instance of the Paynow class optionally setting the result and return url(s)

```TYPESCRIPT
// Set return and result urls
const resultUrl = 'http://example.com/gateways/paynow/update';
const returnUrl = 'http://example.com/return?gateway=paynow&merchantReference=1234';

// Create instance of Paynow class
const paynow = new Paynow("INTEGRATION_ID", "INTEGRATION_KEY", resultUrl, returnUrl);

// Create a new payment
const payment = paynow.createPayment('Invoice 35', 'email');
```

You can then start adding items to the payment

```TYPESCRIPT
// Passing in the name of the item and the price of the item
payment.add("Bananas", 2.5);
payment.add("Apples", 3.4);
```

Once you're done building up your cart and you're finally ready to send your payment to Paynow, you can use the `send` method in the `paynow` object.

```TYPESCRIPT
// Save the response from paynow in a variable
paynow.send(payment);
```

> Mobile Transactions

If you want to send an express (mobile) checkout request instead, the only thing that differs is the last step. You make a call to the `sendMobile` in the `paynow` object
instead of the `send` method.

The `sendMobile` method unlike the `send` method takes in two additional arguments i.e The phone number to send the payment request to and the mobile money method to use for the request. **Note that currently only ecocash is supported**

```TYPESCRIPT
paynow.sendMobile(payment, '0777000000', 'ecocash').then(response => {
  // Handle response
});
```

The response object is almost identical to the one you get if you send a normal request. With a few differences, firstly, you don't get a url to redirect to. Instead you instructions (which ideally should be shown to the user instructing them how to make payment on their mobile phone)

```TYPESCRIPT

paynow.sendMobile(payment, 'phone number', 'ecocash').then((response: any) => {
  console.log(response);

  if (response.success) {
    // These are the instructions to show the user.
    // Instruction for how the user can make payment
    const instructions = response.instructions; // Get Payment instructions for the selected mobile money method

    // Get poll url for the transaction. This is the url used to check the status of the transaction.
    // You might want to save this, we recommend you do it
    const pollUrl = response.pollUrl;

    console.log(instructions);

  } else {
    console.log(response.error);
  }
}).catch(ex => {
  // Ahhhhhhhhhhhhhhh
  // *freak out*
  console.dir('Your application has broken an axle', ex);
});
```

## Full Usage Example

```TYPESCRIPT

import { Paynow } from 'paynow';
// Set return and result urls
const resultUrl = 'http://example.com/gateways/paynow/update';
const returnUrl = 'http://example.com/return?gateway=paynow&merchantReference=1234';

// Create instance of Paynow class
const paynow = new Paynow('12096', '9bc043fc-6344-4145-94b9-c0659a9b0fa3', resultUrl, returnUrl);

// Create a new payment
const payment = paynow.createPayment('Invoice 35', 'allenchinodakufa7@gmail.com');

// Add items to the payment list passing in the name of the item and it's price
this.items.forEach((element: any) => {
  const item = parseFloat((element.quantity * element.price).toFixed(1));
  payment.add(`${element.title}`, item);
});

paynow.sendMobile(payment, '0771899951', 'ecocash').then((response: any) => {
  console.log(response);

  if (response.success) {
    // These are the instructions to show the user.
    // Instruction for how the user can make payment
    const instructions = response.instructions; // Get Payment instructions for the selected mobile money method

    // Get poll url for the transaction. This is the url used to check the status of the transaction.
    // You might want to save this, we recommend you do it
    const pollUrl = response.pollUrl;

    console.log(instructions);

  } else {
    console.log(response.error);
  }
}).catch(ex => {
  // Ahhhhhhhhhhhhhhh
  // *freak out*
  console.dir('Your application has broken an axle', ex);
});
```


## Development 

Like this if you found it helpful or follow me, it takes 1/10 nth of a second to do so, 
Honestly you wont die, just click that button

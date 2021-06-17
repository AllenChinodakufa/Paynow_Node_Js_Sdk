![Image of QPAY By Allen Chinodakufa](https://cdn.dribbble.com/users/7152731/avatars/normal/0f5b6cafca9dec544e84cbc984e51c53.png?1614270459) # QPAY
## Sign in to Paynow and get integration details
#### My name is Allen Chinodakufa, and I am a full-stack developer. I studied the backend of the Paynow Node JS SDK and saw several errors. I removed the majority of these errors, but there are a few I need help from. SDK for IONIC AND REACT developers. If you have any errors with installation contact me at [WhatsApp](tel:+263771899951).
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
$ npm install --save QPay
```
```sh
$ npm install js-sha512
```
```sh
$ yarn add QPay
```

## Usage example

### Importing library

```Typescript
import { Paynow } from 'Qpay';
```

Create an instance of the Paynow class optionally setting the result and return URL(s)

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

Once you're done building up your cart and you're finally ready to send your payment to Paynow, you can use the `send` method in the `pay now object.

```TYPESCRIPT
// Save the response from paynow in a variable
paynow.send(payment);
```

> Mobile Transactions

If you want to send an express (mobile) checkout request instead, the only thing that differs is the last step. You make a call to the `sendMobile` in the `pay now object
instead of the `send` method.

Unlike the `sendMobile` method, the `send` method takes in two additional arguments i.e The phone number to send the payment request to and the mobile money method to use for the request. **Note that currently only EcoCash is supported**

```TYPESCRIPT
paynow.sendMobile(payment, '0777000000', 'ecocash').then(response => {
  // Handle response
});
```

The response object is almost identical to the one you get if you send a normal request. With a few differences, firstly, you don't get a URL to redirect to. Instead your instructions (which ideally should be shown to the user instructing them how to make payment on their mobile phone)

```TYPESCRIPT

paynow.sendMobile(payment, '0777000000', 'ecocash').then((response: any) => {
  console.log(response);

  if (response.success) {
    // These are the instructions to show the user.
    // Instruction for how the user can make payment
    const instructions = response.instructions; // Get Payment instructions for the selected mobile money method

    // Get poll URL for the transaction. This is the URL used to check the status of the transaction.
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
// import QPay
import { Paynow } from 'QPay';

// Set return and result urls
const resultUrl = 'http://example.com/gateways/paynow/update';
const returnUrl = 'http://example.com/return?gateway=paynow&merchantReference=1234';

// Create instance of Paynow class
const paynow = new Paynow("INTEGRATION_ID", "INTEGRATION_KEY", resultUrl, returnUrl);

// Create a new payment
const payment = paynow.createPayment('Invoice 35', 'email');

// Passing in the name of the item and the price of the item
payment.add("Bananas", 2.5);
payment.add("Apples", 3.4);

paynow.sendMobile(payment, '0777000000', 'ecocash').then((response: any) => {
  console.log(response);

  if (response.success) {
    // These are the instructions to show the user.
    // Instruction for how the user can make payment
    const instructions = response.instructions; // Get Payment instructions for the selected mobile money method

    // Get poll URL for the transaction. This is the URL used to check the status of the transaction.
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

_**Like this :point_up: , if you found it helpful or follow me, it takes 1/10 nth of a second to do so, 
Honestly, you won't die, just click that button**_

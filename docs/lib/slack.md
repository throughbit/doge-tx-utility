# slack.js

**Overview**

slack.js is a slack webhook notification module, for those events that require it.

It takes two parameters: data and title.

data: message being passed. 
title: username under which the message is passed (choice is yours).

**Usage**

const slack = require('slack.js');

slack.update("Wallet balance is below threshold brah! Fill that beauty up!", "Wallet-Balance-Notifier");

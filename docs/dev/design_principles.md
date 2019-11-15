# Design Principles

Zextras use a [micro frontends][1] approach to build a framework, agnostic on which application will be created on it.

The whole Zextras ecosystem is composed by many packages, each one has a specific purpose:
* `@zextras/zapp-search`
* `@zextras/zapp-notifications`
* `@zextras/zapp-analytics`
* `@zextras/zapp-error-reporter`
* `@zextras/zapp-mail`
* `@zextras/zapp-user-settings`
* `@zextras/zapp-contacts`
* `@zextras/zapp-calendar`
* `@zextras/zapp-sdk`
* `@zextras/zapp-sdk-loader`
* `@zextras/zapp-shell`

## Goals

The goal of the Zextras project is to create a framework to easily create extension to implement the features of a product.

Zextras shell will only handle the login process and the loading of the extensions once the login process is done by the user.
Zextras itself will also provide a graphical placement of the extensions loaded and share some commons packages with the extensions.

[1]: https://martinfowler.com/articles/micro-frontends.html

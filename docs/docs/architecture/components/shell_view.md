---
title: Shell View
---

The shell view is the core view of the application and has many roles:
- Inject the [Shell Context][1]
- Inject the [App Loader Context][2]
- Render the [Shell Header][3]
- Render the [Shell Container][4]
- Render the [App Board Window][5]

## Shell Context
The role of this component is to hold all the data needed by the shell components.

This data involve mainly the boards and is used by the [App Board Window][5].

## Shell Header
The role of this component is to render the components related to the header.
Like the Logo and the *Create* button.

## Shell Container
The role of this component is to render the main menu, the component formerly known
as *[Secondary bar][6]* and a *[Board Container][7]*.

[1]: #shell-context
[2]: architecture/components/app_loader.md#app-loader-context
[3]: #shell-header
[4]: #shell-container
[5]: architecture/components/app_board_window.md
[6]: architecture/components/secondary_bar.md
[7]: architecture/components/app_board_window.md#board-container

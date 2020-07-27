---
title: App Board Window
---

The role of this component is to render the board as a tabbed view.
The App Board Window is a controller for the tabs.

Each tab has his own [Memory Router][1] to control the user navigation.

## Board Container
A Board Container can be rendered by the App Board Window or directly by the [Shell View][2].

The context passed down to the views is bound to the App context.

[1]: https://reacttraining.com/react-router/web/api/MemoryRouter
[2]: shell_view.md

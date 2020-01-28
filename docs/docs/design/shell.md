---
title: Design of the Shell
---

## Components Involved

Some components may require a version specific for each screen size, that items are marked with the ⚠️ icon.
| n | Component | Notes | View
|:-:|---|---|---
| 1 | Logo | smallLogo | 🖥️ 📱 |
| 2 | Containter | A container. The difference between **Small** and **Large** is the orientation LTR to RTL. | 🖥️ 📱 ⚠️ |
| 3 | Container | A container. <br> **Large**: A row with IconButtons / Buttons and UserQuotaIndicator. <br> **Small**: A list of Buttons and UserQuotaIndicator. | 🖥️ 📱 ⚠️ |
| 4 | PrimaryBar (Part of the NavigationPanel) | A Container (Width 48px, Height 100%-element 8) | 🖥️ |
| 5 | PrimaryBar Item | Main menu handled by the related app: <br> **Large**: Currently selected app. <br> **Small**: The app related to the parent item of the list. | 🖥️ 📱 |
| 6 | AppViewSlot | **Large**: Sizing is limited by the other elements. <br> **Small**: Sizing is 100% of width and height, other elements hovers this slot. | 🖥️ 📱 ⚠️ |
| 7 | IconButton || 📱 |
| 8 | Header | A container for the header. (Height 48px) <br> **Large**: The container has a fixed height and position. <br> **Small**: The container has a fixed height and position, but disappear when the user will scroll down. | 🖥️ 📱 ⚠️ |
| 9 | Quota |  A progress bar which shows the occupied space of a user. <br> The **large** version should have a limited width. | 🖥️ 📱 ⚠️ |
| 10 | UserActions | In **Small** replace the 6th element. | 🖥️ 📱 |
| 11 | IconButton | An icon button which show/hide the element 12. | 🖥️ |
| 12 | MenuPanel | The container of the actions related to the menu button. (Width: 256px)<br> **Large**: The slide panel will slide over element 6 <br> **Small**: It will a view over the element 6. | 🖥️ 📱 ⚠️ |
| 13 | DropdownButton / IconButton | **Large**: Button with a label and a dropdown menu. The action is contestualized to the current app. Into the dropdown menu are listed the actions exposed by the other apps. <br> **Small**: Button which action is contextual to the current app (without dropdown). | 🖥️ 📱 ⚠️ |
| 14 | NavigationPanel (mobile) | A panel which slide over the 6th element. (Width: 256px) | 📱 |
| 15 | Accordion | **Large**: An IconButton. <br> **Small**: An accordion, where 5 is the child for that app. | 🖥️ 📱 ⚠️ |
| 16 | SecondaryBar (part of NavigationPanel) | A container. (Width: 256px) The difference between **Large** and **Small** is the size of the container. | 🖥️ 📱 ⚠️ |

## Wireframes

### Desktop

![desktop-wireframe](assets/design/shell/desktop.png)

### Mobile

![mobile-wireframe](assets/design/shell/mobile.png)

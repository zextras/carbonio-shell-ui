The Avatar component is a representation of another user.

It is a round container which can either contain an user's profile picture or its capitals, and it can have three sizes.

```jsx
import {Container} from '@zextras/zapp-ui';

<Container orientation="horizontal" width="50%" mainAlignment="space-evenly" crossAlignment="flex-end">
    <Avatar
        size="large"
        label="Name Lastname"
    />
    <Avatar
        size="medium"
        label="Name Lastname"
    />
    <Avatar
        size="small"
        label="Name Lastname"
    />
</Container>
```

## With User picture
```jsx
import {Container} from '@zextras/zapp-ui';

<Container orientation="horizontal" width="50%" mainAlignment="space-evenly" crossAlignment="flex-end">
    <Avatar
        size="large"
        label="Name Lastname"
        picture="example.jpg"
    />
    <Avatar
        size="medium"
        label="Another Name"
        picture="example.jpg"
    />
    <Avatar
        size="small"
        label="A Complex Name"
        picture="example.jpg"
    />
</Container>
```
## With Capitals
### letters
The capital letters are calculated as follows:


1. The special characters are removed.
1. If the label is only one or two characters long, it's directly used as capitals.
1. If the label is a single word the result is `first letter + last letter`
1. Otherwise the result is `first letter of the first word + first letter of the last word`
1. The remaining corner cases are handled by displaying a fallback icon

## Icon props
The avatar can display an icon instead of the capitals, when the `icon` prop is provided

```jsx
import {Container, Text} from '@zextras/zapp-ui';
<Container orientation="horizontal" width="50%" mainAlignment="space-evenly" crossAlignment="flex-end">
    <Avatar
        size="large"
        label="A Label"
        icon="BulbOutline"
    />
    <Avatar
        size="large"
        label="Totally legit label"
        icon="AttachOutline"
    />
    <Avatar
        size="large"
        label="XX"
        icon="AgendaOutline"
    />
</Container>
```

### Fallback Icon
This is used as fallback when a label can't be used for the capitals.
```jsx
import {Container, Text} from '@zextras/zapp-ui';
<Container orientation="horizontal" width="50%" mainAlignment="space-evenly" crossAlignment="flex-end">
    <Avatar
        size="large"
        label="."
        fallbackIcon="Activity"
    />
    <Avatar
        size="large"
        label="."
        fallbackIcon="QuestionMarkCircleOutline"
    />
    <Avatar
        size="large"
        label="."
        fallbackIcon="AddressBookOutline"
    />
</Container>
```

### background
The background color is calculated by obtaining the remainder of the integer division between the sum of the charCodes of the label string and the amount of colors available in the avatar color palette.
This value is then used as index for said palette.

```jsx
import {Container} from '@zextras/zapp-ui';
<>
<Container
    orientation="horizontal"
    mainAlignment="space-evenly"
    crossAlignment="flex-end"
>
    <Avatar
        size="large"
        label="Name Lastname"
    />
    <Avatar
        size="large"
        label="LongLastname"
    />
    <Avatar
        size="large"
        label="BU"
    />
    <Avatar
        size="large"
        label="X"
    />
    <Avatar
        size="large"
        label="ALong NAme with $#@^#SPECIAL@$^$%&# %$&Characters#$%"
    />
    <Avatar
        size="large"
        label="$%$^"
    />
</Container>
</>
```

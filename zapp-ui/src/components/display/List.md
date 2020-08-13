Lists are continuous groups of text or images. 
They are composed of items containing primary and supplemental actions, which are represented by icons and text.

To render the list, a factory function is provided to render **only** the children displayed into the viewport.

The List Component uses [`react-virtuoso`](https://virtuoso.dev/virtuoso-api-reference/), and its API can be used.

### The factory function
The factory function must have this signature:
```typescript
function itemFactory(index: number, scrolling: boolean): ReactElement;
```

```jsx
import { Container, Text, Divider } from '@zextras/zapp-ui';
import styled from 'styled-components';
// The factory that defined how an item must be rendered
const data = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

const ContainerEl = styled(Container)`
	&:focus{
		outline: 1px solid #eee;
	}
`;

const itemFactory = ({ index, scrolling }) => {
    return (
    <>
        <ContainerEl
            key={index}
            height="64px"
            orientation="horizontal"
            mainAlignment="flex-start"
            background="gray5"
            padding={{ all: 'small' }}
            tabIndex={0}
        >
            <Container
                width="32px"
                height="32px"
                borderRadius="round"
                background={ scrolling ? 'gray2' : 'highlight' }
            />
            <Container
                width="fit"
                padding={{ all: 'medium' }}
            >
                <Text>{data[index]}</Text>     
            </Container>
        </ContainerEl>
        <Divider color='gray6'/>
    </>
    );
}
// The list will be rendered
<Container height="400px" width="50%" background="gray3">
    <List
        Factory={itemFactory}
        amount={data.length}
    />
</Container>
```
A list can have a header composed by:
- Nothing if no element is selected
- [Checkbox](#checkbox) and [IconButton](#iconbutton)s when one or more elements are selected.
    - The [Checkbox](#checkbox) allow the user to select all of the elements in the list, if the selection is set to unlimited (-1).
    - [IconButton](#iconbutton)s represents the actions that can be done on the selected items.

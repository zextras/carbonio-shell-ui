**Has all the props of the Text component and the props listed above.**

If the *size* prop is not specified, it will have the same font-size of its container.

```jsx
import { Container, Divider, Padding } from '@zextras/zapp-ui';

<>
  <Container padding={{ bottom: 'large'}} crossAlignment="flex-start">
    <Link size="small">Lorem ipsum dolor si amet</Link>
    <Link size="medium" color="error">Lorem ipsum dolor si amet</Link>
    <Link size="large" color="success">Lorem ipsum dolor si amet</Link>
  </Container>
  <Divider />
  <Container padding={{ top: 'large'}} crossAlignment="flex-start">
    <Link weight="bold" size="large" color="warning">Lorem ipsum dolor si amet</Link>
    <Link underlined={true}>Lorem ipsum dolor si amet</Link>
  </Container>
</>
```

```jsx
import { Container, Divider, Paragraph } from '@zextras/zapp-ui';

<>
  <Container padding={{ bottom: 'large' }}>
    <Paragraph size="small">Lorem ipsum dolor sit amet, <Link color="success">consectetur adipiscing</Link> elit. Donec facilisis condimentum finibus. Pellentesque in justo eu odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
    <Paragraph size="small">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis condimentum finibus. Pellentesque <Link underlined={true}>in justo eu</Link> odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
    <Paragraph size="small">Lorem ipsum dolor sit amet, consectetur adipiscing elit. <Link weight="bold">Donec facilisis</Link> condimentum finibus. Pellentesque in justo eu odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
  </Container>
  <Divider />
  <Container padding={{ vertical: 'large' }}>
    <Paragraph>Lorem ipsum dolor sit amet, <Link color="success">consectetur adipiscing</Link> elit. Donec facilisis condimentum finibus. Pellentesque in justo eu odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis condimentum finibus. Pellentesque <Link underlined={true}>in justo eu</Link> odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <Link weight="bold">Donec facilisis</Link> condimentum finibus. Pellentesque in justo eu odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
  </Container>
  <Divider />
  <Container padding={{ vertical: 'large' }}>
    <Paragraph size="large">Lorem ipsum dolor sit amet, <Link color="success">consectetur adipiscing</Link> elit. Donec facilisis condimentum finibus. Pellentesque in justo eu odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
    <Paragraph size="large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis condimentum finibus. Pellentesque <Link underlined={true}>in justo eu</Link> odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
    <Paragraph size="large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. <Link weight="bold">Donec facilisis</Link> condimentum finibus. Pellentesque in justo eu odio venenatis congue. Quisque tincidunt diam nec risus ullamcorper, id condimentum lacus ullamcorper. Suspendisse potenti. Duis metus risus, porttitor ac metus ac, vestibulum euismod nisi.</Paragraph>
  </Container>
</>
```

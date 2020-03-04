### Colors

```jsx noeditor
import Palette from './components/Palette';
import theme from '../src/theme/Theme';

<Palette palette={theme.colors} />;
```

## Sizes

### Font

```jsx noeditor
import theme from '../src/theme/Theme';
import Text from '../src/components/primitive/Text';
import Container from '../src/components/primitive/Container';
import { map } from 'lodash';

<Container orientation="vertical" padding={{ all: 'large' }}>
	{
		map(
			theme.sizes.font,
			(size, key) => (
				<Text key={key} size={key}>This text is {size}</Text>
			)
		)
	}
</Container>;
```

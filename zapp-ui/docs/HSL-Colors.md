### Palette
Usage: `color1-name:#xxxxxx, color2-name:#xxxxxx`
``` jsx harmony
import { Input, Container, Text } from '@zextras/zapp-ui';
import { useState } from 'react';
import Palette from './components/Palette';
import { map, reduce } from 'lodash';
import generateColorMap from '../src/theme/generateColorMap';
const example = 'primary:#2b73d2, secondary:#828282, header:#cfd5dc, divider:#cfd5dc, highlight:#d5e3f6, gray0:#414141, gray1:#828282, gray2:#e6e9ed, gray3:#eeeff3, gray4:#f5f6f8, gray5:#ffffff, warning:#ffc107, error:#d74942, success:#8bc34a, info:#2196d3, text:#333333';
const [color, setColor] = useState(example);
const preTheme = {
    light: reduce(
        color.split(','),
        (acc, pair) => ({
            ...acc,
            [pair.split(':')[0].trim()]: {
                regular: pair.split(':')[1].trim()
            }
        }),
        {}
    ),
    dark: {}
};
const theme = generateColorMap(preTheme);
console.log(JSON.stringify(theme, 0, 2));
<>
    <Input value={color} label="Colors" onChange={(ev) => setColor(ev.target.value.trim())} />
    <Text size="large">
        Light
    </Text>
    <Palette palette={theme.light} />
    <Text size="large">
        Dark
    </Text>
    <div style={{ background: 'black' }}>
        <Palette palette={theme.dark} dark/>
    </div>
</>
```

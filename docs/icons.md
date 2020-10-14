```jsx
import { useState, useContext } from 'react';
import { filter, map } from 'lodash';
import { default as icons } from 'zapp-ui-icons';
import { Icon, Container, Padding, Text, Input, SnackbarManagerContext, SnackbarManager } from '@zextras/zapp-ui';
import styled from 'styled-components';
const iconKeys = Object.keys(icons).sort();
const CustomIcon = styled(Icon)`
    width: 32px;
    height: 32px;
`;
const CustomText = styled(Text)`
    font-family: monospace !important;
    font-size: 10px;
`;
const CustomContainer = styled(Container)`
    border: 1px solid #eee;
    borderWidth: 1px 0 0 1px;
    min-width: 19.9%;
    max-width: 19.9%;
    cursor: pointer;
    &:hover {
        background: ${({ theme }) => theme.palette.highlight.regular}
    }
`;

function copyToClipboard(text, createSnackbar) {
    console.log(2, createSnackbar);

    window.top.navigator.clipboard.writeText(text)
        .then(
            () => {
                createSnackbar(
                    {
                        key: 1,
                        type: 'success',
                        label: 'Copied to clipboard!',
                        autoHideTimeout: 2000
                    }
                );
            }
        );
}
function App() {
    const createSnackbar = useContext(SnackbarManagerContext);
    console.log(1, createSnackbar);
    const [filterStr, setFilter] = useState('');
    return (
        <>
            <Input label="Filter" onChange={(ev) => setFilter(ev.target.value.toLowerCase())}/>
            <Container
                orientation="horizontal"
                height="fit"
                width="fill"
                crossAlignment="center"
                style={{
                    userSelect: 'none',
                    flexWrap: 'wrap',
                    border: '1px solid #eee',
                    borderWidth: '0 1px 1px 0'
                }}
            >
                { map(
                    filter(
                      iconKeys,
                      (key) => key.toLowerCase().includes(filterStr)
                    ),
                    (key) => (
                        <CustomContainer
                            onClick={() => {
                                window.top.navigator.clipboard.writeText(key)
                                    .then(
                                        () => {
                                            createSnackbar(
                                                {
                                                    key: 1,
                                                    type: 'success',
                                                    label: 'Copied to clipboard!',
                                                    autoHideTimeout: 2000
                                                }
                                            );
                                        }
                                    );
                            }}
                            key={key}
                            orientation="vertical"
                            width="20%"
                            mainAlignment="center"
                            padding={{vertical: 'medium'}}
                        >
                            <CustomIcon color="text" size="large" icon={key} />
                            <Padding top="medium"><CustomText> {key} </CustomText></Padding>
                        </CustomContainer> 
                    )
                )}
            </Container>
        </>
    );
}

<>
    <SnackbarManager>
        <App />
    </SnackbarManager>
</>
```

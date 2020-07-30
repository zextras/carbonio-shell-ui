### Single Chat Large
```jsx
import { Container } from '@zextras/zapp-ui';
const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];
<>
    <Container background="gray5" style={{ padding: "20px 14px" }}>
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet diam eget malesuada congue. Maecenas feugiat tellus est, ac hendrerit felis facilisis et.</span>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Praesent vel turpis aliquet, fringilla mi sit amet, sodales massa.</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Duis non cursus lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean at purus euismod, tempus velit in, venenatis ante. Quisque semper luctus tellus, ac facilisis metus porttitor porttitor. Vestibulum quis mollis dui.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Duis maximus massa blandit leo placerat porta.</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Ut ac blandit felis, eu tincidunt dolor. Duis sit amet fermentum nibh. In eget pellentesque tellus. Praesent facilisis nunc ut magna pellentesque.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            message={<>Praesent dignissim urna eu magna tincidunt, vitae accumsan metus fermentum. Nullam vitae urna lacus. Curabitur nisl lectus, luctus vel sodales ut, mollis eu ligula. In dignissim vehicula leo.</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Ok</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Cras nec scelerisque magna, sit amet ultrices neque. Aliquam egestas aliquam.</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<> Nullam scelerisque faucibus libero, in mollis turpis consectetur eu</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="left"
            lastMessageSequence={true}
            message={<>Sed tempor commodo vehicula</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            disableContactName
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Donec orci augue, condimentum nec consectetur sed, luctus quis nisl. Mauris vitae neque et ex hendrerit tincidunt eu ac lorem.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            disableContactName
            actions={items}
        />
    </Container>
</>
```

### Group Chat Large
```jsx
import { Container } from '@zextras/zapp-ui';
const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];

<>
    <Container background="gray5" style={{ padding: "20px 14px" }}>
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet diam eget malesuada congue. Maecenas feugiat tellus est, ac hendrerit felis facilisis et.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Praesent vel turpis aliquet, fringilla mi sit amet, sodales massa.</>}
            date="15:38"
            contactName="John Doe"
            contactColor="2"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Duis non cursus lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean at purus euismod, tempus velit in, venenatis ante. Quisque semper luctus tellus, ac facilisis metus porttitor porttitor. Vestibulum quis mollis dui.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Duis maximus massa blandit leo placerat porta.</>}
            date="15:38"
            contactName="John Smith"
            contactColor="10"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Ut ac blandit felis, eu tincidunt dolor. Duis sit amet fermentum nibh. In eget pellentesque tellus. Praesent facilisis nunc ut magna pellentesque.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            message={<>Praesent dignissim urna eu magna tincidunt, vitae accumsan metus fermentum. Nullam vitae urna lacus. Curabitur nisl lectus, luctus vel sodales ut, mollis eu ligula. In dignissim vehicula leo.</>}
            date="15:38"
            contactName="Richard Doe"
            contactColor="5"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Ok</>}
            date="15:38"
            contactName="Richard Doe"
            contactColor="5"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Cras nec scelerisque magna, sit amet ultrices neque. Aliquam egestas aliquam.</>}
            date="15:38"
            contactName="Richard Doe"
            contactColor="5"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<> Nullam scelerisque faucibus libero, in mollis turpis consectetur eu</>}
            date="15:38"
            contactName="Richard Doe"
            contactColor="5"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="left"
            lastMessageSequence={true}
            message={<>Sed tempor commodo vehicula</>}
            date="15:38"
            contactName="Richard Doe"
            contactColor="5"
            status="viewed"
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Donec orci augue, condimentum nec consectetur sed, luctus quis nisl. Mauris vitae neque et ex hendrerit tincidunt eu ac lorem.</>}
            date="15:38"
            contactName="Jane Doe"
            contactColor="9"
            status="viewed"
            actions={items}
        />
    </Container>
</>
```

### Small Chat
```jsx
import { Container, Text } from '@zextras/zapp-ui';
const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];

<>
    <Container orientation="horizontal" mainAlignment="space-between">
        <div style={{ width: '33%', maxWidth: '400px' }}>
            <Text size="large" weight="bold" style={{ marginBottom: '10px' }}>Single chat</Text>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <Container background="gray5" style={{ padding: '20px 14px'}}>
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet diam eget malesuada congue. Maecenas feugiat tellus est, ac hendrerit felis facilisis et.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Praesent vel turpis aliquet, fringilla mi sit amet, sodales massa.</>}
                        date="15:38"
                        contactName="John Doe"
                        contactColor="2"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Duis non cursus lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean at purus euismod, tempus velit in, venenatis ante. Quisque semper luctus tellus, ac facilisis metus porttitor porttitor. Vestibulum quis mollis dui.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Duis maximus massa blandit leo placerat porta.</>}
                        date="15:38"
                        contactName="John Smith"
                        contactColor="10"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Ut ac blandit felis, eu tincidunt dolor. Duis sit amet fermentum nibh. In eget pellentesque tellus. Praesent facilisis nunc ut magna pellentesque.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        message={<>Praesent dignissim urna eu magna tincidunt, vitae accumsan metus fermentum. Nullam vitae urna lacus. Curabitur nisl lectus, luctus vel sodales ut, mollis eu ligula. In dignissim vehicula leo.</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<>Ok</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<>Cras nec scelerisque magna, sit amet ultrices neque. Aliquam egestas aliquam.</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<> Nullam scelerisque faucibus libero, in mollis turpis consectetur eu</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        lastMessageSequence={true}
                        message={<>Sed tempor commodo vehicula</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Donec orci augue, condimentum nec consectetur sed, luctus quis nisl. Mauris vitae neque et ex hendrerit tincidunt eu ac lorem.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        disableContactName
                        actions={items}
                    />
                </Container>
            </div>
        </div>
        <div style={{ width: '33%', maxWidth: '400px' }}>
            <Text size="large" weight="bold" style={{ marginBottom: '10px' }}>Group chat</Text>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <Container background="gray5" style={{ padding: '20px 14px' }}>
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet diam eget malesuada congue. Maecenas feugiat tellus est, ac hendrerit felis facilisis et.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Praesent vel turpis aliquet, fringilla mi sit amet, sodales massa.</>}
                        date="15:38"
                        contactName="John Doe"
                        contactColor="2"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Duis non cursus lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean at purus euismod, tempus velit in, venenatis ante. Quisque semper luctus tellus, ac facilisis metus porttitor porttitor. Vestibulum quis mollis dui.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Duis maximus massa blandit leo placerat porta.</>}
                        date="15:38"
                        contactName="John Smith"
                        contactColor="10"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Ut ac blandit felis, eu tincidunt dolor. Duis sit amet fermentum nibh. In eget pellentesque tellus. Praesent facilisis nunc ut magna pellentesque.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        message={<>Praesent dignissim urna eu magna tincidunt, vitae accumsan metus fermentum. Nullam vitae urna lacus. Curabitur nisl lectus, luctus vel sodales ut, mollis eu ligula. In dignissim vehicula leo.</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<>Ok</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<>Cras nec scelerisque magna, sit amet ultrices neque. Aliquam egestas aliquam.</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<> Nullam scelerisque faucibus libero, in mollis turpis consectetur eu</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        lastMessageSequence={true}
                        message={<>Sed tempor commodo vehicula</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Donec orci augue, condimentum nec consectetur sed, luctus quis nisl. Mauris vitae neque et ex hendrerit tincidunt eu ac lorem.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                </Container>
            </div>
        </div>
        <div style={{ width: '33%', maxWidth: '400px' }}>
            <Text size="large" weight="bold" style={{ marginBottom: '10px' }}>Attachment chat</Text>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <Container background="gray5" style={{ padding: '20px 14px' }}>
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Ut ac blandit felis, eu tincidunt dolor. Duis sit amet fermentum nibh. In eget pellentesque tellus. Praesent facilisis nunc ut magna pellentesque.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        attachmentOnClick={() => console.log('Trigger download attachment')}
                        attachmentImage="https://i.pinimg.com/originals/db/d6/f9/dbd6f9dcf4a9b2d56635381b2b79d035.jpg"
                        attachmentName="Longlifetoking.jpg"
                        attachmentMime="image/jpg"
                        attachmentSize="302,45 KB"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        firstMessageSequence={true}
                        message={<>Praesent dignissim urna eu magna tincidunt, vitae accumsan metus fermentum. Nullam vitae urna lacus. Curabitur nisl lectus, luctus vel sodales ut, mollis eu ligula. In dignissim vehicula leo.</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<>Ok</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<>Cras nec scelerisque magna, sit amet ultrices neque. Aliquam egestas aliquam.</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        message={<> Nullam scelerisque faucibus libero, in mollis turpis consectetur eu</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="left"
                        lastMessageSequence={true}
                        message={<>Sed tempor commodo vehicula</>}
                        date="15:38"
                        contactName="Richard Doe"
                        contactColor="5"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                    <MessageBubble
                        position="right"
                        firstMessageSequence={true}
                        lastMessageSequence={true}
                        message={<>Donec orci augue, condimentum nec consectetur sed, luctus quis nisl. Mauris vitae neque et ex hendrerit tincidunt eu ac lorem.</>}
                        date="15:38"
                        contactName="Jane Doe"
                        contactColor="9"
                        status="viewed"
                        disableMaxWidth
                        actions={items}
                    />
                </Container>
            </div>
        </div>
    </Container>
</>
```

### Message Types
```jsx
import { Container } from '@zextras/zapp-ui';
const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];

<>
    <Container orientation="horizontal" mainAlignment="space-between" crossAlignment="flex-start">
        <Container
            background="gray5"
            width="400px"
            style={{
                padding: "20px 14px"
            }}
        >
            <MessageBubble
                position="left"
                firstMessageSequence={true}
                message={<>Lorem ipsum dolor sit amet</>}
                date="15:17"
                contactName="John Doe"
                contactColor="2"
                disableContactName
                actions={items}
            />
            <MessageBubble
                position="left"
                message={<>consectetur adipiscing elit.</>}
                date="15:17"
                contactName="John Doe"
                contactColor="2"
                edited
                actions={items}
            />
            <MessageBubble
                position="left"
                lastMessageSequence={true}
                message={<>Mauris nec tempor nisi, ut dictum lorem.</>}
                date="15:17" 
                contactName="John Doe"
                contactColor="2"
                deleted
                actions={items}
            />
            <MessageBubble
                position="right"
                firstMessageSequence={true}
                message={<>Lorem ipsum dolor sit amet</>}
                date="15:17"
                status="viewed"
                actions={items}
            />
            <MessageBubble
                position="right"
                message={<>consectetur adipiscing elit.</>}
                date="15:17"
                status="viewed"
                edited
                actions={items}
            />
            <MessageBubble
                position="right"
                lastMessageSequence={true}
                message={<>Mauris nec tempor nisi, ut dictum lorem.</>}
                date="15:17"
                status="viewed"
                deleted
                actions={items}
            />
            <MessageBubble
                position="left"
                firstMessageSequence={true}
                lastMessageSequence={true}
                message={<>Aenean mattis nisi nec bibendum placerat. Ut sit amet tortor id turpis maximus feugiat.</>}
                date="15:17"
                replyContactName="Jane Doe"
                replymessage={<>consectetur adipiscing elit.</>}
                actions={items}
            />
            <MessageBubble
                position="right"
                message={<>Maecenas in placerat sem. Pellentesque at gravida nulla, a iaculis lorem. Fusce sodales placerat augue, id blandit tellus tincidunt et.</>}
                date="15:17"
                replyContactName="John Doe"
                replymessage={<>Aenean mattis nisi nec bibendum placerat. Ut sit amet tortor id turpis maximus feugiat.</>}
                replyContactColor="3"
                status="sent"
                actions={items}
            />
            <MessageBubble
                position="right"
                lastMessageSequence={true}
                message={<>Cras in metus a augue congue mollis at at massa.</>}
                date="15:17"
                replymessage={<>Lorem ipsum dolor sit amet</>}
                status="sent"
                actions={items}
            />
        </Container>
        <Container
            background="gray5"
            width="400px"
            style={{
                padding: "20px 14px"
            }}
        >
            <MessageBubble
                position="left"
                firstMessageSequence={true}
                message={<>Lorem ipsum dolor sit amet</>}
                date="15:17"
                contactName="John Doe"
                contactColor="2"
                actions={items}
            />
            <MessageBubble
                position="left"
                message={<>consectetur adipiscing elit.</>}
                date="15:17"
                contactName="John Doe"
                contactColor="2"
                edited
                actions={items}
            />
            <MessageBubble
                position="left"
                lastMessageSequence={true}
                message={<>Mauris nec tempor nisi, ut dictum lorem.</>}
                date="15:17" 
                contactName="John Doe"
                contactColor="2"
                deleted
                actions={items}
            />
            <MessageBubble
                position="right"
                firstMessageSequence={true}
                message={<>Lorem ipsum dolor sit amet</>}
                date="15:17"
                status="viewed"
                actions={items}
            />
            <MessageBubble
                position="right"
                message={<>consectetur adipiscing elit.</>}
                date="15:17"
                status="viewed" 
                edited
                actions={items}
            />
            <MessageBubble
                position="right"
                lastMessageSequence={true}
                message={<>Mauris nec tempor nisi, ut dictum lorem.</>}
                date="15:17"
                status="viewed"
                deleted
                actions={items}
            />
            <MessageBubble
                position="left"
                firstMessageSequence={true}
                lastMessageSequence={true}
                message={<>Aenean mattis nisi nec bibendum placerat. Ut sit amet tortor id turpis maximus feugiat.</>}
                date="15:17" 
                contactName="Baby Doe"
                contactColor="6"
                replymessage={<>consectetur adipiscing elit.</>}
                replyContactName="Jane Doe"
                actions={items}
            />
            <MessageBubble
                position="right"
                message={<>Maecenas in placerat sem. Pellentesque at gravida nulla, a iaculis lorem. Fusce sodales placerat augue, id blandit tellus tincidunt et.</>}
                date="15:17"
                replyContactName="Baby Doe"
                replymessage={<>Aenean mattis nisi nec bibendum placerat. Ut sit amet tortor id turpis maximus feugiat.</>}
                replyContactColor="6"
                status="sent"
                actions={items}
            />
            <MessageBubble
                position="right"
                lastMessageSequence={true}
                message={<>Cras in metus a augue congue mollis at at massa.</>}
                date="15:17"
                replymessage={<>Lorem ipsum dolor sit amet</>}
                status="sent"
                actions={items}
            />
        </Container>
    </Container>
</>
```

### Attachment
```jsx
import { Container } from '@zextras/zapp-ui';
const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];

<>
    <Container
        background="gray5"
        width="400px"
        style={{
            padding: "20px 14px"
        }}
    >
        <MessageBubble
            position="left"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            attachmentMime="image/png"
            attachmentName="attachment.png"
            attachmentSize="12KB"
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            lastMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="2"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentImage="https://images.everyeye.it/img-notizie/un-personaggio-game-of-thrones-apparire-house-of-the-dragons-v3-416408-1280x720.jpg"
            attachmentMime="image/png"
            attachmentName="attachment.png"
            attachmentSize="12KB"
            actions={items}
        />

        <MessageBubble
            position="left"
            firstMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            attachmentMime="text/pdf"
            attachmentName="attachment.pdf"
            attachmentSize="12KB"
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentMime="text/pdf"
            attachmentName="attachment.pdf"
            attachmentSize="12KB"
            actions={items}
        />
        <MessageBubble
            position="left"
            lastMessageSequence={true}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentMime="audio/mp3"
            attachmentName="attachment.mp3"
            attachmentSize="12KB"
            actions={items}
        />
        <MessageBubble
            position="right"
            firstMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            attachmentMime="text/pdf"
            attachmentName="attachment.pdf"
            attachmentSize="12KB"
            actions={items}
        />
        <MessageBubble
            position="right"
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentMime="text/pdf"
            attachmentName="attachment.pdf"
            attachmentSize="12KB"
            actions={items}
        />
        <MessageBubble
            position="right"
            lastMessageSequence={true}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            attachmentOnClick={() => console.log('download attachment')}
            attachmentMime="audio/mp3"
            attachmentName="attachment.mp3"
            attachmentSize="12KB"
            actions={items}
        />

        <MessageBubble
            position="left"
            firstMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            replyContactName="Jane Doe"
            replymessage={<>Lorem ipsum dolor sit amet</>}
            replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            replyAttachmentMime="image/jpeg"
            replyAttachmentName="attachment.jpg"
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            replyContactName="Jane Doe"
            replymessage={<>Lorem ipsum dolor sit amet</>}
            replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            replyAttachmentMime="text/pdf"
            replyAttachmentName="attachment.pdf"
            actions={items}
        />
        <MessageBubble
            position="left"
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            replyContactName="Jane Doe"
            replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            replyAttachmentMime="audio/mp3"
            replyAttachmentName="attachment.mp3"
            actions={items}
        />
        <MessageBubble
            position="left"
            lastMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="John Doe"
            contactColor="2"
            replyAttachmentMime="audio/mp3"
            replyAttachmentName="attachment.mp3"
            actions={items}
        />

        <MessageBubble
            position="right"
            firstMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            replyContactName="John Doe"
            replyContactColor="2"
            replymessage={<>Lorem ipsum dolor sit amet</>}
            replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            replyAttachmentMime="image/jpeg"
            replyAttachmentName="attachment.jpg"
            actions={items}
        />
        <MessageBubble
            position="right"
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            replyContactName="Jane Doe"
            replyContactColor="5"
            replymessage={<>Lorem ipsum dolor sit amet</>}
            replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            replyAttachmentMime="text/pdf"
            replyAttachmentName="attachment.pdf"
            actions={items}
        />
        <MessageBubble
            position="right"
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            replyContactName="John Doe"
            replyContactColor="2"
            replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
            replyAttachmentMime="audio/mp3"
            replyAttachmentName="attachment.mp3"
            actions={items}
        />
        <MessageBubble
            position="right"
            lastMessageSequence={true}
            message={<>Lorem ipsum dolor sit amet</>}
            date="15:17"
            contactName="Jane Doe"
            contactColor="4"
            replyAttachmentMime="audio/mp3"
            replyAttachmentName="attachment.mp3"
            actions={items}
        />
    </Container>
</>
```

### ReplyMessage
```jsx
import { Container } from '@zextras/zapp-ui';
import { ReplyMessage } from './MessageBubble';

<>
    <ReplyMessage
        message={<>Messaggio di ritorno</>}
        position="right"
        contactColor="9"
        contactName="Sonny"
        replyAttachmentImage="https://wips.plug.it/cips/buonissimo.org/cms/2018/09/Parmigiana-light.jpg"
        attachmentMime="text/pdf"
        attachmentName="asdadsasd.pdf"
    />
</>
```

### Message statuses
```jsx
import { Container } from '@zextras/zapp-ui';
const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];

<>
    <Container
        background="gray5"
        width="400px"
        style={{
            padding: "20px 14px"
        }}
    >        
        <MessageBubble
            position="right"
            message={<>Message status 'pending'</>}
            date="15:17"
            status="pending"
            actions={items}
        />
        <MessageBubble
            position="right"
            message={<>Message status 'sent'</>}
            date="15:17"
            status="sent"
            actions={items}
        />
        <MessageBubble
            position="right"
            message={<>Message status 'received'</>}
            date="15:17"
            status="received"
            actions={items}
        />
        <MessageBubble
            position="right"
            lastMessageSequence={true}
            message={<>Message status 'viewed'</>}
            date="15:17"
            status="viewed"
            actions={items}
        />
    </Container>
</>
```

### Attachment Error
```jsx
import { Container } from '@zextras/zapp-ui';

<>
  <Container
    background="gray5"
    width="400px"
    style={{
      padding: "20px 14px"
    }}
  >
    <MessageBubble
        position="left"
        lastMessageSequence={true}
        message={<>Message status 'viewed'</>}
        date="15:17"
        status="viewed"
        attachmentOnClick={() => console.log('Trigger download attachment')}
        attachmentImage="https://i.pinimg.com/originals/db/d6/f9/dbd6f9dcf4a9b2d5663581b2b79d035.jpg"
        attachmentName="Longlifetoking.jpg"
        attachmentMime="image/jpg"
        attachmentSize="302,45 KB"
        edited={true}
    />
    <MessageBubble
        position="left"
        lastMessageSequence={true}
        message={<>Message status 'viewed'</>}
        date="15:17"
        status="viewed"
        attachmentDeleted={true}
        attachmentOnClick={() => console.log('Trigger download attachment')}
        attachmentImage="https://i.pinimg.com/originals/db/d6/f9/dbd6f9dcf4a9b2d5663581b2b79d035.jpg"
        attachmentName="Longlifetoking.jpg"
        attachmentMime="image/jpg"
        attachmentSize="302,45 KB"
        edited={true}
    />
  </Container>
</>
```
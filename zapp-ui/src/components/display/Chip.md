A Chip element shows the contact selected in a specific way or it can simply work as a label.

The Avatar and the close icon are optional.

### Contacts Chip

```jsx
<>
    <div>
        <Chip label="Walter White" onClose={() => console.log('closed')} />
        <Chip label="Jessy Pinkman" closable />
        <Chip label="Tuco" />
        <Chip label="Skyler" hasAvatar={false} />
        <Chip label="Gus Fring" picture="https://mail.zextras.com/service/home/~/?auth=co&loc=en_US&id=2977&part=4" />
    </div>
</>
```
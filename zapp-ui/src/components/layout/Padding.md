Vertical Padding
```jsx
<div style={{ border: '1px solid black' }}>
    <Padding vertical="small">
        <div style={{ backgroundColor: 'grey', height: '10px', width: '10px' }}/>
    </Padding>
</div>
```

Horizontal Padding
```jsx
<div style={{ border: '1px solid black' }}>
    <Padding horizontal="small">
        <div style={{ backgroundColor: 'grey', height: '10px' }}/>
    </Padding>
</div>
```

Selective Padding
```jsx
<div style={{ border: '1px solid black' }}>
    <Padding top="extrasmall" right="small" bottom="small" left="extrasmall">
        <div style={{ backgroundColor: 'grey', height: '10px' }}/>
    </Padding>
</div>
```

Padding through value
```jsx
<div style={{ border: '1px solid black' }}>
    <Padding value="10px small extralarge">
        <div style={{ backgroundColor: 'grey', height: '10px' }}/>
    </Padding>
</div>
```

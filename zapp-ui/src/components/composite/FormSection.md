The form section has a title, at least one row and  can contain a divider.

A row can contain Inputs, selects and buttons.

Form sections can be nested and preserve a proportional indentation.
```jsx
import { FormRow } from './FormSection';
import { Input } from '@zextras/zapp-ui';
<FormSection label="Form Section" background="gray5">
    <FormRow><Input label="aaa"/></FormRow>
    <FormRow><Input label="bbb"/></FormRow>
    <FormRow><Input label="ccc"/></FormRow>
    <FormSection level="1" label="another form!">
        <FormRow>
            <Input label="hi"/>
        </FormRow>
    </FormSection>
</FormSection>
```

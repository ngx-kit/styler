# Angular Styler

Angular Typestyle integration. Write CSS in TypeScript.

## Install

`npm install @ngx-kit/styler typestyle --save`

## Usage

### Provide module

```typescript
import { StylerModule } from '@ngx-kit/styler';
...
@NgModule({
  imports: [
      ...
      StylerModule,
...
```

### Add styles to component

```typescript
...
@Component({
  ...
  viewProviders: [StylerService]
  ...
  constructor(private styler: StylerService) {
    this.styler.register({
      wrapper: {
        background: '#ffffff',
        color: 'red',
      },
      inside: {
        color: 'yellow',
        fontSize: '2rem',
      }
    });
    ...
```

### Use styles in template

```html
<div styler="wrapper">
  <div styler="inside">
  </div>
</div>
```

## Cases

### :host styling

```typescript
  ...
  @HostBinding('class') get hostClass() {
    return this.styler.getHostClass();
  };
  ...
  constructor(private styler: StylerService) {
    this.styler.register({
      host: {
        border: '1px solid green',
        paddin: 8,
      },
    });
    ...
```

### Move styles to a separate file

TBD

### Component state styling

TBD
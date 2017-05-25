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
        padding: 8,
      },
    });
    ...
```

### Register media styles

```typescript
this.styler.register({
  ...
  $media: [
    [{minWidth:0, maxWidth:600}, {
      background: 'yellowgreen',
    }],
    [{minWidth:601}, {
      background: 'skyblue',
    }],
  ],
});
```

### Element state styling

Define element states:
 
```typescript
this.styler.register({
  host: {
    ...
  },
  panel: {
    border: '1px solid green',
    $states: {
      size: {
        small: {
          padding: 2,
        },
        medium: {
          padding: 4,
        },
        large: {
          padding: 8,
        },
        $default: 'medium',
      },
      ...
    }
  },
  ...
});
```

Set state via service:

```typescript
this.styler.setState('panel', {size: 'small'});
```

Or set state with `styler` directive:

```html
<div [styler]="['panel', {size: 'small'}]"></div>
```

### Move styles to a separate file

TBD
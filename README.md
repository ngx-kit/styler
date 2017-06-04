# Angular Styler

Angular Typestyle integration. Write CSS in TypeScript.

Currently in a deep beta!

## Install

`npm install @ngx-kit/styler --save`

## Usage

### Provide module

```typescript
import { StylerModule } from '@ngx-kit/styler';
...
@NgModule({
  imports: [
      ...
      StylerModule.forRoot(),
...
```

Use import with `.forRoot()` only once on the top level.

### Add styles to component

```typescript
...
@Component({
  ...
  viewProviders: [StylerComponent]
  ...
  constructor(private styler: StylerComponent) {
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
  @HostBinding('attr.sid') get sid() {
    return this.styler.host.sid;
  };
  ...
  constructor(private styler: StylerComponent) {
    this.styler.register({
      host: {
        border: '1px solid green',
        padding: 8,
      },
    });
    ...
```

### Nested styles
 
TBD

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
      // multi-state
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
      // bool-state
      disabled: {
        color: '#666',
        background: '#999'
      },
      ...
    }
  },
  ...
});
```

Set state via service for host:

```typescript
this.styler.host.applyState({size: 'small'});
```

Or set state with `styler` directive:

```html
<div [styler]="['panel', {size: 'small'}]"></div>
```

### Move styles to a separate file

TBD

### Fallback styles

TBD

### Smart styles

TBD

### Mixins

TBD

## Services

### StylerColorService

Service for color manipulating.

```ts
import { StylerColorService } from '@ngx-kit/styler';
...
constructor(private color: StylerColorService) {
}
...
background: this.darken(0.2, someColorVar),
```

* `adjustHue`
* `complement`
* `darken`
* `desaturate`
* `grayscale`
* `hsl`
* `hsla`
* `invert`
* `lighten`
* `mix`
* `opacify`
* `rgb`
* `rgba`
* `saturate`
* `setHue`
* `setLightness`
* `setSaturation`
* `shade`
* `tint`
* `toColorString`
* `transparentize`



[![Build Status](https://travis-ci.org/ngx-kit/styler.svg?branch=master)](https://travis-ci.org/ngx-kit/styler)
[![npm version](https://badge.fury.io/js/%40ngx-kit%2Fstyler.svg)](https://www.npmjs.com/@ngx-kit/styler)
[![Join Discord](http://ngx-kit.com/discord-badge.svg)](https://discord.gg/t2EN9bB)

# Angular Styler

Keep CSS in TypeScript.

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

Just define host element:

```typescript
this.styler.register({
  host: {
    display: 'flex',
    flexDirection: 'column',
  },
});
```

### Nested styles
 
```typescript
this.styler.register({
  wrapper: {
    $nest: {
      '&:hover': {
        background: 'grey',
      },
      '& a': {
        textDecoration: 'none',
      },
    },
  },
});
```

### Register media styles

TBD

### Element state styling

Define element states:
 
```typescript
constructor(private def: StylerDefService)
...
this.styler.register({
  host: {
    ...
  },
  panel: (state) => {
    border: '1px solid green',
    // multi-state
    ...this.def.pick(state.size, {
      small: {
        padding: 2,
      },
      medium: {
        padding: 4,
      },
      large: {
        padding: 8,
      },
    }, 'medium'),
    // bool-state
    ...this.def.toggle(state.disabled, {
      color: '#666',
      background: '#999'
    }),
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

Provide styler view built-it module method:

```typescript
@Component({
  ...
  viewProviders: [StylerModule.forComponent(NameStyle)],
```

Define style injectable:

```typescript
import { Injectable } from '@angular/core';
import { ComponentStyle, StylerDefService, StyleDef } from '@ngx-kit/styler';

@Injectable()
export class NameStyle implements ComponentStyle {
  
  constructor(private def: StylerDefService) {
  }
  
  host(): StyleDef {
    return {
      display: 'block',
    };
  }
  
  wrapper(): StyleDef {
    return {
      background: '#ffffff',
      color: 'red',
    };
  }
  
  // state handling
  panel(state): StyleDef {
    return {
      border: '1px solid green',
      // multi-state
      ...this.def.pick(state.size, {
        small: {
          padding: 2,
        },
        medium: {
          padding: 4,
        },
        large: {
          padding: 8,
        },
      }, 'medium'),
      // bool-state
      ...this.def.toggle(state.disabled, {
        color: '#666',
        background: '#999'
      }),
    };
  };
  
}
```

### Fallback styles

TBD

### Smart styles

* `padding: [10, 20] => padding: '10px 20px'`
* `padding: {top: 10, left: 30} => paddingTop: '10px', paddingLeft: '30px'`
* `margin: [10, 20, 30] => padding: '10px 20px 30px'`
* `border: [1, 'solid', 'blue] => border: '1px solid blue'`

### Mixins

TBD

### @keyframes

```typescript
constructor(private styler: StylerComponent) {
  this.styler.register({
    host: {
      animationDuration: '1s',
      animationName: this.styler.keyframes({
        '0%': {
          transform: 'rotate(0deg)',
        },
        '100%': {
          transform: 'rotate(360deg)',
        },
      }),
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  });
}
```

### Automatically add classes

Styler can add classes to elements. Class attribute based on component name (should be setted), element name and element state.

Provide `BemClassGenStrategy`:

```typescript
providers: [
  {
    provide: ClassGenStategy,
    useClass: BemClassGenStrategy,
  },
],
```

Set component name:

```typescript
constructor(private styler: StylerComponent) {
  this.styler.classPrefix = 'component-name';
}
```

## Services

### `StylerDefService`

* `pick(state: string, styles, default?: string)` - returns styles[state|default] 
* `toggle(state: boolean, styles)` - returns styles if state is true
* `merge` - js deepMerge, needed if states have $nest props

### `StylerColorService`

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



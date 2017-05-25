import { StylerService } from '../package/src/styler.service';

const styler = new StylerService();

styler.elements = [
  {
    name: 'host',
    style: {
      background: 'red',
      color: 'white',
    },
    states: [
      {
        name: 'size',
        values: [
          {
            value: 's',
            style: {
              padding: 2,
            }
          },
          {
            value: 'l',
            style: {
              padding: 16,
            }
          }
        ],
        currentValue: null,
      }
    ]
  }
];

styler.register({
  host: {
    background: 'red',
    color: 'white',
    $states: {
      size: {
        s: {
          padding: 2,
        },
        l: {
          padding: 16,
        }
      }
    }
  }
});

styler.register({
  host: {
    background: 'red',
    color: 'white',
  }
});

styler.register({
  host: {
    background: 'red',
    color: 'white',
    $media: [
      [
        {minWidth: 500},
        {
          alignItems: 'center',
          padding: 0,
        }
      ],
    ]
  }
});

styler.getClass('host');

styler.setState('host', {size: 's'});

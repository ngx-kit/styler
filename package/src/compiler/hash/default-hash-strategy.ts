import { Injectable } from '@angular/core';
import { HashStrategy } from './hash-strategy';

@Injectable()
export class DefaultHashStrategy implements HashStrategy {
  hash(input: string): string {
    let value = 5381;
    let i = input.length;
    while (i) {
      value = (value * 33) ^ input.charCodeAt(--i)
    }
    return (value >>> 0).toString(36);
  }
}

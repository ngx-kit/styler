import { StyleDef } from '../../meta/def';
import { mergeDeepAll } from '../../utils/merge-deep';

export function defMerge(chunks: StyleDef[]): StyleDef {
  return mergeDeepAll(chunks);
}

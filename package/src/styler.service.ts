import { Injectable } from '@angular/core';

import { StylerCompilerService } from './compiler/compiler.service';

@Injectable()
export class StylerService {

  constructor(private compiler: StylerCompilerService) {
  }

}

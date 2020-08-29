import { Controller, Get } from '@nestjs/common';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

@Controller()
export class AppController {
  @Get()
  getPromos(): any {
    return this.scrapeMetatags();
  }

  scrapeMetatags = async () => {
    const xkomUrl = 'https://www.x-kom.pl/';
    const res = await fetch(xkomUrl);
    const html = await res.text();
    const $ = cheerio.load(html);
    let itemName = '';
    let costWas = 0;
    let costIs = 0;

    $('div')
      .attr('id', 'pageWrapper')
      .find('div')
      .attr('id', 'container')
      .find('div')
      .attr('id', 'app')
      .find('div')
      .each(function(index, element) {
        if (index == 420) {
          itemName = $(this)
            .text()
            .split('zł')[1];
        }
        if (index == 426) {
          costWas = $(this)
            .text()
            .split('zł')[0];
          costIs = $(this)
            .text()
            .split('zł')[1];
        }
      });

    const ceneoUrl =
      'https://www.ceneo.pl/;szukaj-' + itemName.split(' ').join('+');

    return {
      itemName,
      costWas,
      costIs,
      ceneoUrl,
      xkomUrl,
    };
  };
}

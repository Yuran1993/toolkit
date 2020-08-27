// require('dotenv').config();
// const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor() { }

  addToolsReq(tools) {
    const toolsToAdd = Object.keys(tools) //.forEach(e => console.log(e));
    console.log(toolsToAdd);
  }
}

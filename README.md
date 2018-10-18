# NodeJS Translation module, that can be used for Agents like Actions On Google or Dialogflow Fulfillment Library

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

This module is a basic nodejs module allowing you to handle translations for your app.
The specificity is that you can easily handle multiple translation values for 1 given key. In that case, the module will return randomly one of the value. This is quite usefull for creation of an agent app with [Dialogflow Fulfillment Library](https://github.com/dialogflow/dialogflow-fulfillment-nodejs), or [Actions of Google](https://www.npmjs.com/package/actions-on-google) for example.

```text
├── src/
│   ├── locales/
│   │   ├── fr-fr.json
│   │   └── en-us.json

```

```json
{
    "KEY_1":"Hey, this is my translation key for key 1",
    "KEY_2":[
        "Ok, I am first translation option for key 2",
        "Hey, I am the second option for key 2",
        "yop... and I am... well... the third option"
    ]
}```

Then you can use it easily :
`translate("KEY_1")` ==> "Hey, this is my translation key for key 1" 
or 

`translate("KEY_2")` ==> returns randomly   "Ok, I am first translation option for key 2" or "Hey, I am the second option for key 2", or "yop... and I am... well... the third option"


## npm
`npm install agent-translate`


## usage
` const translate = require('agent-translate');
  const i18n = translate.init('en-us');
  return i18n("KEY_1");
`

### options
```js
translate.config({
  'locales_directory':'my/specific/locales/directory', //default is {{projectRoot}}/locales
  'default_locale':'en-us' //default is 'fr-fr'
  })
```
  
  `const i18n = translate.init('en-us');` => will look for 'my/specific/locales/directory/en-us.json
  `const i18n2 = translate.init('fr-fr');` => will look for 'my/specific/locales/directory/fr-fr.json
  `const i18n3 = translate.init('unknown');` => will look for 'my/specific/locales/directory/en-us.json', set here as 'default_locale
 
### usage with [dialogflow-fulfillment-nodejs](https://github.com/dialogflow/dialogflow-fulfillment-nodejs)

```js
const translate = require('agent-translate');
  
  exports.myAssistantWebhook = functions.https.onRequest((request, response) => {

    //Create an instance
    const agent = new WebhookClient({request: request, response: response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    const welcome = (agent) => {
        //configure translation function attached to the agent
        // note : you must make sure there is a resource json locale file for agent.locale
        agent.__ = translate.init(agent.locale);
        
        //you can now generate a tranlsation value attached to current agent's locale
        agent.add(agent.__('KEY_2'));
    }
  }
```

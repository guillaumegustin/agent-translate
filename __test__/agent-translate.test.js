const translate = require('../index.js');
translate.config({'locales_directory':'__test__/locales'})

test('init french locale', () => {
    const i18n = translate.init('en-us');
    expect(i18n("KEY_1")).toBe('Hey, this is my translation key for key 1');

});

test('init uknown local should return fr-fr locale by default', () => {
    const i18n = translate.init('unknown');
    expect(i18n("KEY_1")).toBe('Hey, ceci est ma traduction pour key 1');
});

test('changing default locale', () => {
    translate.config({'default_locale':'en-us'});
    const i18n = translate.init('unknown');
    expect(i18n("KEY_1")).toBe('Hey, this is my translation key for key 1');
});

test('Testing multi values key returing a random value from the list', () => {
    const i18n = translate.init('fr-fr');
    const translatedKey2 = i18n("KEY_2");
    expect(translatedKey2==='Ok, je suis la première option pour key 2'
            || translatedKey2==='Hey, je suis la seconde option pour key 2'
            || translatedKey2==='yop... et moi... et bien... la 3eme option').toBeTruthy();
});

test('Testing with wrong default locales directory', () => {
    //this should just log a warning as not existing directory should be ignored.
    translate.config({'locales_directory':'not/existing/path'});
    const i18n = translate.init('fr-empty');
    expect(i18n("KEY_1")).toBe('Hey, this is my translation key for key 1');
});

test('Testing with a default directory that exists but contains no data', ()=> {
    translate.config({'locales_directory':'__test__/empty'});
    const i18n = translate.init('fr-empty'); // should still use default file
    expect(i18n("KEY_1")).toBe('Hey, this is my translation key for key 1');
});
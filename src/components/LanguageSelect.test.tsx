import { fireEvent, render } from '@solidjs/testing-library';
import LanguageSelect from './LanguageSelect';
import { LocaleProvider, useTranslate } from '../providers/locale';

describe('<LanguageSelect>', () => {
  it('changes the language', async () => {
    const locales: Record<string, object> = {
      eo: {
        hello: 'saluton',
      },
      vo: {
        hello: 'glidis',
      },
    };

    const options = {
      eo: 'Esperanto',
      vo: 'Volapük',
    };

    const Hello = () => {
      const translate = useTranslate();
      return <div data-testid="hello">{translate('hello')}</div>;
    };

    const { getByRole, getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        initialDictionary={locales.eo}
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
        <LanguageSelect options={options} />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    const select = getByRole('combobox');
    expect(hello).toHaveTextContent(/^saluton$/u);
    fireEvent.change(select, { target: { value: 'vo' } });
    // Calling async functions
    await Promise.resolve();
    await Promise.resolve();
    expect(hello).toHaveTextContent(/^glidis$/u);
  });
});

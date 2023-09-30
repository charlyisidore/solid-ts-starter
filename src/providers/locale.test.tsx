import { For } from 'solid-js';
import { fireEvent, render } from '@solidjs/testing-library';
import { LocaleProvider, useLanguage, useTranslate } from './locale';

describe('locale provider', () => {
  it('throws LocaleContext not found', async () => {
    expect(() =>
      render(() => {
        const translate = useTranslate();
        return <>{translate('hello')}</>;
      }),
    ).toThrow(/LocaleContext/u);
  });

  it('shows a string translation', async () => {
    const locales: Record<string, object> = {
      eo: {
        hello: 'saluton',
      },
    };

    const Hello = () => {
      const translate = useTranslate();
      return <div data-testid="hello">{translate('hello')}</div>;
    };

    const { getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        initialDictionary={locales.eo}
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveTextContent(/^saluton$/u);
  });

  it('shows a function translation', async () => {
    const locales: Record<string, object> = {
      eo: {
        hello: ({ name }: { name: string }) => `saluton ${name}`,
      },
    };

    const Hello = () => {
      const translate = useTranslate();
      return (
        <div data-testid="hello">{translate('hello', { name: 'mondo' })}</div>
      );
    };

    const { getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        initialDictionary={locales.eo}
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveTextContent(/^saluton mondo$/u);
  });

  it('shows a nested translation', async () => {
    const locales: Record<string, object> = {
      eo: {
        button: {
          hello: 'saluton',
        },
      },
    };

    const Hello = () => {
      const translate = useTranslate();
      return <div data-testid="hello">{translate('button.hello')}</div>;
    };

    const { getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        initialDictionary={locales.eo}
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveTextContent(/^saluton$/u);
  });

  it('shows the translation key as fallback', async () => {
    const locales: Record<string, object> = {
      eo: {},
    };

    const Hello = () => {
      const translate = useTranslate();
      return <div data-testid="hello">{translate('hello')}</div>;
    };

    const { getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        initialDictionary={locales.eo}
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveTextContent(/^hello$/u);
  });

  it('fetches initial dictionary', async () => {
    const locales: Record<string, object> = {
      eo: {
        hello: 'saluton',
      },
    };

    const Hello = () => {
      const translate = useTranslate();
      return <div data-testid="hello">{translate('hello')}</div>;
    };

    const { getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    // Calling async functions
    await Promise.resolve();
    await Promise.resolve();
    expect(hello).toHaveTextContent(/^saluton$/u);
  });

  it('changes the language', async () => {
    const locales: Record<string, object> = {
      eo: {
        hello: 'saluton',
      },
      vo: {
        hello: 'glidis',
      },
    };

    const Hello = () => {
      const translate = useTranslate();
      return <div data-testid="hello">{translate('hello')}</div>;
    };

    const LanguageSelect = () => {
      const [language, setLanguage] = useLanguage();
      const handleChange = (event: Event) =>
        setLanguage((event.target as HTMLSelectElement).value);
      return (
        <select data-testid="select" onChange={handleChange}>
          <For each={Object.keys(locales)}>
            {(code) => (
              <option value={code} selected={code === language()}>
                {code}
              </option>
            )}
          </For>
        </select>
      );
    };

    const { getByTestId } = render(() => (
      <LocaleProvider
        initialLanguage="eo"
        initialDictionary={locales.eo}
        fetchDictionary={(language) => locales[language]}
      >
        <Hello />
        <LanguageSelect />
      </LocaleProvider>
    ));

    const hello = getByTestId('hello');
    const select = getByTestId('select');
    expect(hello).toHaveTextContent(/^saluton$/u);
    fireEvent.change(select, { target: { value: 'vo' } });
    // Calling async functions
    await Promise.resolve();
    await Promise.resolve();
    expect(hello).toHaveTextContent(/^glidis$/u);
  });
});

import { For } from 'solid-js';
import { fireEvent, render } from '@solidjs/testing-library';
import { type Theme, ThemeProvider, useStyles, useTheme } from './theme';

describe('theme provider', () => {
  it('throws ThemeContext not found', async () => {
    expect(() =>
      render(() => {
        const styles = useStyles('Hello');
        return <>{styles('content')}</>;
      }),
    ).toThrow(/ThemeContext/u);
  });

  it('applies styles from string', async () => {
    const themes: Record<string, Theme> = {
      light: {
        Hello: {
          content: 'light_content',
          text: 'light_text',
        },
      },
    };

    const Hello = () => {
      const styles = useStyles('Hello');
      return (
        <div data-testid="hello" class={styles('content text')}>
          Hello
        </div>
      );
    };

    const { getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveClass('light_content light_text', { exact: true });
  });

  it('applies styles from array', async () => {
    const themes: Record<string, Theme> = {
      light: {
        Hello: {
          content: 'light_content',
          text: 'light_text',
        },
      },
    };

    const Hello = () => {
      const styles = useStyles('Hello');
      return (
        <div data-testid="hello" class={styles(['content', undefined, 'text'])}>
          Hello
        </div>
      );
    };

    const { getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveClass('light_content light_text', { exact: true });
  });

  it('applies styles from object', async () => {
    const themes: Record<string, Theme> = {
      light: {
        Hello: {
          content: 'light_content',
          text: 'light_text',
        },
      },
    };

    const Hello = () => {
      const styles = useStyles('Hello');
      return (
        <div data-testid="hello" class={styles({ content: true, text: false })}>
          Hello
        </div>
      );
    };

    const { getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveClass('light_content', { exact: true });
  });

  it('applies styles from undefined', async () => {
    const themes: Record<string, Theme> = {
      light: {
        Hello: {},
      },
    };

    const Hello = () => {
      const styles = useStyles('Hello');
      return (
        <div data-testid="hello" class={styles(undefined)}>
          Hello
        </div>
      );
    };

    const { getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).not.toHaveClass();
  });

  it('applies default styles', async () => {
    const themes: Record<string, Theme> = {
      light: {
        Hello: {
          content: 'light_content',
        },
      },
    };

    const defaultStyles = {
      content: 'default_content',
    };

    const Hello = () => {
      const styles = useStyles('Hello', defaultStyles);
      return (
        <div data-testid="hello" class={styles('content')}>
          Hello
        </div>
      );
    };

    const { getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    expect(hello).toHaveClass('default_content light_content', { exact: true });
  });

  it('fetches a theme', async () => {
    const themes: Record<string, Theme> = {
      light: {
        Hello: {
          content: 'light_content',
        },
      },
      dark: {
        Hello: {
          content: 'dark_content',
        },
      },
    };

    const Hello = () => {
      const styles = useStyles('Hello');
      return (
        <div data-testid="hello" class={styles('content')}>
          Hello
        </div>
      );
    };

    const ThemeSelect = () => {
      const [theme, setTheme] = useTheme();
      const handleChange = (event: Event) =>
        setTheme((event.target as HTMLSelectElement).value);
      return (
        <select data-testid="select" onChange={handleChange}>
          <For each={Object.keys(themes)}>
            {(identifier) => (
              <option value={identifier} selected={identifier === theme()}>
                {identifier}
              </option>
            )}
          </For>
        </select>
      );
    };

    const { getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
        <ThemeSelect />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    const select = getByTestId('select');
    expect(hello).toHaveClass('light_content', { exact: true });
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(hello).toHaveClass('dark_content', { exact: true });
  });
});

import { fireEvent, render } from '@solidjs/testing-library';
import ThemeSelect from './ThemeSelect';
import { type Theme, ThemeProvider, useStyles } from '../providers/theme';

describe('<ThemeSelect>', () => {
  it('changes the theme', async () => {
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

    const options = {
      light: 'Light',
      dark: 'Dark',
    };

    const Hello = () => {
      const styles = useStyles('Hello');
      return (
        <div data-testid="hello" class={styles('content')}>
          Hello
        </div>
      );
    };

    const { getByRole, getByTestId } = render(() => (
      <ThemeProvider
        initialTheme="light"
        initialInstance={themes.light}
        fetchTheme={(theme) => themes[theme]}
      >
        <Hello />
        <ThemeSelect options={options} />
      </ThemeProvider>
    ));

    const hello = getByTestId('hello');
    const select = getByRole('combobox');
    expect(hello).toHaveClass('light_content', { exact: true });
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(hello).toHaveClass('dark_content', { exact: true });
  });
});

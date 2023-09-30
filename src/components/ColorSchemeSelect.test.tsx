import { fireEvent, render } from '@solidjs/testing-library';
import ColorSchemeSelect from './ColorSchemeSelect';
import { ColorSchemeProvider, useColorScheme } from '../providers/color-scheme';

describe('<ColorSchemeSelect>', () => {
  it('changes the color scheme', async () => {
    const options = {
      light: 'Light',
      dark: 'Dark',
    };

    const Hello = () => {
      const [colorScheme] = useColorScheme();
      return (
        <div data-testid="hello" class={colorScheme()}>
          Hello
        </div>
      );
    };

    const { getByRole, getByTestId } = render(() => (
      <ColorSchemeProvider initialColorScheme="light">
        <Hello />
        <ColorSchemeSelect options={options} />
      </ColorSchemeProvider>
    ));

    const hello = getByTestId('hello');
    const select = getByRole('combobox');
    expect(hello).toHaveClass('light', { exact: true });
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(hello).toHaveClass('dark', { exact: true });
  });
});

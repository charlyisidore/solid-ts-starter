import { fireEvent, render } from '@solidjs/testing-library';
import { ColorSchemeProvider, useColorScheme } from './color-scheme';

describe('color scheme provider', () => {
  it('throws ColorSchemeContext not found', async () => {
    expect(() =>
      render(() => {
        const [colorScheme] = useColorScheme();
        return <>{colorScheme()}</>;
      }),
    ).toThrow(/ColorSchemeContext/u);
  });

  it('changes color scheme', async () => {
    const DarkModeSwitch = () => {
      const [colorScheme, setColorScheme] = useColorScheme();
      return (
        <button data-testid="button" onClick={() => setColorScheme('dark')}>
          {colorScheme()}
        </button>
      );
    };

    const { getByTestId } = render(() => (
      <ColorSchemeProvider initialColorScheme="light">
        <DarkModeSwitch />
      </ColorSchemeProvider>
    ));

    const button = getByTestId('button');
    expect(button).toHaveTextContent(/^light$/u);
    fireEvent.click(button);
    expect(button).toHaveTextContent(/^dark$/u);
  });
});

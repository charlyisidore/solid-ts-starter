import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@solidjs/testing-library';
import Select from './Select';

describe('<Select>', () => {
  // eslint-disable-next-line vitest/no-hooks
  afterEach(cleanup);

  it('changes the value', async () => {
    const options = {
      light: 'Light',
      dark: 'Dark',
    };

    const onChange = vi.fn();

    const { getByRole } = render(() => (
      <Select options={options} value={'light'} onChange={onChange} />
    ));

    const select = getByRole('combobox');
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(onChange).toHaveBeenCalledWith('dark');
  });
});

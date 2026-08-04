import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { OtpInputComponent } from './otp-input.component';

const meta: Meta<OtpInputComponent> = {
  title: 'Shared/OtpInput',
  component: OtpInputComponent,
  tags: ['autodocs'],
  argTypes: {
    length: {
      control: 'number',
      description: 'Number of digits/inputs to render'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all input fields'
    },
    hasError: {
      control: 'boolean',
      description: 'Applies error border and shake animation styling'
    }
  },
  args: {
    length: 6,
    disabled: false,
    hasError: false,
    codeComplete: fn()
  }
};

export default meta;
type Story = StoryObj<OtpInputComponent>;

export const Default: Story = {
  args: {
    length: 6,
    disabled: false,
    hasError: false
  }
};

export const ErrorState: Story = {
  args: {
    length: 6,
    disabled: false,
    hasError: true
  }
};

export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    hasError: false
  }
};

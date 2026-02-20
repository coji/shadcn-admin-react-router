import {
  configureForms,
  type FieldMetadata as BaseFieldMetadata,
  type Fieldset as BaseFieldset,
  type FormMetadata as BaseFormMetadata,
  type InferBaseErrorShape,
  type InferCustomFieldMetadata,
  type InferCustomFormMetadata,
} from '@conform-to/react/future'
import { getConstraints } from '@conform-to/zod/v4/future'

const forms = configureForms({
  getConstraints,
  shouldValidate: 'onInput',
  shouldRevalidate: 'onBlur',
  extendFieldMetadata(metadata) {
    return {
      get inputProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          minLength: metadata.minLength,
          maxLength: metadata.maxLength,
          min: metadata.min,
          max: metadata.max,
          step: metadata.step,
          multiple: metadata.multiple,
          pattern: metadata.pattern,
          accept: metadata.accept,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        } satisfies Partial<React.ComponentProps<'input'>>
      },
      get textareaProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          minLength: metadata.minLength,
          maxLength: metadata.maxLength,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        } satisfies Partial<React.ComponentProps<'textarea'>>
      },
      get checkboxProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          value: 'on',
          defaultChecked: metadata.defaultChecked,
          required: metadata.required,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        } satisfies Partial<React.ComponentProps<'input'>>
      },
      get switchProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          value: 'on',
          defaultChecked: metadata.defaultChecked,
          required: metadata.required,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        } satisfies Partial<React.ComponentProps<'input'>>
      },
      get selectProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        }
      },
      get radioGroupProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        }
      },
      get datePickerProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        }
      },
      get comboBoxProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        }
      },
      get inputOTPProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          minLength: metadata.minLength,
          maxLength: metadata.maxLength,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        }
      },
    }
  },
})

type BaseErrorShape = InferBaseErrorShape<typeof forms.config>
type CustomFormMetadata = InferCustomFormMetadata<typeof forms.config>
type CustomFieldMetadata = InferCustomFieldMetadata<typeof forms.config>

export type FormMetadata<ErrorShape extends BaseErrorShape = BaseErrorShape> =
  BaseFormMetadata<ErrorShape, CustomFormMetadata, CustomFieldMetadata>

export type FieldMetadata<
  FieldShape,
  ErrorShape extends BaseErrorShape = BaseErrorShape,
> = BaseFieldMetadata<FieldShape, ErrorShape, CustomFieldMetadata>

export type Fieldset<
  FieldShape,
  ErrorShape extends BaseErrorShape = BaseErrorShape,
> = BaseFieldset<FieldShape, ErrorShape, CustomFieldMetadata>

export const { useForm, useFormMetadata, useField, useIntent, FormProvider } =
  forms

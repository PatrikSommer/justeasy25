// Cesta: frontend/src/components/form/FormField.tsx

import { type InputHTMLAttributes } from 'react';
import {
	type FieldError,
	type UseFormRegister,
	type FieldValues,
	type Path,
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps<TFormData extends FieldValues>
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
	/**
	 * Název pole (odpovídá klíči ve form data)
	 * Type-safe díky Path<TFormData>
	 */
	name: Path<TFormData>;

	/**
	 * Label text zobrazený nad inputem
	 */
	label: string;

	/**
	 * React Hook Form register funkce
	 */
	register: UseFormRegister<TFormData>;

	/**
	 * Chybová hláška z validace
	 */
	error?: FieldError;

	/**
	 * Je pole povinné? (přidá * k labelu)
	 */
	required?: boolean;
}

/**
 * Reusable form field komponenta s type-safe name prop
 *
 * Generic type zajišťuje že 'name' odpovídá poli ve formuláři
 *
 * @example
 * <FormField<LoginFormData>
 *   name="email" // ← autocomplete + type check
 *   label="E-mail"
 *   type="email"
 *   register={register}
 *   error={errors.email}
 *   required
 * />
 */
export function FormField<TFormData extends FieldValues>({
	name,
	label,
	register,
	error,
	required = false,
	...inputProps
}: FormFieldProps<TFormData>) {
	return (
		<div className='space-y-2'>
			{/* Label */}
			<Label htmlFor={name}>
				{label}
				{required && <span className='text-red-600 ml-1'>*</span>}
			</Label>

			{/* Input */}
			<Input
				id={name}
				aria-invalid={!!error}
				aria-describedby={error ? `${name}-error` : undefined}
				{...register(name)}
				{...inputProps}
			/>

			{/* Error message */}
			{error && (
				<p
					id={`${name}-error`}
					className='text-sm text-red-600'
					role='alert'>
					{error.message}
				</p>
			)}
		</div>
	);
}

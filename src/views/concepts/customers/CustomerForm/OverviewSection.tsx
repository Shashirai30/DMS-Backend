
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import { TbEye, TbEyeOff } from 'react-icons/tb'
import { useState } from 'react'


type OverviewSectionProps = FormSectionBaseProps

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

const OverviewSection = ({ newCustomer,control, errors }: OverviewSectionProps) => {
    
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="First Name"
                    invalid={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Last Name"
                    invalid={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Last Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Employee Code"
                    invalid={Boolean(errors.empCode)}
                    errorMessage={errors.empCode?.message}
                >
                    <Controller
                        name="empCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Employee Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={statusOptions}
                                placeholder="Select Status"
                                {...field}
                                value={statusOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Phone Number"
                invalid={Boolean(errors.phoneNumber)}
                errorMessage={errors.phoneNumber?.message}
            >
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <NumericInput
                            autoComplete="off"
                            placeholder="Phone Number"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                        />
                    )}
                />
            </FormItem>
            {/* <FormItem
                label="Password"
                invalid={Boolean(errors.password)}
                errorMessage={errors.password?.message}
            >
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            placeholder="Password"
                            className="w-full p-2 pr-10 border rounded-md"
                            {...field}
                        />
                    )}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center mt-6 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <TbEyeOff size={20} /> : <TbEye size={20} />}
                </button>

            </FormItem> */}
             {newCustomer && (
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="off"
                                    placeholder="Password"
                                    className="w-full p-2 pr-10 border rounded-md"
                                    {...field}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <TbEyeOff size={20} /> : <TbEye size={20} />}
                                </button>
                            </div>
                        )}
                    />
                </FormItem>
                )} 
        </Card>
    )
}

export default OverviewSection
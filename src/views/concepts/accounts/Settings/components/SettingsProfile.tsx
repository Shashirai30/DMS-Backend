/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { useSessionUser } from '@/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ZodType } from 'zod'
import { Notification, toast } from '@/components/ui'
import { apiUpdateProfile } from '@/services/AuthService'

type ProfileSchema = {
    message?: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    img: string
}

const validationSchema: ZodType<ProfileSchema> = z.object({
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Please input your mobile number' }),
    img: z.string(),
})

const SettingsProfile = () => {
    const {  image, firstName, lastName, email, phoneNumber } = useSessionUser((state) => state.user)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [avatar, setAvatar] = useState(image || '')
    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            img: image || '',
            firstName: firstName || '',
            lastName: lastName || '',
            email: email || '',
            phoneNumber: phoneNumber || '',
        }
    })

    useEffect(() => {
        if (image || firstName || lastName || email || phoneNumber) {
            reset({
                img: image || '',
                firstName: firstName || '',
                lastName: lastName || '',
                email: email || '',
                phoneNumber: phoneNumber || '',
            })
            setAvatar(image || '')
        }
    }, [image, firstName, lastName, email, phoneNumber, reset])

    const onSubmit = async (values: ProfileSchema) => {
       
        console.log('Submitting with values:', values); // Verify ID is correct
        setIsSubmitting(true)
        try {
            const response = await apiUpdateProfile({
                values: values,
            })

            toast.push(
                <Notification type="success">
                    {response?.message || 'Profile updated successfully'}
                </Notification>,
                { placement: 'top-center' }
            )
        } catch (error: any) {
            console.error('Error updating profile:', error)
            toast.push(
                <Notification type="danger">
                    {error?.response?.data?.message || error?.message || 'Failed to update profile'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <h4 className="mb-8">Personal information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8">
                    <Controller
                        name="img"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineUser />}
                                    src={avatar}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                const newAvatar = URL.createObjectURL(files[0])
                                                setAvatar(newAvatar)
                                                setValue('img', newAvatar)
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            type="button"
                                            icon={<TbPlus />}
                                        >
                                            Upload Image
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setAvatar('')
                                            setValue('img', '')
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="Firstname"
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
                        label="Lastname"
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

                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem
                        className="w-full"
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
                                    onChange={(value) => field.onChange(value)}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Update
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SettingsProfile

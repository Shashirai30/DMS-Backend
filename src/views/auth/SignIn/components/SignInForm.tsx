
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { Notification, toast } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { apiSignIn } from '@/services/AuthService'
import { useToken, useSessionUser } from '@/store/authStore'; 


interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean;
    passwordHint?: string | ReactNode;
    setMessage?: (message: string) => void;
}

type SignInFormSchema = {
    email: string; // Changed from email to username
    password: string;
};

const validationSchema: ZodType<SignInFormSchema> = z.object({
    email: z
        .string({ required_error: 'Please enter your username' })
        .min(1, { message: 'Username is required' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Password is required' }),
});

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const { disableSubmit = false, className, passwordHint } = props;

    const { setToken } = useToken(); // Hook to set the token
    const { setUser, setSessionSignedIn } = useSessionUser(); 

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        resolver: zodResolver(validationSchema),
    });

    const onSignIn = async (values: SignInFormSchema) => {
        if (disableSubmit) return;

        setSubmitting(true);
        try {
            const result = await apiSignIn(values);
            console.log("Printing Api Response ===>", result)

            const tokenValue = result.token

            setToken(String(tokenValue));

            // Update the user session
            setUser(result.userInfo);
            setSessionSignedIn(true);
            navigate('/dashboards/analytic');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';

            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label="Username"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Username"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint && 'mb-0',
                        errors.password?.message && 'mb-8',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                placeholder="Password"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm

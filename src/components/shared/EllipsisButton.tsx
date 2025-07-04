
//k button jo ellipsis icon (TbDots) display karta hai.

//Customizable shape, variant, aur size.

//Flexible aur reusable design.

// khas kar ke jab aapko kisi menu ya dropdown trigger karne ke liye ellipsis button ki zarurat hoti hai! 
import Button from '@/components/ui/Button'
import { TbDots } from 'react-icons/tb'
import type { ButtonProps } from '@/components/ui/Button'

type EllipsisButtonProps = ButtonProps

const EllipsisButton = (props: EllipsisButtonProps) => {
    const { shape = 'circle', variant = 'plain', size = 'xs' } = props

    return (
        <Button
            shape={shape}
            variant={variant}
            size={size}
            icon={<TbDots />}
            {...props}
        />
    )
}

export default EllipsisButton

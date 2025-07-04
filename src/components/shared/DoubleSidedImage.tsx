//Ek image jo current theme (dark mode ya light mode) ke hisab se switch hoti hai.
// khas kar ke jab aapko theme-based images display karne hote hain!
import { useThemeStore } from '@/store/themeStore'
import { THEME_ENUM } from '@/constants/theme.constant'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

interface DoubleSidedImageProps
    extends DetailedHTMLProps<
        ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
    > {
    darkModeSrc: string
}

const { MODE_DARK } = THEME_ENUM

const DoubleSidedImage = ({
    src,
    darkModeSrc,
    alt = '',
    ...rest
}: DoubleSidedImageProps) => {
    const mode = useThemeStore((state) => state.mode)

    return (
        <img src={mode === MODE_DARK ? darkModeSrc : src} alt={alt} {...rest} />
    )
}

export default DoubleSidedImage

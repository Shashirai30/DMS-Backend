import useAuthority from '@/utils/hooks/useAuthority'
import type { CommonProps } from '@/@types/common'

interface AuthorityCheckProps extends CommonProps {
    userAuthority: string[]
    authority: string[]
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
    const { userAuthority = [], authority = [], children } = props
  
    const roleMatched = useAuthority(userAuthority, authority)

    return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
// jo user ke roles aur permissions ke hisab se content ko conditionally render karta hai. 
// Iska use karke aap kisi specific user role ya permission ke liye content ko restrict ya allow kar sakte hain. 
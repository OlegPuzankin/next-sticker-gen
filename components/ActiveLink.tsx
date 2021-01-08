import { useRouter } from 'next/router'
import Link from 'next/link'

type Props = {
    href: string
    as?: string
    linkName: string
    activeClassName?: string
    defaultClassName: string
} & typeof defaultProps

const defaultProps = {
    activeClassName: 'text-primary',
}

export const NavLink = ({ href, linkName, activeClassName, defaultClassName }: Props) => {
    const router = useRouter()
    let path: string
    const index = href.indexOf('?')
    index === -1 ? path = href : path = href.substring(0, index)

    return (
        <Link href={href} >
            <a className={`${defaultClassName} ${router.pathname == path ? activeClassName : ''}`}>
                {linkName}
            </a>
        </Link>
    )
}

NavLink.defaultProps = defaultProps

// href.includes(router.pathname)
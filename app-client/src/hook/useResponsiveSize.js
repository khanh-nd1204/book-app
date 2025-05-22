import { Grid } from 'antd'

const { useBreakpoint } = Grid

export const useResponsiveSize = () => {
    const screens = useBreakpoint()

    switch (true) {
        case screens.xxl:
            return {
                title: '24px',
                subtitle: '20px',
                text: '16px',
                subtext: '15px',
                subtext2: '13px',
                iconLarge: '32px',
                icon: '28px',
                logo: '56px',
                notification: '300px',
                priceLarge: '28px',
            }
        case screens.xl:
            return {
                title: '20px',
                subtitle: '17px',
                text: '15px',
                subtext: '14px',
                subtext2: '12px',
                iconLarge: '28px',
                icon: '24px',
                logo: '48px',
                priceLarge: '24px',
            }
        case screens.lg:
            return {
                title: '19px',
                subtitle: '17px',
                text: '14px',
                subtext: '13px',
                subtext2: '12px',
                iconLarge: '26px',
                icon: '22px',
                logo: '44px',
                priceLarge: '22px',
            }
        case screens.md:
            return {
                title: '18px',
                subtitle: '16px',
                text: '14px',
                subtext: '12px',
                subtext2: '11px',
                iconLarge: '24px',
                icon: '20px',
                logo: '40px',
                priceLarge: '20px',
            }
        case screens.sm:
            return {
                title: '17px',
                subtitle: '15px',
                text: '14px',
                subtext: '13px',
                subtext2: '11px',
                iconLarge: '22px',
                icon: '18px',
                logo: '36px',
                notification: '120px',
                priceLarge: '19px',
            }
        default:
            return {
                title: '16px',
                subtitle: '15px',
                text: '13px',
                subtext: '11px',
                subtext2: '9px',
                iconLarge: '20px',
                icon: '16px',
                logo: '32px',
                notification: '240px',
                priceLarge: '18px',
            }
    }
}

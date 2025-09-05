type ILogo = {
    className?: string;
};

//TODO: temporarily as a png file change to svg later

export const Logo = ({ className }: ILogo) => {
    return (
        <>
            <img
                src="/images/logo/logo-dark.png"
                alt="logo-dark"
                className={`hidden h-15 dark:block ${className ?? ""}`}
            />
            <img
                src="/images/logo/logo-light.png"
                alt="logo-light"
                className={`block h-15 dark:hidden ${className ?? ""}`}
            />
        </>
    );
};

import React, { memo } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import styles from "./app-header.module.css";
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import MenuButton from "../common/menu-button/menu-button";

interface GetLinkClassProps {
  isActive: boolean;
}

const AppHeader = memo(function AppHeader(): JSX.Element {
    const location = useLocation();

    const getLinkClass = ({ isActive }: GetLinkClassProps): string =>
        `${styles.link} ${isActive ? styles.activeLink : ''}`;

    const getIconType = (path: string): "primary" | "secondary" => {
        if (path === '/') {
            return location.pathname === path ? "primary" : "secondary";
        }
        return location.pathname.startsWith(path) ? "primary" : "secondary";
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.leftGroup}>
                    <NavLink to="/" className={getLinkClass} end>
                        <MenuButton>
                            <BurgerIcon type={getIconType("/")} />
                            <span>Конструктор</span>
                        </MenuButton>
                    </NavLink>
                    <NavLink to="/feed" className={getLinkClass}>
                        <MenuButton>
                            <ListIcon type={getIconType("/feed")} />
                            <span>Лента заказов</span>
                        </MenuButton>
                    </NavLink>
                </div>
                <div className={styles.logo}>
                    <Link to="/"><Logo /> </Link>
                </div>
                <div className={styles.rightBtn}>
                    <NavLink to="/profile" className={getLinkClass}>
                        {({ isActive }: { isActive: boolean }) => (
                            <MenuButton>
                                <ProfileIcon type={isActive ? "primary" : "secondary"} />
                                <span>Личный кабинет</span>
                            </MenuButton>
                        )}
                    </NavLink>
                </div>
            </nav>
        </header>
    );
});

export default AppHeader;

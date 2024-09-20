import React from "react";
import styles from "./app-header.module.css";
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import MenuButton from "../common/menu-button/menu-button";

function AppHeader() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.leftGroup}>
                    <MenuButton>
                        <BurgerIcon type="secondary" />
                        <span>Конструктор</span>
                    </MenuButton>
                    <MenuButton>
                        <ListIcon type="secondary" />
                        <span>Лента заказов</span>
                    </MenuButton>
                </div>
                <div className={styles.logo}>
                    <Logo />
                </div>
                <div className={styles.rightBtn}>
                    <MenuButton>
                        <ProfileIcon type="secondary" />
                        <span>Личный кабинет</span>
                    </MenuButton>
                </div>
            </nav>
        </header>
    );
}

export default AppHeader;

import React from "react";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../ingredients.module.css"

const { tabsRow } = styles;

type TabType = "buns" | "sauces" | "mains";

interface TabSortProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

function TabSort({ activeTab, setActiveTab }: TabSortProps): JSX.Element {
    function onClickBuns(): void {
        setActiveTab("buns");
    }

    function onClickSauces(): void {
        setActiveTab("sauces");
    }

    function onClickMains(): void {
        setActiveTab("mains");
    }

    return (
        <div className={tabsRow}>
            <Tab value="buns" active={activeTab === "buns"} onClick={onClickBuns}>
                Булки
            </Tab>
            <Tab value="sauces" active={activeTab === "sauces"} onClick={onClickSauces}>
                Соусы
            </Tab>
            <Tab value="mains" active={activeTab === "mains"} onClick={onClickMains}>
                Начинки
            </Tab>
        </div>
    );
}


export default TabSort;

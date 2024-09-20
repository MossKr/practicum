import React from "react";
import PropTypes from "prop-types";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

function TabSort(props) {
    function onClickBuns() {
        props.setActiveTab("buns");
    }

    function onClickSauces() {
        props.setActiveTab("sauces");
    }

    function onClickMains() {
        props.setActiveTab("mains");
    }

    return (
        <div style={{ display: "flex" }}>
            <Tab value="buns" active={props.activeTab === "buns"} onClick={onClickBuns}>
                Булки
            </Tab>
            <Tab value="sauces" active={props.activeTab === "sauces"} onClick={onClickSauces}>
                Соусы
            </Tab>
            <Tab value="mains" active={props.activeTab === "mains"} onClick={onClickMains}>
                Начинки
            </Tab>
        </div>
    );
}

TabSort.propTypes = {
    activeTab: PropTypes.oneOf(["buns", "sauces", "mains"]).isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default TabSort;

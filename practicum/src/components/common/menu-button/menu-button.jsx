import React from "react";
import PropTypes from "prop-types";
import { Button } from "@ya.praktikum/react-developer-burger-ui-components";

function MenuButton(props) {
    const custom = {
        gap: "8px",
        display: "flex",
        color: "#fff",
        padding: "16px 20px",
    };

    const style = props.style || {};

    return (
        <Button htmlType="button" type="secondary" size="medium" style={{ ...custom, ...style }} {...props}>
            {props.children}
        </Button>
    );
}

MenuButton.propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
};

export default MenuButton;

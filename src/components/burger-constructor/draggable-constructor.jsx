import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DragIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./constructor.module.css";
import PropTypes from 'prop-types';
import { IngredientType } from '../../utils/types';

const Draggable = ({ ingredient, index, moveIngredient, children }) => {
    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: "constructorElement",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveIngredient(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "constructorElement",
        item: () => {
            return { id: ingredient.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity }} className={styles.draggableItem} data-handler-id={handlerId}>
            <DragIcon type="primary" />
            {children}
        </div>
    );
};

Draggable.propTypes = {
    ingredient: IngredientType.isRequired,
    index: PropTypes.number.isRequired,
    moveIngredient: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Draggable;

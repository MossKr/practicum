import React, { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { DragIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./constructor.module.css";
import { Ingredient, DragItem } from '../../utils/typesTs';

interface DraggableProps {
    ingredient: Ingredient;
    index: number;
    moveIngredient: (dragIndex: number, hoverIndex: number) => void;
    handleRemove: () => void;
    children: React.ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ ingredient, index, moveIngredient, handleRemove, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
        accept: "constructorElement",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) {
                return;
            }

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

    const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
        type: "constructorElement",
        item: (): DragItem => {
            return { id: ingredient._id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity }}
            className={styles.draggableItem}
            data-handler-id={handlerId}
        >
            <DragIcon type="primary" />
            {children}
        </div>
    );
};

export default Draggable;

import React, { useRef, useCallback, useEffect, useReducer } from 'react';

/**
 * style-autonomous reusable component
 */
export default function DoubleRangeSlider({
    rangeBoundaries = [0, 100],
    rangeDefaults = [0, 100],
    onRangeChanged,
    label,
    componentStyle
}) {

    const style = {
        maxWidth: undefined,
        lineColor: '#303030',
        lineShadowColor: '#606060',
        leftThumbColor: '#909090',
        rightThumbColor: '#909090',
        thumbsShadowColor: '#707070',
        marginBottom: '10px',
        thumbSize: 10,
        zIndex: 100,
        ...componentStyle,
    }

    const rangeBaseRef = useRef();
    const leftThumbRef = useRef();
    const rightThumbRef = useRef();
    const leftThumbMouseState = useRef({ down: false });
    const rightThumbMouseState = useRef({ down: false });
    const currentRange = useRef([]);

    const [range, dispatch] = useReducer((state, action) => {
        const { left: base_left, width: base_width } = rangeBaseRef.current.getBoundingClientRect();
        const { left: lefth_thumb_p } = leftThumbRef.current.getBoundingClientRect();
        const { left: right_thumb_p } = rightThumbRef.current.getBoundingClientRect();

        switch (action.type) {
            case 'left':
                const left_p = Math.max(-style.thumbSize / 2, Math.min(right_thumb_p - base_left, state.left + action.value));
                const left_value = rangeBoundaries[0] - (rangeBoundaries[0] - rangeBoundaries[1]) * (left_p + style.thumbSize / 2) / base_width;
                // console.log(left_value);
                currentRange.current[0] = left_value;

                return {
                    ...state,
                    left: left_p
                }
            case 'right':
                const right_p = Math.max(lefth_thumb_p - base_left, Math.min(base_width - style.thumbSize / 2, state.right + action.value));
                const right_value = (rangeBoundaries[1] - rangeBoundaries[0]) * (right_p + style.thumbSize / 2) / base_width + rangeBoundaries[0];
                // console.log(right_value);
                currentRange.current[1] = right_value;

                return {
                    ...state,
                    right: right_p
                }
            case 'defaults':
                return {
                    ...state,
                    ...action.value
                }
            default:
                return state;
        }
    }, {
        left: 0,
        right: 0
    });

    useEffect(() => {
        if (rangeBaseRef.current) {
            if (rangeBoundaries[0] > rangeBoundaries[1]) throw 'rangeBoundaries[0] > rangeBoundaries[1]';
            if (rangeDefaults[0] > rangeDefaults[1]) throw 'rangeDefaults[0] > rangeDefaults[1]';

            currentRange.current = [rangeDefaults[0], rangeDefaults[1]];

            const { width: base_width } = rangeBaseRef.current.getBoundingClientRect();
            const left_p = base_width * (rangeDefaults[0] - rangeBoundaries[0]) / (rangeBoundaries[1] - rangeBoundaries[0]);
            const right_p = base_width * (rangeDefaults[1] - rangeBoundaries[0]) / (rangeBoundaries[1] - rangeBoundaries[0]);

            dispatch({
                type: 'defaults',
                value: {
                    left: left_p - style.thumbSize / 2,
                    right: right_p - style.thumbSize / 2,
                }
            });
        }
    }, [rangeBoundaries, rangeDefaults]);

    const preventDragHandler = useCallback(event => {
        event.preventDefault();
    }, []);

    const windowMouseUpHandler = useCallback(event => {
        removeMouseEventHandlers();
    }, []);
    const windowMouseLeaveHandler = useCallback(event => {
        removeMouseEventHandlers();
    }, []);

    const windowMouseMoveLeftThumHandler = useCallback(event => {
        // console.log(event)
        dispatch({
            type: 'left',
            value: event.movementX
        });
    }, []);
    const leftThumbMouseUpHandler = useCallback(event => {
        leftThumbMouseState.current.down = false;
        removeMouseEventHandlers();
    }, []);
    const leftThumbMouseOutHandler = useCallback(event => {
        if (!leftThumbMouseState.current.down) {
            removeMouseEventHandlers();
        }
    }, []);



    const windowMouseMoveRightThumHandler = useCallback(event => {
        dispatch({
            type: 'right',
            value: event.movementX
        });
    }, []);
    const rightThumbMouseUpHandler = useCallback(event => {
        rightThumbMouseState.current.down = false;
        removeMouseEventHandlers();
    }, []);
    const rightThumbMouseOutHandler = useCallback(event => {
        if (!rightThumbMouseState.current.down) {
            removeMouseEventHandlers();
        }
    }, []);

    const leftThumbMouseDownHandler = useCallback(event => {
        event.stopPropagation();
        if (leftThumbRef.current && rightThumbRef.current) {
            leftThumbRef.current.style.zIndex = style.zIndex + 1;
            rightThumbRef.current.style.zIndex = style.zIndex;
    
            leftThumbMouseState.current.down = true;
            window.addEventListener('mouseup', windowMouseUpHandler);
            window.addEventListener('mouseleave', windowMouseLeaveHandler);
    
            window.addEventListener('mousemove', windowMouseMoveLeftThumHandler);
            leftThumbRef.current.addEventListener('mouseup', leftThumbMouseUpHandler);
            leftThumbRef.current.addEventListener('mouseout', leftThumbMouseOutHandler);
        }
    }, []);


    const rithtThumbMouseDownHandler = useCallback(event => {
        if (leftThumbRef.current && rightThumbRef.current) {
            event.stopPropagation();

            rightThumbRef.current.style.zIndex = style.zIndex + 1;
            leftThumbRef.current.style.zIndex = style.zIndex;
    
            rightThumbMouseState.current.down = true;
            window.addEventListener('mouseup', windowMouseUpHandler);
            window.addEventListener('mouseleave', windowMouseLeaveHandler);
    
            window.addEventListener('mousemove', windowMouseMoveRightThumHandler);
            rightThumbRef.current.addEventListener('mouseup', rightThumbMouseUpHandler);
            rightThumbRef.current.addEventListener('mouseout', rightThumbMouseOutHandler);
        }
    }, []);


    const removeMouseEventHandlers = useCallback(() => {
        onRangeChanged && onRangeChanged(currentRange.current);

        window.removeEventListener('mouseup', windowMouseUpHandler);
        window.removeEventListener('mouseleave', windowMouseLeaveHandler);

        window.removeEventListener('mousemove', windowMouseMoveLeftThumHandler);
        if (leftThumbRef.current) {
            leftThumbRef.current.removeEventListener('mouseup', leftThumbMouseUpHandler);
            leftThumbRef.current.removeEventListener('mouseout', leftThumbMouseOutHandler);
        }

        window.removeEventListener('mousemove', windowMouseMoveRightThumHandler);
        if (rightThumbRef.current) {
            rightThumbRef.current.removeEventListener('mouseup', rightThumbMouseUpHandler);
            rightThumbRef.current.removeEventListener('mouseout', rightThumbMouseOutHandler);
        }
    }, []);

    useEffect(() => {
        return () => {
            removeMouseEventHandlers();
        }
    }, []);

    return (
        <div
            draggable={false}
            onDragStart={preventDragHandler}
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignContent: 'left',
                minHeight: '22px',
                marginBottom: style.marginBottom,
                maxWidth: style.maxWidth || 'unset'
            }}
        >
            <div
                draggable={false}
                style={{
                    pointerEvents: 'none'
                }}
            >
                {label && label}
            </div>
            <div
                ref={rangeBaseRef}
                draggable={false}
                onDragStart={preventDragHandler}
                style={{
                    height: '1px',
                    width: '100%',
                    border: 'none',
                    position: 'relative',
                    backgroundColor: style.lineColor,
                    boxShadow: `0px 1px 4px ${style.lineShadowColor}`
                }}
            >
                <div
                    ref={leftThumbRef}
                    draggable={false}
                    onDragStart={preventDragHandler}
                    onMouseDown={leftThumbMouseDownHandler}
                    style={{
                        position: 'absolute',
                        top: `-${style.thumbSize / 2}px`,
                        left: `${range.left}px`,
                        zIndex: style.zIndex,
                        borderRadius: '50%',
                        border: 'none',
                        width: `${style.thumbSize}px`,
                        height: `${style.thumbSize}px`,
                        cursor: 'pointer',
                        backgroundColor: style.leftThumbColor,
                        boxShadow: `0px 1px 2px ${style.thumbsShadowColor}`
                    }}
                >
                    {currentRange.current[0] !== undefined &&
                        <span
                            className="noselect"
                            style={{
                                position: 'absolute',
                                bottom: '-10px',
                                fontSize: '0.65rem',
                                right: `${style.thumbSize}px`,
                                pointerEvents: 'none'
                            }}
                        >{Math.floor(currentRange.current[0])}</span>
                    }
                </div>
                <div
                    ref={rightThumbRef}
                    draggable={false}
                    onDragStart={preventDragHandler}
                    onMouseDown={rithtThumbMouseDownHandler}
                    style={{
                        position: 'absolute',
                        top: `-${style.thumbSize / 2}px`,
                        left: `${range.right}px`,
                        zIndex: style.zIndex,
                        borderRadius: '50%',
                        border: 'none',
                        width: `${style.thumbSize}px`,
                        height: `${style.thumbSize}px`,
                        cursor: 'pointer',
                        backgroundColor: style.rightThumbColor,
                        boxShadow: `0px 1px 2px ${style.thumbsShadowColor}`
                    }}
                >
                    {currentRange.current[1] !== undefined &&
                        <span
                            className="noselect"
                            style={{
                                position: 'absolute',
                                bottom: '-10px',
                                fontSize: '0.65rem',
                                left: `${style.thumbSize}px`,
                                pointerEvents: 'none'
                            }}
                        >{Math.floor(currentRange.current[1])}</span>
                    }
                </div>
            </div>
        </div>
    );
}
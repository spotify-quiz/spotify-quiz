import React from 'react';

interface ButtonProps {
    label: string;
    className?: string; // Add the className property with an optional (?) modifier
    onClick: () => void;
}

function Button(props: ButtonProps) {

    return (
        <button className={props.className} onClick={props.onClick}>
            {props.label}
        </button>
    );
}

export default Button;

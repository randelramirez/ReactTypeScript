import React from "react";

export interface  IDemoCompProps {
    handleClickMe1: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    handleClickMe2: (event: React.SyntheticEvent) => void
    handleClickMe3: (event: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => void
}

export function Container(){
    const handleClickMe1 = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
    }
    
    const handleClickMe2 = (event: React.SyntheticEvent) => {
        // has no access to other properties like clientX,clientY
        event.preventDefault();
    }
    
    const handleClickMe3 = (event: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
        //event.nativeEvent.clientX
        //event.nativeEvent.clientY
        event.preventDefault();
    }
    
    return <DemoComp handleClickMe1={handleClickMe1} handleClickMe2={handleClickMe2} handleClickMe3={handleClickMe3}/>
}

export const DemoComp: React.FC<IDemoCompProps> = ({handleClickMe1, handleClickMe2, handleClickMe3}) => {
    return <div>
        <button onClick={handleClickMe1}>Click me 1</button>
        <button onClick={handleClickMe2}>Click me 2</button>
        <button onClick={handleClickMe3}>Click me 3</button>
    </div>
}

export  default DemoComp;
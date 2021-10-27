import React from "react";

export interface  IDemoComp2Props {
    onChange1: (event: React.ChangeEvent<HTMLInputElement>) => void
    onChange2: (event: React.SyntheticEvent) => void
    onChange3: (event: React.SyntheticEvent<HTMLInputElement>) => void
}

export function Container(){
    const onChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value;
        event.currentTarget.value;
    }

    const onChange2 = (event: React.SyntheticEvent) => {
        console.log('onChange2',(event.currentTarget as HTMLInputElement).value);
    }

    const onChange3 = (event: React.SyntheticEvent<HTMLInputElement>) => {
        console.log('onChange3',(event.target)); // cannot access event.target.value
        console.log('onChange3',(event.currentTarget.value));
    }

    return <DemoComp onChange1={onChange1} onChange2={onChange2} onChange3={onChange3}/>
}

export const DemoComp: React.FC<IDemoComp2Props> = ({onChange1, onChange2, onChange3}) => {
    return <div>
        <input type="text" onChange={onChange1} />
        <input type="text" onChange={onChange2} />
        <input type="text" onChange={onChange3} />
    </div>
}

export  default DemoComp;
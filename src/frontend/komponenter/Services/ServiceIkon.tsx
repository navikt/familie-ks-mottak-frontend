import * as React from 'react';

interface IServiceIkon {
    className?: string;
    heigth?: number;
    width?: number;
}

const ServiceIkon: React.StatelessComponent<IServiceIkon> = ({ className, heigth, width }) => {
    return (
        <svg
            aria-labelledby={'service'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M22,16H2c-1.104,0-2,0.897-2,2v5.5C0,23.776,0.224,24,0.5,24h23c0.276,0,0.5-0.224,0.5-0.5V18C24,16.897,23.103,16,22,16z    M5.5,21h-3C2.224,21,2,20.776,2,20.5S2.224,20,2.5,20h3C5.776,20,6,20.224,6,20.5S5.776,21,5.5,21z M8.5,19h-6   C2.224,19,2,18.776,2,18.5S2.224,18,2.5,18h6C8.776,18,9,18.224,9,18.5S8.776,19,8.5,19z M22,21H12v-3h10V21z" />
            <path d="M3.325,15h17.348C21.956,15,23,13.878,23,12.5v-10C23,1.122,21.956,0,20.673,0H3.325C2.043,0,1,1.122,1,2.5v10   C1,13.878,2.043,15,3.325,15z M3,2h18v11H3V2z" />
        </svg>
    );
};

export default ServiceIkon;

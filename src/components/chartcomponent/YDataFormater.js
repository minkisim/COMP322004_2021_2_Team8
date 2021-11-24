import React from "react";


class YDataFormater extends React.Component {
    
    render () {
        const {x, y, payload} = this.props;
        let datatemp = payload.value.toString().split(':');
        datatemp[0] = datatemp[0] + " :";
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={-60} y={-20} dy={14} textAnchor="middle" fill="#505050" fontSize={13}>{datatemp[0]}</text>
                <text x={-60} y={-20} dy={29} textAnchor="middle" fill="#505050" fontSize={13}>{datatemp[1]}</text>
            </g>
        )
    }
}


export default YDataFormater;
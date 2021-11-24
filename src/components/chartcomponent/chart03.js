import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './chart.css'


export default function Chart03(props){
   
      return (
        <div className="graph3">
          <LineChart width={869} height={389} data={props.data}
            margin={{
              top: 30,
              right: 30,
              left: 30,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" type="category" />
            <YAxis type="number" />
            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Line dataKey="관람객" stroke="#191F1D" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      )
    
}

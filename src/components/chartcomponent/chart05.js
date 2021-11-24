import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './chart.css'

export default function Chart05(props){
  
   
      return (
        <div>
          <BarChart width={800} height={300} data={props.data}
            margin={{
              top: 80,
              right: 30,
              left: 30,
              bottom: 10,
            }}
            barSize={15}
            
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" type="category" />
            <YAxis type="number" />
            <Tooltip cursor={{fill: 'transparent'}}/>
            
            <Bar dataKey="Day" stroke="#191F1D" fill="#191F1D" radius={[15, 15, 0, 0]} />
         
         </BarChart>
        </div>
      )
    
}

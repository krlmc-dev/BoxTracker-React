import React from "react";
import {  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

export default function LocationChart(props){
    const {stats}= props
    const colors = []
    return (
      <BarChart
        width={600}
        height={300}
        data={[stats[4], stats[5], stats[6], stats[7]]}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Number of Boxes">
          {
            
            colors[0] = "#2b9900",
            colors[1] = "#006399",
            colors[2] = "#e59400",
            colors[3] = "#f00",
            stats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]}  strokeWidth={index === 2 ? 4 : 1}/>
            ))
          }
        </Bar>
      </BarChart>
    );
  }
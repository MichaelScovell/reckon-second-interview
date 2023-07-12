// Defining a component for housing our rendered stock summary rows
import React from 'react'
import { Stock } from './Types';

// Declare a type
type SummaryRowProps = {
  stock: Stock,
  id: number
}

const SummaryRow = (props: SummaryRowProps) => {
  return (
    // Rendering our summary table row
    <tr key={props.id}>
      <td>{props.stock.code}</td>
      <td>{props.stock.starting}</td>
      <td>{props.stock.lowest}</td>
      <td>{props.stock.highest}</td>
      <td>{props.stock.current}</td>
    </tr>
  );
}

export default SummaryRow
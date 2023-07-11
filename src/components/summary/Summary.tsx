// Defining a component for the stock summary
import { useState, useEffect, useRef } from 'react'

// Defining a type for our stock
type Stock = {
	code: string,
	price: number,
	starting: number,
	lowest: number,
	highest: number,
	current: number
}

const Summary = () => {
	// Define state variables
	const [stockSummary, setStockSummary] = useState(Array<Stock>);
	const stockSummaryRef = useRef(stockSummary);
	stockSummaryRef.current = stockSummary;

	// Define a function for returning the current stock
	function getCurrentStock(code: string) {
		let filtered = stockSummaryRef.current.reduce((accumulator: Array<Stock>, currentValue: Stock) => {
			if (currentValue.code === code) {
				// Append
				accumulator.push(currentValue);
			}
			return accumulator;
		}, []);
		// Check for empty array
		if (filtered.length === 0) {
			// return empty stock
			return {
				code: code,
				price: 0,
				starting: 0,
				lowest: 0,
				highest: 0,
				current: 0
			} as Stock;
		}
		return filtered[0];
	};

	// Fetch the data from the api
	useEffect(() => {
		const timer = setInterval(() => {
			fetch('https://join.reckon.com/stock-pricing')
				.then((response: Response) => {
					// Check the response fetch is valid (200)
					if (response.status === 200) {
						// Return the response as valid json
						return response.json();
					}
					// Else if not valid throw an error
					throw response;
				})
				.then(json => {
					// console.log(json);
					// Map returned data to our stock summary
					let formatedStock: Array<Stock> = json.map(function (s: Stock) {
						let currentStock: Stock = getCurrentStock(s.code);
						console.log('currentStock', currentStock);
						let formatted: Stock = {
							code: s.code,
							price: s.price,
							starting: currentStock.starting === 0 ? s.price : currentStock.starting,
							lowest: s.price < currentStock.lowest || currentStock.lowest === 0 ? s.price : currentStock.lowest,
							highest: s.price > currentStock.highest ? s.price : currentStock.highest,
							current: s.price
						};
						return formatted;
					});
					setStockSummary(formatedStock);
				})
				// Catch our errors
				.catch(error => {
					console.log('Error', error);
				})
		}, 5000);
	}, []);

	return (
		<div>
			<h1>Stock Summary</h1>
			<div>
				<table>
					<tr>
						<th>Stock Name</th>
						<th>Starting</th>
						<th>Lowest</th>
						<th>Highest</th>
						<th>Current</th>
					</tr>
					{/* Render Stock Data */}
					{stockSummaryRef.current.map(function (s: Stock) {
						return (
							<tr>
								<td>{s.code}</td>
								<td>{s.starting}</td>
								{/* Logic */}
								<td>{s.lowest}</td>
								<td>{s.highest}</td>
								<td>{s.current}</td>
							</tr>
						);
					})}
				</table>
			</div>
		</div>
	)
}

export default Summary
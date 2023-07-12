// Defining a component for the stock summary
import { useState, useEffect, useRef } from 'react'
import { Stock } from './Types';
import SummaryRow from './SummaryRow';

// Defining a stock type for our API response
type ApiStock = {
	code: string,
	price: number
}
const API_URL = process.env.REACT_APP_API_URL || 'https://join.reckon.com/stock-pricing';

const Summary = () => {
	// Define state variables
	const [stockSummary, setStockSummary] = useState(Array<Stock>);
	const stockSummaryRef = useRef(stockSummary);
	stockSummaryRef.current = stockSummary;

	// Define a function for returning the current stock from the stock summary
	function getCurrentStock(code: string) {
		// Retrieve stock summary for the given stock code
		let filtered = stockSummaryRef.current.filter((currentValue: Stock) => {
			return (currentValue.code === code);
		});

		// Check for empty array
		if (filtered.length === 0) {
			// Return new empty stock
			return {
				code: code,
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
		// Poll API every 5 seconds
		setInterval(() => {
			fetch(API_URL)
				.then((response: Response) => {
					// Check the response fetch is valid (200)
					if (response.status === 200) {
						// Return the response as valid json
						return response.json();
					}
					// Else if not valid throw an error
					throw response;
				})
				.then((json: Array<ApiStock>) => {
					// Map returned data to our stock summary
					let formattedStock: Array<Stock> = json.map(function (s: ApiStock) {
						// Get current stock from our summary
						let currentStock: Stock = getCurrentStock(s.code);
						// Format into our stock type and perform required stock checks
						let formatted: Stock = {
							code: s.code,
							starting: currentStock.starting === 0 ? s.price : currentStock.starting,
							lowest: s.price < currentStock.lowest || currentStock.lowest === 0 ? s.price : currentStock.lowest,
							highest: s.price > currentStock.highest ? s.price : currentStock.highest,
							current: s.price
						};
						return formatted;
					});
					// Update our stock summary state
					setStockSummary(formattedStock);
				})
				// Catch our errors
				.catch(error => {
					console.log('Error', error);
				});
		}, 5000 /* Running our effect at 5 second intervals */);
	}, []);

	// UI for our stock summary
	return (
		<div>
			<h1>Stock Summary</h1>
			<div>
				{/* Table containing our stock summary */}
				<table className='table'>
					<thead>
						<tr>
							<th>Stock Name</th>
							<th>Starting</th>
							<th>Lowest</th>
							<th>Highest</th>
							<th>Current</th>
						</tr>
					</thead>
					<tbody>
						{/* Render Stock Summary */}
						{stockSummaryRef.current.map(function (s: Stock, key: number) {
							return (
								<SummaryRow id={key} stock={s} />
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Summary
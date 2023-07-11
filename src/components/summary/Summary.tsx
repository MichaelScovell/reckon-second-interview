// Defining a component for the stock summary
import { useState, useEffect, useRef } from 'react'

// Defining a type for our stock
type Stock = {
	code: string,
	price: number
}

const Summary = () => {
	// Define state variables
	const [stock, setStock] = useState(Array<Stock>);
	const stockRef = useRef(stock);
	stockRef.current = stock;

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
					setStock(json);
				})
				// Catch our errors
				.catch(error => {
					console.log('Error', error);
				})
		}, 5000);
	}, []);

	return (
		<div>
			{/* Data */}
			{stockRef.current.map(function (s: Stock, key) {
				// 
				return (<li key={key}>{s.code}, {s.price}</li>);
			})}
		</div>
	)
}

export default Summary
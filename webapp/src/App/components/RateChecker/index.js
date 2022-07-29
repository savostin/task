import { Row, Col, Typography, Card, Form, Input, Select, Space, Progress, Button } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { Navigate } from "react-router-dom";
import Api from '../../api';

const REFERSH_RATE = 30;

function isPositiveNumber(num) { // check input for being a positive float
	if (typeof num === 'number') {
		return num - num === 0 && num > 0;
	}
	if (typeof num === 'string' && num.trim() !== '') {
		return (Number.isFinite ? Number.isFinite(+num) : isFinite(+num)) && num >= 0;
	}
	return false;
};

function RateChecker() {
	const [loading, setLoading] = useState(false);
	const [nextUpdate, setNextUpdate] = useState({ time: Date.now(), pec: 0 }); // for update timer and progress indicator
	const [currencies, setCurrencies] = useState([]); // list of currencies
	const [rates, setRates] = useState({}); // rates pairs
	const [rate, setRate] = useState({ // current form state for dynamic update
		cur: { from: null, to: null },
		amount: { from: 100, to: null },
		input: { target: 'to', source: 'from' }
	});
	const api = new Api();
	const isLoggedIn = api.isLoggedIn;
	const onChangeDirection = (select, value) => { // currency pair change
		setRate({ ...rate, ...{ cur: { ...rate.cur, [select]: value } } });
	}

	const swap = () => {
		setRate(prev => { return { ...rate, ...{ cur: { from: prev.cur.to, to: prev.cur.from } } } });
	}

	const onChangeInput = (from, value) => { // amount input change
		if (!isPositiveNumber(value))
			return false;
		const to = from === 'from' ? 'to' : 'from';
		setRate(prev => { return { ...rate, ...{ amount: { ...prev.amount, [from]: value }, ...{ input: { target: to, source: from } } } } });
	}

	const getValue = (dir) => { // amount input value calculations
		return dir === rate.input.target ? (rate.cur.from && rate.cur.to && rate.input.source ? (rates[rate.cur.from][rate.cur.to] * rate.amount[rate.input.source]).toFixed(2) || null : null) : rate.amount[rate.input.source];
	}

	function useInterval(callback, delay) { // periodical update
		const savedCallback = useRef();

		useEffect(() => {
			savedCallback.current = callback; // Remember the latest function.
		}, [callback]);

		useEffect(() => {
			function tick() {
				savedCallback.current();
			}
			if (delay !== null) {
				let id = setInterval(tick, delay);
				return () => clearInterval(id);
			}
		}, [delay]);
	}

	useInterval(() => {
		setNextUpdate(prev => { return { ...prev, ...{ perc: 100 - 0.1 * (nextUpdate.time - Date.now()) / REFERSH_RATE } } });
		if (!loading && nextUpdate.time <= Date.now()) {
			setNextUpdate({ time: Date.now() + REFERSH_RATE * 1000, perc: 0 });
			updateRates();
		}
	}, 500);

	const updateRates = () => { // update the rates 
		if (api.isLoggedIn) { // do not update (could be due to current token refresh)
			setLoading(true);
			api.getRates()
				.then((data) => {
					setCurrencies(data.currencies || []); // TO DO: no currencies?
					const new_rates = data.currencies.reduce((acc, cur, icur) => { // make pairs from matrix
						acc[cur] = data.currencies.reduce((acc2, cur2, icur2) => {
							acc2[cur2] = data.rates[icur][icur2];
							return acc2;
						}, {});
						return acc;
					}, {});
					setRates(new_rates);
				}).catch(err => {
					console.error(err); // TO DO: do something with the error
				}).finally(() => {
					setLoading(false);
				})
		}
	};
	return ( <> { isLoggedIn && <>
				<Row>
					<Col span={24}>
						<Typography.Text className='dark-green medium fs-25px'>Rate Checker</Typography.Text>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Card>
							<Card.Grid className = 'full-width rounded b-g hover-no-border' >
								<Form layout='vertical'>
									<Row>
										<Col span={24}>
											<Form.Item
												name = 'convertFrom'
												label = { <span className='muli semi-bold fs-18px'>Convert From</span>}>
												<Row gutter={ 8 } >
													<Col span={ 8 } >
														<Select
															className = 'dark-green'
															showSearch
															loading = { loading }
															value = { rate.cur.from }
															onChange = {(v) => onChangeDirection('from', v) }
															filterOption = {
																(input, option) => {
																	if (option.children)
																		return option.children.toLowerCase().includes(input.toLowerCase())
																	else if (option.label)
																		return option.label.toLowerCase().includes(input.toLowerCase())
																}
															}> { currencies && currencies.map(cur => <Select.Option key = { cur } value = { cur } disabled = { rate.cur.to === cur } > { cur } </Select.Option>)}
														</Select>
													</Col> 
													<Col span = { 16 } >
														<Input placeholder = 'Enter Amount' value = { getValue('from') } onChange = { (e) => onChangeInput('from', e.target.value) }/>
													</Col>
												</Row>
											</Form.Item>
											<Form.Item name = 'convertTo'
													label = { < span className = 'muli semi-bold fs-18px' > <Button onClick = { swap } disabled = {!(rate.cur.from !== null && rate.cur.to !== null) } >↑↓</Button> Convert To</span> } >
												<Row gutter = { 8 } >
													<Col span = { 8 } >
														<Select className = 'dark-green'
															showSearch value = { rate.cur.to } loading = { loading } onChange = {
																(v) => onChangeDirection('to', v) } filterOption = {
																(input, option) => {
																	if (option.children)
																		return option.children.toLowerCase().includes(input.toLowerCase())
																	else if (option.label)
																		return option.label.toLowerCase().includes(input.toLowerCase())
																}
															} > { currencies && currencies.map(cur => < Select.Option key = { cur } value = { cur } disabled = { rate.cur.from === cur } > { cur } < /Select.Option>)} 
														</Select>
													</Col>
													<Col span = { 16 } >
														<Input placeholder = 'Enter Amount'
																value = { getValue('to') } onChange = {
																	(e) => onChangeInput('to', e.target.value) }
																/>
													</Col>
												</Row>
											</Form.Item>
										</Col>
									</Row>
									<Row align = 'bottom' >
										<Space >
											<Progress type = 'circle'
											percent = { nextUpdate.perc } width = { 40 } format = {
												() => `${REFERSH_RATE}s` }
											/> { rate.cur.from && rate.cur.to && rate.cur.from !== rate.cur.to && < Typography.Text className = 'muli semi-bold light-green' > 1 { rate.cur.from } = { rates[rate.cur.from][rate.cur.to] } { rate.cur.to } </Typography.Text> }
											</Space>
									</Row>
								</Form>
							</Card.Grid>
						</Card>
					</Col>
				</Row>
			</>
		} { !isLoggedIn && <Navigate to = "/login" replace = { true } /> }
	</>
	);
}

export default RateChecker;
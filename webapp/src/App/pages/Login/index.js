import { Button, Card, Col, Form, Input, Row, Typography, Spin, notification } from "antd";
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import Api from '../../api';


function Login() {
	const api = new Api();
	const [loading, setLoading] = useState(false);
	const isLoggedIn = api.isLoggedIn;
	const doLogin = (values) => {
		setLoading(true);
		api.login(values.username, values.password)
			.then(data => {}) // nothing to do
			.catch(err => {
				switch (err.error) 
				{
					case 'AUTH_FAILED':
						notification.error({
							message: 'Error',
							description: 'Autherntication failed'
						})
						break;
					default:
						notification.error({
							message: 'Error',
							description: `Unexpected error: ${err.error || err}`
						})

				}
			})
			.finally(() => {
				setLoading(false);
			})
		}

	return ( <>
		{ !isLoggedIn && 
        <Row className="full-height" align="middle" justify="center">
            <Col xxl={6} xl={9} lg={12} md={12} sm={18} xs={22}>
			<Spin spinning={loading} size="large">
                <Card>
                    <Card.Grid className="full-width rounded">
                        <Row>
                            <Col span={24}>
                                <Typography.Text className="medium fs-28px dark-green">Login</Typography.Text>
                            </Col>
                        </Row>
                        <Row className="m-t-10">
                            <Col span={24}>
                                <Form
                                    layout="vertical"
									onFinish={doLogin}
                                    requiredMark={false}>
                                    <Form.Item
                                        label={<span className="muli semi-bold">Username</span>}
                                        name='username'
										rules={[
											{
												type: 'email',
												message: 'The input is not valid E-mail!',
											  },
											  {
												required: true,
												message: 'Please input your E-mail!',
											  },
										  ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="muli semi-bold">Password</span>}
                                        name='password'
										rules={[
											{
											  required: true,
											  message: 'Please input your Password!',
											},
										  ]}
										>
                                        <Input.Password />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" className="right-align-text">Login</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Grid>
                </Card>
				</Spin>
            </Col>
        </Row>
	}
	{ isLoggedIn && <Navigate to="/" replace={true} />
	}
	</>
		);
}

export default Login;
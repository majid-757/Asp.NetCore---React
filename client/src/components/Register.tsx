import { Button, Card, Form, Input, notification, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Register } from '../models/user'
import { registerUser } from '../redux/slice/userSlice'
import { useAppDispatch } from '../redux/store/configureStore'

const { Text, Title } = Typography

interface Props {
  toggleRegister: () => void
}

const RegisterComponent = ({ toggleRegister }: Props) => {
  const dispatch = useAppDispatch()

  const [values, setValues] = useState<Register>({
    email: '',
    password: '',
    username: '',
  })

  const { email, password, username } = values

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }
  const [form] = Form.useForm()

  const resetForm = () => {
    setValues({ ...values, email: '', password: '' })
    form.resetFields()
  }

  const history = useHistory()

  const submitUser = async (e: SyntheticEvent) => {
    e.preventDefault()
    try {
      if (
        email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
        password.length >= 6 &&
        username.length >= 5
      ) {
        await dispatch(registerUser(values))
        history.push('profile')
      }
      resetForm()
    } catch (err: any) {
      if (err.error) {
        for (const val of err.error) {
          notification.error({
            message: val,
          })
        }
      }
      resetForm()
    }
  }

  return (
    <>
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Typography>
            <Title level={2} className="log-in-card__intro-title">
              Sign up with Learnify!
            </Title>
            <Text>Use your Username, Email and Password to Register</Text>
          </Typography>
        </div>
        <Content className="log-in__form">
          <Form
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onSubmitCapture={submitUser}
            form={form}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                  min: 5,
                },
              ]}
            >
              <Input value={username} name="username" onChange={handleChange} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              ]}
            >
              <Input value={email} name="email" onChange={handleChange} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                  min: 6,
                },
              ]}
            >
              <Input.Password
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
        <div onClick={toggleRegister} className="log-in-card__toggle">
          Already a User? Sign in
        </div>
      </Card>
    </>
  )
}

export default RegisterComponent

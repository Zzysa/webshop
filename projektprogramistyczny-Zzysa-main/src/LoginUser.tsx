import { Formik, Field, Form, ErrorMessage } from 'formik';
import { UserContext, User } from './App';
import { useContext, useState } from 'react';
import { users } from "../users.ts";
import { useNavigate } from 'react-router-dom';
import { checkPassword } from '../users.ts';    

function LoginForm() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState<string | null>(null);

    function userCheck(values: { email: string; password: string }) {
        const foundUser = users.find((user: User) => user.email === values.email);
    
        if (foundUser && checkPassword(values.password, foundUser.password)) {
            setUser(foundUser);
            navigate("/");
        } else {
            console.warn('User not found or incorrect password');
            setLoginError("Error, you wrote incorrect password or email");
        }
    }

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values) => {
            const errors: { email?: string; password?: string } = {};

            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Invalid email format';
            }

            if (!values.password) {
                errors.password = 'Password is required';
            } else if (values.password.length < 8) {
                errors.password = 'Password must be at least 8 characters';
            }

            return errors;
            }}
            onSubmit={userCheck}
        >
            <Form>
                <div className='emailContainer'>
                    <p>Email address</p>
                    <Field type="email" id="email" name="email" placeholder="Enter email..." />
                    <ErrorMessage name="email" component="div" className='errorLoginMessage'/>
                </div>

                <div className='passwordContainer'>
                    <p>Password</p>
                    <Field type="password" id="password" name="password" placeholder="Enter password..." />
                    <ErrorMessage name="password" component="div" className='errorLoginMessage'/>
                </div>

                {loginError && 
                    <div className='errorLoginMessage'>
                        <p>{loginError}</p>
                    </div>}

                <button type="submit">Login</button>
            </Form>
        </Formik>
    );
}

export default LoginForm;

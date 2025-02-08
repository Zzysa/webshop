import { Formik, Field, Form, ErrorMessage } from 'formik';
import { users, saveUsers } from '../users.ts';
import { User, UserContext } from './App';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../users.ts';

function SigninUser() {
    const { setUser } = useContext(UserContext);
    const [signinError, setSigninError] = useState<string | null>(null);
    const navigate = useNavigate()

    function signinCheck(values: { name: string, surname:string, email: string; password: string }) {
            const foundUser = users.find((user: User) => user.email === values.email);
    
            if (foundUser) {
                console.warn('Users login is used');
                setSigninError("Error, your email is used")
            } else {        
                const newUser: User = { 
                    id: users.length,
                    name: values.name,
                    surname: values.surname,
                    email: values.email,
                    password: hashPassword(values.password),
                    role: "User" 
                }
                users.push(newUser);
                saveUsers(users);
                setUser(newUser)
                navigate("/")
                console.log('New user created:', newUser);
            }
    }

    return (
        <Formik
            initialValues={{ id: users.length, name: '', surname: '', email: '', password: '', role: "User" }}
            validate={(values) => {
            const errors: { name?: string; surname?: string; email?: string; password?: string; } = {};

            if (!values.name) {
                errors.name = 'Name is required';
            }

            if (!values.surname) {
                errors.surname = 'Surname is required';
            } 

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
            onSubmit={signinCheck}
        >
            <Form>
                <div className='nameContainer'>
                    <p>Name</p>
                    <Field type="name" id="name" name="name" placeholder="Enter name..." />
                    <ErrorMessage name="name" component="div" className='errorSigninMessage'/>
                </div>

                <div className='surnameContainer'>
                    <p>Surname</p>
                    <Field type="surname" id="surname" name="surname" placeholder="Enter surname..." />
                    <ErrorMessage name="surname" component="div" className='errorSigninMessage'/>
                </div>
                
                <div className='emailContainer'>
                    <p>Email address</p>
                    <Field type="email" id="email" name="email" placeholder="Enter email..." />
                    <ErrorMessage name="email" component="div" className='errorSigninMessage'/>
                </div>

                <div className='passwordContainer'>
                    <p>Password</p>
                    <Field type="password" id="password" name="password" placeholder="Enter password..." />
                    <ErrorMessage name="password" component="div"className='errorSigninMessage' />
                </div>

                {signinError && 
                    <div className='errorSigninMessage'>
                        <p>{signinError}</p>
                    </div>}

                <button type="submit">Create an account</button>
            </Form>
        </Formik>
    );
}

export default SigninUser;

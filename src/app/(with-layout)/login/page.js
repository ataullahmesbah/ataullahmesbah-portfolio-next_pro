'use client';

import { signIn } from 'next-auth/react'

const Login = () => {
    return (
        <div>
            <button onClick={() => signIn()}>LogIn</button>
        </div>
    );
};

export default Login;